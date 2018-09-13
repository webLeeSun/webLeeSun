// exports.ondispatched - 分配回调
// exports.onready  - 连接建立完成，此后数据不会进入缓冲区
// exports.ondrain  - 缓冲区消息发送完成
// exports.onpacket - 收到的数据；当个 packet.opcode & exports.OPCODE_CONFIRM 时，消息需要确认，请调用 exports.confirm(packet）
// exports.onclose  - 连接断开，一般会自动进行重连，在此之后要发送的消息将计入缓冲区
// exports.onfail   - 某条需要确认的消息未能在 15 秒内获得回复的确认消息
// exports.confirm(packet) - 确认某条消息已收到
// exports.write(opcode, command, expire, body, [cache=true]) - 发送一条消息，当 cache = true 时，连接未建立前也可已进行消息发送
// exports.parse(packet)   - 解析并返回一个 object

let DEBUG = false;

Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value
}

function createGuid() {
    var guid = "7773" + ("0000000000000000" + Date.now().toString(16)).substr(-16) + ("000000000000" + parseInt(Math.random() * 1000000000, 10).toString(16)).substr(-12)
    localStorage.setItem("notify:guid", guid)
    return guid
}
function serialize(data) {
    var encoded = ""
    for(var name in data) {
        encoded += name + "=" + encodeURIComponent(data[name]) + "&"
    }
    return encoded
}
function Z(v, l) {
    var z = ""
    for(var i=0;i<l;++i) z += "0"
    return (z + v.toString(16)).substr(- l)
}

 function websocket(xid){
	var connectTimes = 0;
	var json = {};
	var timeout_frozen_timer = null;//防僵死重连
	
	//  :)
	var socket = window.WebSocket,
		VERSION = "02",

		options = {
			guid: localStorage.getItem("notify:guid") || createGuid(),
			id:   "0000000000000000",
			rnd:  "0000000000000000bcf7a7571f5b018c",
			addr: "127.0.0.1",
			port: 56001,
			baddr: "127.0.0.1",
			bport: 56002,
			timeout:null,
			timeout_break: 10, //重连间隔
			timeout_frozen: 7200,
			incr: 1,
		},
		connecting = false,
		cached = [], // 缓冲网络未建立前发送的消息
		confirmMsg = {}; // 需要但还未确认的消息

	function start(platform, channel, version) {

		// TODO 是否需要检查 Cookie ？（对于 WebSocket 而言，没有登录的用户是没有办法连接长连服务的）
		var data = {
			"cluster": "ws", // 连接 WebSocket 集群
			"guid": options.guid,
			"plat": platform || "pc_web",
			'xid':xid || '',
			"time":parseInt(new Date().getTime()/1000, 10)
		}
		channel ? data.chn = channel : null;
        version ? data.ver = version : null;
        
		//DEBUG && console.log('请求online',new Date())
		if(connectTimes > 3){
			clearTimeout(timeout_frozen_timer);
			DEBUG && console.log("commonTips","网络异常连接失败");
			return false
        }

        fetch("https://online.panda.tv/dispatch?"+ serialize(data), {
            credentials: 'include',
            headers: {
                'Accept': 'application/json, text/plain, */*'
            },
        })
        .then((res)=>{
            return res.json();
        })
        .then((data)=>{
            connectTimes++;
			if(data.error in ["ILLEGAL_SIGN"]){
				DEBUG && console.log("commonTips",data.error);
				return 
			}
			json.ondispatched && json.ondispatched(data)
			options = Object.assign(options, data);
			clearTimeout(timeout_frozen_timer);
			timeout_frozen_timer = setTimeout(function() { // 强制重连，防止僵死
				socket.close()
				DEBUG && console.log('timeout_frozen ',new Date())
			}, parseInt(options.timeout_frozen + 100 * Math.random(), 10) * 1000)
			json.connect()
			listen()
        })
        
	};

	function parse(hex) {
		if(hex.length < 48) return null
		var packet = {}
		packet.version = parseInt(hex.substr(0, 2), 16)
		packet.opcode  = parseInt(hex.substr(2, 2), 16)
		// packet.forward = parseInt(hex.substr(4, 4), 16)
		packet.id      = hex.substr(8, 16)
		packet.command = parseInt(hex.substr(24, 8), 16)
		// packet.expire  = Date.now()/1000 > parseInt(hex.substr(32, 8), 16) ? false : true
		// packet.length  = parseInt(hex.substr(40, 8), 16)
		packet.body    = hex.substr(48)
		return packet
	}

	function connect(addr, port, fail) {

		try{
			// 目前还不支持基于 HTTPS 的 WebSocket
			// debugger;
			socket = new WebSocket("ws://" + addr + ":" + port + "/");
			window.ws = socket;
		}catch(e) {
			socket = null
		}
		if(socket) {
			setTimeout(function() {
				if(socket.readyState === WebSocket.OPEN) return
				fail && fail()
			}, 3000)
			listen()
		}else{
			fail && fail()
		}
	}

	function connect2() {
		//DEBUG && console.log('in  connect2',new Date())
		connect(options.addr, options.port, function() {
			connect(options.baddr, options.bport, function() {
				var timeout = parseInt( options.timeout_break + 5 * Math.random() , 10)
				connecting = false;
				setTimeout(json.start, timeout*1000)
			})
		})
	}


	function listen() {
		socket.onopen = function() {
			connecting = false
			writeHello()
		}
		socket.onmessage = function(e) {
			var packet = parse(e.data)
			if(!packet) {
				socket.close()
			}
			if(packet.command === json.COMMAND_CONFIRM) {
				if(confirmMsg[packet.id]) { // 确认消息
					clearTimeout(confirmMsg[packet.id].wait)
					delete confirmMsg[packet.id]
				}else{ // 回复 Hello 的确认
					connecting = false
					if(json.onready) {
						var id = parse(e.data).id;
						options.id = id;

						// 强制重连，防止僵死
						clearTimeout(options.timeout);
						options.timeout = setTimeout(function() { 
							socket.close();
						}, parseInt(options.timeout_frozen + 100 * Math.random(), 10) * 1000);

						json.onready();
					}else{
						//DEBUG && console.info("[notify]", "ready")
					}
					drainCache()
				}
				options.delta = (Date.now() - parseInt(packet.body.substr(0,8), 16) * 1000) || 0;
				//options.id = packet.body.substr(0,8) + "" + guid.substr(-4)
			}else if(json.onpacket) {
				json.onpacket(packet)
			}else{
				DEBUG && console.info("[notify]", "message received:", packet)
			}
			if(!packet){
				//debugger
			}
			if(packet.opcode & json.OPCODE_CONFIRM) {
				confirm(packet)
			}
		}
		socket.onclose = function(tag) {
			//DEBUG && console.log('closed',new Date())
			var timeout = parseInt( options.timeout_break + 5 * Math.random() , 10)
			json.onclose && json.onclose()

			//connecting = true
			// 重新连接必须有一定的间隔
			if(!tag){
				setTimeout(json.start, parseInt(timeout * 1000, 10))
				DEBUG && console.warn("[notify]","websocket closed, reconnect in", timeout + "s");
			}else{
				DEBUG && console.info("[notify]","websocket closed");
			}
		}
	}
	function drainCache() {
		if(cached.length > 0) {
			var argv
			while((argv = cached.shift()) !== null) {
				json.write.apply(json, argv)
			}
			if(json.ondrain) {
				json.ondrain()
			}else{
				DEBUG && console.info("[notify]", "cached message drained")
			}
		}
	}
	function writeHello() { // 连接握手
		//DEBUG && console.log('连接握手',new Date())
		socket.send(VERSION + "800000" + options.id + "800000010000000000000040" + options.guid + options.rnd)
	}

	function confirm(packet) { // 下行确认
		//DEBUG && console.log('下行确认',packet,new Date())
		if(packet.opcode & json.OPCODE_CONFIRM) {
			socket.send(VERSION + "000000" + packet.id + "800000000000000000000000")
		}
	}

	// 当数据被缓冲或无法发送时返回 false，否则返回 true
	function write(opcode, command, expire, body, cacheFlag) {
		//DEBUG && console.log('发送消息',new Date())
		if(!Number.isInteger(opcode) || !Number.isInteger(command)) {
			throw new Error("notify.write 'opcode' and 'command' must be a Integer")
		}
		if(expire instanceof Date) {
			expire = parseInt(expire.getTime()/1000, 10)
		}
		if(body && options.id){
			body.msgid = options.id;
		}else{
			//DEBUG && console.warn("msgid undefined");
		}
		if(typeof body === "object") body = JSON.stringify(body)
		// 在连接连接未建立时是否自动缓冲数据
		if(cacheFlag === undefined) cacheFlag = true
		if(cacheFlag){
			if(!socket || socket.readystate !== WebSocket.OPEN) {
				cached.push([command, expire, body, false])
				return false
			}
		}
		options.id = ("00000000" + parseInt((Date.now() - options.delta)/1000, 10).toString(16)).substr(-8)
			+ ("0000" + (options.incr += 2).toString(16)).substr(-4) + options.guid.substr(-4)
		socket.send(VERSION + Z(opcode, 2) + "0000" + options.id + Z(command, 8) + Z(expire, 8) + "00000000" + body)
		if(opcode & json.OPCODE_CONFIRM) {
			confirmMsg[options.id] = { // 需要确认的消息
				argv: Array.prototype.slice.call(arguments, 0),
				wait: setTimeout(onConfirmTimeout.bind(null, options.id), 15000)
			}
		}
		var id = options.id
		//options.id = options.id.substr(0, 8) + ("0000" + (parseInt(id.substr(8, 4), 16) + 1).toString(16)).substr(-4) + options.id.substr(-4)
		//DEBUG && console.log(options.id)
		return id
	}
	// 未能确认的消息需要回调处理
	function onConfirmTimeout(id) {
		//DEBUG && console.log('未能确认的消息 ',id,new Date())
		if(json.onfail) {
			json.onfail(id, confirmMsg[id])
		}else{
			DEBUG && console.error("[notify]","message not confirmed after timeout", id, confirmMsg[id])
		}
		delete confirmMsg[id]
	}

	json = {
		COMMAND_CONFIRM : 0x80000000,
		OPCODE_CONFIRM  : 0x80,
		start:start,
		parse:parse,
		connect:function(addr, port) {
			//DEBUG && console.log('尝试连接 ',new Date())
			if(connecting === true) return
			if(addr) options.addr = addr
			if(port) options.port = port
			connecting = true;
			connect2();
		},
		close:function(){
			//DEBUG && console.log('主动关闭 ',new Date())
			socket.close();
		},
		readyState:function(){
			return socket.readyState;
		},
		delta:function(){return options.delta},
		confirm:confirm,
        write:write,
        parseMessage: function(data, cmd) {
            DEBUG && console.log(data)
            if(!ws.message){
            	throw new Error('ws.message is not a function ');
            	return;
            }
            ws.message(data, cmd)
        }
	}
	return json;
};

let socket = {readyState(){return null}};

var ws = {
	DEBUG:false,
	init:(xid, DEBUG)=>{
		DEBUG = (DEBUG || false);
       socket = websocket(xid);
       socket.start();

        // socket 解析器
        socket.parseMessage = function(data, cmd) {
            DEBUG && console.log(data)

            if(!ws.message){
            	throw new Error('ws.message is not a function ');
            	return;
            }
            ws.message(data, cmd)
        }
        socket.onpacket = function(data) {
            //确认收到消息-内部确认了
            //socket.confirm(data);

            if (data.command && data.command === 1000) {
                //消息发送成功
                //DEBUG && console.log(data,"发送成功")
                return
            };

			if (data.command && data.body) {
				data.body = JSON.parse(data.body);
			}
	
            DEBUG && console.log('ws:message');
            socket && socket.parseMessage && socket.parseMessage(data.body, data.command);

        };
        socket.ondispatched = function() {
            DEBUG && console.log('ws:ondispatched')
        }

        socket.onready = function() {
            DEBUG && console.log('ws:onready')
            DEBUG && console.log('player:长连接建立完成');
        };

        socket.onclose = function() {
        }

        socket.onfail = function(id, a) {
            DEBUG && console.log('ws:onfail')
        }
	},
	message(data, cmd){
		this.callback(data, cmd)
	},
	onmsg(cb){
		this.callback = cb;
	},
    write(a,b,c,d){
        socket.write(socket.OPCODE_CONFIRM, a,b,c,d);
    },
    close(){
        socket.close(true);
        socket = null;
        // ws = null;
    }
}

export default ws
