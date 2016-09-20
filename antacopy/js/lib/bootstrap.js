//强制页面的域是qq.com
try{
	document.domain = "qq.com";
}catch(e){

}

//加载运维监测js
var oHead = document.getElementsByTagName('HEAD').item(0);
var oScript= document.createElement("script");
oScript.type = "text/javascript";
oScript.src="http://appmedia.qq.com/media/jslib/1.5/src/util/mo2.js";
oHead.appendChild(oScript);

document.onkeydown = function(event){
    if(navigator.appName != "Microsoft Internet Explorer" && event.keyCode==17&&event.keyCode==18&&event.keyCode==75){
        var oScript= document.createElement("script");
        oScript.type = "text/javascript";
        oScript.src="http://appmedia.qq.com/media/at.addev.com/js/autoTestQQ.js";
        oHead.appendChild(oScript);
    }
}

//获取全局参数
var _cpid     = "";
var _appid    = "";
var _daid     = "";
var _toolbar  = false;
var _board	  = false;
var _isLLogin = false;
var _track	  = false;
var _token	  = true;
var _path     = '';

//获取jslib启动文件，ID方式和src方式都支持
var _jslibNode = document.getElementById('jslibNode');
if(_jslibNode == null || _jslibNode.src.indexOf("jslib/1.5/bootstrap.js") === -1){
	var jsNodes = document.getElementsByTagName('script');
	for(var i in jsNodes){
		if(!jsNodes[i].src) continue;
		if(jsNodes[i].src.indexOf("jslib/1.5/bootstrap.js") >= 0){
			_jslibNode = jsNodes[i];
			break;
		}
	}
}

//获取jslib配置参数
try {
	var _args = _jslibNode.getAttribute('arg');
	var _cfg  = _jslibNode.getAttribute('cfg');
	//参数
	_cpid     = _args.match('[\'|\"]\s*cpid\s*[\'|\"]\s*:\s*[\'|\"]*[0-9]{9}')[0].match('[0-9]{9}')[0];
	_appid    = _args.match('[\'|\"]\s*appid\s*[\'|\"]\s*:\s*[\'|\"]*[0-9]{7}')[0].match('[0-9]{7}')[0];
	if(_args.indexOf('daid') >-1){
		_daid     = _args.match('[\'|\"]\s*daid\s*[\'|\"]\s*:\s*[\'|\"]*[0-9]{1,30}')[0].match('[0-9]{1,30}')[0];
	}
	//配置
	if(_cfg.match('[\'|\"]\s*toolbar\s*[\'|\"]\s*:\s*[\'|\"]*[A-Z,a-z]{4,5}')){
		_toolbar  = _cfg.match('[\'|\"]\s*toolbar\s*[\'|\"]\s*:\s*[\'|\"]*[A-Z,a-z]{4,5}')[0].match('true|false')[0] == "true" ? true : false;
	}
	if(_cfg.match('[\'|\"]\s*board\s*[\'|\"]\s*:\s*[\'|\"]*[A-Z,a-z]{4,5}')){
		_board  = _cfg.match('[\'|\"]\s*board\s*[\'|\"]\s*:\s*[\'|\"]*[A-Z,a-z]{4,5}')[0].match('true|false')[0] == "true" ? true : false;
	}
	if(_cfg.match('[\'|\"]\s*isLLogin\s*[\'|\"]\s*:\s*[\'|\"]*[A-Z,a-z]{4,5}')){
		_isLLogin = _cfg.match('[\'|\"]\s*isLLogin\s*[\'|\"]\s*:\s*[\'|\"]*[A-Z,a-z]{4,5}')[0].match('true|false')[0] == "true" ? true : false;
	}
	if(_cfg.match('[\'|\"]\s*track\s*[\'|\"]\s*:\s*[\'|\"]*[A-Z,a-z]{4,5}')){
		_track 	  = _cfg.match('[\'|\"]\s*track\s*[\'|\"]\s*:\s*[\'|\"]*[A-Z,a-z]{4,5}')[0].match('true|false')[0] == "true" ? true : false;
	}
	if(_cfg.match('[\'|\"]\s*token\s*[\'|\"]\s*:\s*[\'|\"]*[A-Z,a-z]{4,5}')){
		_token 	  = _cfg.match('[\'|\"]\s*token\s*[\'|\"]\s*:\s*[\'|\"]*[A-Z,a-z]{4,5}')[0].match('true|false')[0] == "false" ? false : true;
	}
	if(_cfg.match('[\'|\"]\s*path\s*[\'|\"]\s*:\s*[\'|\"](.*)[\'|\"]')){
		_path     = _cfg.match('[\'|\"]\s*path\s*[\'|\"]\s*:\s*[\'|\"](.*)[\'|\"]')[1];
	}
	_path     = (_path == '') ? '' : '/' + _path;
} catch(e) {
	alert("\u53c2\u6570\u9519\u8bef\uff01");				//参数错误！
}

//给jquery的ajax自动添加CSRFToken
if (typeof jQuery != 'undefined' && _token){
	jQuery.ajaxSetup({
		'beforeSend': function(xhr,options){
			var token = Act.util.getACSRFToken();
			var url = options.url;
			if(options.type.toLowerCase() == "get"){
				options.url += url.indexOf("?") > 0 ? (url.indexOf("g_tk=") < 0 ? "&g_tk=" + token : "") : "?g_tk=" + token;
			}else{
				if(options.data){
					if(typeof options.data == 'string'){
						options.data += options.data.indexOf("g_tk=") < 0 ? "&g_tk=" + token : "";
					}
				}else{
					options.data = "g_tk=" + token;
					options.url += url.indexOf("?") > 0 ? (url.indexOf("g_tk=") < 0 ? "&g_tk=" + token : "") : "?g_tk=" + token;
				}
			}
			return options;
		}
	})
}

//加载sea.js
(function(m, o, d, u, l, a, r) {
	if(m[d]) return;
	function f(n, t) { return function() { r.push(n, arguments); return t;};}
	m[d] = a = { args: (r = []), config: f(0, a), use: f(1, a) };
	m.define = f(2);
	u = o.createElement('script');
	u.id = d + 'node';
	u.src = 'http://appmedia.qq.com/media/jslib/1.5/sea.js';
	l = o.getElementsByTagName('head')[0];
	a = o.getElementsByTagName('base')[0];
	a ? l.insertBefore(u, a) : l.appendChild(u);
})(window, document, 'seajs');

//seajs配置, 设置jslib的根目录
seajs.config({
	base : 'http://appmedia.qq.com/media/jslib/1.5/src',
    alias: {
        'baseCss': '../../res/css/base.css',
        'jsLibStyle': '../../res/css/jslib.css',
        '$': 'lib/jquery-1.8.3.js',
        'Class': 'base/class',
        'JSON': 'base/json2'
    }
});

//定义jslib对外的唯一类名
var Act = {
	//基本参数
	tamsid   : _cpid,	//活动id
	appid    : _appid,	//appid
	daid     : _daid, //DomainID
	base_url : 'http://' + window.location.host + _path,
	ptlogin  : {},		//qq登录，验证码
	util     : {},		//头像，cookie等
	dialog   : {},		//弹出层，消息框
	ajax     : {},		//ajax
	qzone    : {},		//qzone功能组件
	weibo    : {},		//微博功能组件
	weixin	 : {},		//微信功能组件
	tae      : {},		//风车服务组件
	api      : {},		//接口服务组件
	ept      : {}		//对外(如：toolbar,aslib)提供的函数库
};

//定义domready函数
var domReady = !+'\v1' ? function(f) {
	(function() {
		if(parent != self){
			//iframe模式
			var fmState = function(){
				var state=null;
				if(document.readyState){
					try{
						state=document.readyState;
					}catch(e){
						state=null;
					}
					if(state=="complete" || !state){//loading,interactive,complete//onComplete();
						f();return;
					}
					window.setTimeout(fmState,10);
				}
			};
			if(fmState.TimeoutInt) window.clearTimeout(fmState.timeoutInt);
			fmState.timeoutInt = window.setTimeout(fmState,400);
		}
		else{
			//普通模式
			try{
				document.documentElement.doScroll('left');
			} catch (error) {
				setTimeout(arguments.callee, 0);
				return;
			};
			f();
		}
	})();
} : function(f) {
	document.addEventListener('DOMContentLoaded', function(){
		document.removeEventListener("DOMContentLoaded", arguments.callee, false);
		f();
	}, false);
};

//函数使用上报
var funRpt = function(funName){
	seajs.use('util/report', function(r) {
		r.funRpt(funName);
	});
};

//js出错上报
window.onerror = function(msg,url,l){
	seajs.use('util/report', function(r) {
		r.errorRpt(msg,url,l);
	});
	return false;
};

//速度监测上报
seajs.use('util/report', function(r) {
	r.setTimingRpt();
});

/**
 * ptlogin, 登录，验证码
 */
Act.ptlogin = {
	//判断是否登录
	isLogin : function() {
		funRpt('Act.ptlogin.isLogin');
		var uin  = (_isLLogin == true) ? (Act.util.cookie('uin') || Act.util.cookie('luin')) : Act.util.cookie('uin');
		var skey = (_isLLogin == true) ? (Act.util.cookie('skey') || Act.util.cookie('lskey')) : Act.util.cookie('skey');
		if (uin && uin.length > 4 && skey && skey.length > 0) return true;
		return false;
	},

	//获得登录的QQ号码
	getQQNum : function() {
		funRpt('Act.ptlogin.getQQNum');
		var _uin = (_isLLogin == true) ? (Act.util.cookie('uin') || Act.util.cookie('luin')) : Act.util.cookie('uin');
		if(_uin == null) return 0;
		_uin = _uin.substr(1);
		_uin++; _uin--;
		return _uin;
	},

	//登录QQ
	login : function(param,option){
		seajs.use('ptlogin/auth', function(p) {
			p.login(param,option);
		});
		funRpt("Act.ptlogin.login");
	},

	//退出QQ登录
	logout : function(param){
		seajs.use('ptlogin/auth', function(p) {
			p.logout(param);
		});
		funRpt("Act.ptlogin.logout");
	},

	//验证码
	vcodeShow: function(callback, data){
		seajs.use('ptlogin/verifycode', function(v) {
			v.show(callback, data);
		});
		funRpt('Act.ptlogin.vcodeShow');
	},

	//刷新验证码
	vcodeChange: function(imgId, inputBoxId, isFocus){
		seajs.use('ptlogin/verifycode', function(v) {
			v.change(imgId, inputBoxId, isFocus);
		});
		funRpt('Act.ptlogin.vcodeChange');
	}
};

/**
 * dialog, 弹出层（QZone蓝色风格）
 */
Act.dialog = {
	//弹出展示框
	message:  function(param){
		seajs.use('dialog/dialog', function(d) {
			d.message(param);
		});
		funRpt('Act.dialog.message');
	},

	//弹出对话框
	alert : function(text, callback, param){
		seajs.use('dialog/dialog', function(d) {
			d.alert(text, callback, param);
		});
		funRpt('Act.dialog.alert');
	},

	//弹出确认框
	confirm : function(text, ok, cancel, param){
		seajs.use('dialog/dialog', function(d) {
			d.confirm(text, ok, cancel, param);
		});
		funRpt('Act.dialog.confirm');
	},

	//弹出输入框
	prompt :  function(text,callback, param){
		seajs.use('dialog/dialog', function(d) {
			d.prompt(text, callback, param);
		});
		funRpt('Act.dialog.prompt');
	},

	//Loading框
	loading : function(text, timeout, param){
		seajs.use('dialog/dialog', function(d) {
			d.loading(text, timeout, param);
		});
		funRpt('Act.dialog.loading');
	},

    //关闭浮层
    close: function(){
        seajs.use('dialog/dialog', function(d) {
            d.close();
        });
        funRpt('Act.dialog.close');
    }
};

/**
 * ajax, ajax相关功能组件
 */
Act.ajax = {
	syncAjax : function(url, type, data){
		seajs.use('ajax/ajax', function(a) {
			a.syncAjax(url, type, data);
		});
		funRpt('Act.ajax.syncAjax');
	},

	get : function(url, callback, dataType){
		seajs.use('ajax/ajax', function(a) {
			a.get(url, callback, dataType);
		});
		funRpt('Act.ajax.get');
	},

	post : function(url, data, callback, type) {
		seajs.use('ajax/ajax', function(a) {
			a.post(url, data, callback, type);
		});
		funRpt('Act.ajax.post');
	},

	getScript : function(url, callback){
		seajs.use('ajax/ajax', function(a) {
			a.getScript(url, callback);
		});
		funRpt('Act.ajax.getJSON');
	},

	getJSON : function(url, callback){
		seajs.use('ajax/ajax', function(a) {
			a.getJSON(url, callback);
		});
		funRpt('Act.ajax.getJSON');
	},

	getJSONP : function(url, callback) {
		seajs.use('ajax/ajax', function(a) {
			a.getJSONP(url, callback);
		});
		funRpt('Act.ajax.getJSONP');
	},

	getJSONPS : function(url, callback) {
		seajs.use('ajax/ajax', function(a) {
			a.getJSONPS(url, callback);
		});
		funRpt('Act.ajax.getJSONPS');
	},

	getHTML : function(url, callback){
		seajs.use('ajax/ajax', function(a) {
			a.getHTML(url, callback);
		});
		funRpt('Act.ajax.getHTML');
	}
};

/**
 * qzone, qzone相关功能组件
 */
Act.qzone = {
	//qzone分享
	share : function(url,option){
		seajs.use('qzone/base', function(b) {
			b.share(url,option);
		});
		funRpt('Act.qzone.share');
	},

    albums: function(options){
        seajs.use('qzone/albums', function(qzoneAlbums) {
            new qzoneAlbums(options);
        });
        funRpt('Act.qzone.albums');
    }
};

/**
 * weibo, weibo相关功能组件
 */
Act.weibo = {
	//微博分享
	share : function(url,option){
		seajs.use('weibo/base', function(b) {
			b.share(url,option);
		});
		funRpt('Act.weibo.share');
	},

	//活动社交面板
	board : function(options){
		seajs.use('weibo/board', function(b) {
			b.board(options);
		});
		funRpt('Act.weibo.board');
	}
};

/**
 * qq, qq相关功能组件
 */
Act.qq = {
	//微博分享
	share : function(url,option){
		seajs.use('qq/base', function(b) {
			b.share(url,option);
		});
		funRpt('Act.qq.share');
	}
};

/**
 * qzone, qzone相关功能组件
 */
Act.weixin = {
	//weixin分享
	share : function(option){
		seajs.use('weixin/base', function(b) {
			b.share(option);
		});
		funRpt('Act.weixin.share');
	}
};

/**
 * tae, 风车相关服务功能
 */
Act.tae = {
	//投票服务
	vote : function(vid,callback,voteType){
		seajs.use('tae/vote', function(t) {
			t.vote(vid,callback,voteType);
		});
		funRpt('Act.tae.vote');
	},

	//无验证码投票服务
	voteNoVcode : function(vid,callback,voteType){
		seajs.use('tae/vote', function(t) {
			t.voteNoVcode(vid,callback,voteType);
		});
		funRpt('Act.tae.voteNoVcode');
	},

	//图片上传服务
	uploadPic : function(nodeId,callbackName,watermark){
		seajs.use('tae/upload', function(t) {
			t.uploadPic(nodeId,callbackName,watermark);
		});
		funRpt('Act.tae.uploadPic');
	},

	//视频上传服务
	uploadVideo : function(nodeId,obj,callbackName,requiredTypes){
		seajs.use('tae/upload', function(t) {
			t.uploadVideo(nodeId,obj,callbackName,requiredTypes);
		});
		funRpt('Act.tae.uploadVideo');
	},

	//通用文件上传服务
	uploadCommon : function(nodeId,callbackName,requiredTypes){
		seajs.use('tae/upload', function(t) {
			t.uploadCommon(nodeId,callbackName,requiredTypes);
		});
		funRpt('Act.tae.uploadCommon');
	},

	//抽奖服务
	lottery: function(options) {
		seajs.use('tae/lottery', function(t) {
			t.lottery(options);
		});
		funRpt('Act.tae.lottery');
	}
};

/**
 * util, 通用工具等相关服务功能
 */
Act.util = {
	//pv、uv监测
	track: function() {
		seajs.use('util/base', function(b) {
			b.initTrack();
		});
	},

	//点击监测
	clickMonitor: function(id){
		seajs.use('util/base', function(b) {
			b.clickMonitor(id);
		});
	},

	//上报到sqm
	sqmMonitor: function(attrID,value){
		seajs.use('util/base', function(b) {
			b.sqmMonitor(attrID,value);
		});
	},

	//qq头像
	qqHead: function(nodeId, uin, size){
		seajs.use('util/avatar', function(a) {
			a.qq(nodeId, uin, size);
		});
		funRpt('Act.util.qqHead');
	},

	//qzone头像
	qzoneHead: function(nodeId, uin, size){
		seajs.use('util/avatar', function(a) {
			a.qzone(nodeId, uin, size);
		});
		funRpt('Act.util.qzoneHead');
	},

	//weibo头像
	weiboHead: function(nodeId, uin, size, url){
		seajs.use('util/avatar', function(a) {
			a.weibo(nodeId, uin, size, url);
		});
		funRpt('Act.util.weiboHead');
	},

	//去除字符串首尾的空白字符
	trim : function(str){
		funRpt('Act.util.trim');
		return str.replace(/^\s*(.*?)\s*$/, "$1");
	},

	//cookie控制函数
	cookie : function(name, value, options){
		funRpt('Act.util.cookie');
		if (typeof value != 'undefined') { // name and value given, set cookie
			options = options || {};
			if (value === null) {
				value = '';
				options.expires = -1;
			}
			var expires = '';
			if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
				var date;
				if (typeof options.expires == 'number') {
					date = new Date();
					date.setTime(date.getTime() + (options.expires * 1000));
				}
				else {
					date = options.expires;
				}
				expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
			}
			var path = options.path ? '; path=' + options.path : '';
			var domain = options.domain ? '; domain=' + options.domain : '';
			var secure = options.secure ? '; secure' : '';
			document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
		}
		else { // only name given, get cookie
			var cookieValue = null;
			if (document.cookie && document.cookie != '') {
				var cookies = document.cookie.split(';');
				for (var i = 0; i < cookies.length; i++) {
					var cookie = cookies[i].replace(/^\s*(.*?)\s*$/, "$1");//this.trim(cookies[i]);
					// Does this cookie string begin with the name we want?
					if (cookie.substring(0, name.length + 1) == (name + '=')) {
						cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
						break;
					}
				}
			}
			return cookieValue;
		}
	},

	//获取ACSRFToken
    getACSRFToken : function(){
    	funRpt('Act.util.getACSRFToken');
		var skey = Act.util.cookie('skey');
		if('undefined' == typeof(skey) || !skey){
			skey = '';
		}
		if(skey == ''){
			var lskey = Act.util.cookie('lskey');
			if('undefined' == typeof(lskey) || !lskey){
				lskey = '';
			}
			skey = lskey;
		}
        var hash = 5381;
        for(var i = 0, len = skey.length; i < len; ++i){
            hash += (hash<<5&0x7fffffff) + skey.charAt(i).charCodeAt();
        }
        return hash & 0x7fffffff;
    },

    //将文本拷贝到剪贴板
    copyText : function(nodeId,str){
		seajs.use('util/copyText', function(c){
			c.copyText(nodeId,str);
		});
		funRpt('Act.util.copyText');
    },

    //加入收藏夹
    favorite : function(url,title){
		seajs.use('util/base', function(b) {
			b.favorite(url,title);
		});
		funRpt('Act.util.favorite');
    },

	//分页组件
	page: function(nodeId, funName, params, curPage, total, pageSize){
		seajs.use('util/page', function(p) {
			p.page(nodeId, funName, params, curPage, total, pageSize);
		});
		funRpt('Act.util.page');
	},

	//日期选择器
	calendar: function(nodeId,setting){
		seajs.use('util/calendar', function(c) {
			c.calendar(nodeId,setting);
		});
		funRpt('Act.util.calendar');
	},

	//QQ网络备忘录
	memo: function(title, content, date, type, weeks){
		seajs.use('util/qqmemo', function(qm) {
			qm.memo(title, content, date, type, weeks);
		});
		funRpt('Act.util.memo');
	},

	//页面载入后的操作
	readyRun: function(url,run){
		domReady(function(){
			if( "/" + url === window.location.pathname || "*" === url){
				run();
			}
		});
		funRpt('Act.util.readyRun');
	},

	getUrlParam: function(paramName){
		funRpt('Act.util.getUrlParam');
	    var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)", "i");
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) return r[2]; return null;
	},

	getMachineType: function(){
		funRpt('Act.util.getBrowserType');
		var type = 'pc';
		var u = navigator.userAgent.toLowerCase();
		if(u.indexOf('mobile') > -1){
			type = 'mobile';
		}else if(u.indexOf('iphone') > -1){
			type = 'mobile';
		}else if(u.indexOf('ipad') > -1){
			type = 'mobile';
		}else if(u.indexOf('phone') > -1){
			type = 'mobile';
		}else if(u.indexOf('blackberry') > -1){
			type = 'mobile';
		}else if(u.indexOf('meego') > -1){
			type = 'mobile';
		}else if(u.indexOf('rim') > -1){
			type = 'mobile';
		}
		return type;
	},

	filterXss: function(str){
			funRpt('Act.util.filterXss');
			var string = str.replace(/\&/g, "&amp;")
				            .replace(/</g,  "&lt;")
				            .replace(/>/g,  "&gt;")
				            .replace(/"/g,  "&quot;")
				            .replace(/'/g,  "&#39;")
				            .replace(/,/g,  "&#44;")
				            .replace(/\(/g, "&#40;")
				            .replace(/\)/g, "&#41;")
				            .replace(/\?/g, "&#63;")
				            .replace(/\*/g, "&#42;")
				            .replace(/\//g, "&#47;")
				            .replace(/\\/g, "&#92;")
				            .replace(/\+/g, "&#43;")
				            .replace(/\-/g, "&#45;")
				            .replace(/\./g, "&#46;");
	       return string;
	},

	qrcode: function(text,size){
		funRpt('Act.util.qrcode');
		var size = size || 6;
		var text = text || "";
		var url = "http://labs.api.act.qq.com/631007063/qrcode/get_image/";
		return url + "?format=png&size=" + size + "&msg=" + encodeURIComponent(text);
	},

	citySelect : function(settings){
		seajs.use('util/citySelect.js', function(city) {
			city.citySelect(settings);
		});
		funRpt('Act.util.citySelect');
	}

};

//正则校验
var _regulars = {
    Mobile: /^1(3|4|5|8)\d{9}$/,
    Phone: /^(\d{3,4}[-|——|_|\s]+)?\d{7,8}([-|——|_|\s]+\d{2,6})?$/,
    ZipCode: /^[1-9]\d{5}(?!\d)$/,
    QQ: /^[1-9][0-9]{4,9}$/,
    IP: /^((?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/,
    Mail: /^([a-zA-Z0-9]+[-|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
    Certificate: /^\d{6}((\d{2}((0[1-9])|(1[0-2]))[0-3]\d{4})|((19|20)\d{2}((0[1-9])|(1[0-2]))[0-3]\d{4}[0-9xX]?))$/,
    Chinese: /^[\u4e00-\u9fa5]+$/,
    Letter: /^[a-zA-Z]+$/,
    Number: /^[-]?\d+((\.\d+)|(\d*))$/,
    Int: /^[-]?\d+$/,
    Float: /^[-]?\d+\.\d+$/,
    Url: /^(https|http):\/\/(((?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))|(([\w-]+).)+[a-zA-Z]{2,6}|localhost)(:[0-9]{1,6})?(\/[\w-]+)*((\/([\w-]+\.)+[\w-]{1,5})|\/)?$/,
    Link: /^(https|http):\/\/(((?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))|(([\w-]+).)+[a-zA-Z]{2,6}|localhost)(:[0-9]{1,6})?(\/[\w-]+)*((\/([\w-]+\.)+[\w-]{1,5})|\/)?((\?|\#)\S*)?$/
}

for(var i in _regulars){
    (function(i){
        Act.util['is' + i] = function(text){
            return _regulars[i].test(text);
        }
    })(i)
}

/**
 * api, 调用接口服务相关功能
 */
Act.api = {
	//发起api请求
	call : function(param){
		seajs.use('api/libcall', function(lc) {
			lc.call(param);
		});
		funRpt('Act.api.call');
	},
	//proxy中回调通知
	setCallReady : function(){
		seajs.use('api/libcall', function(lc) {
			lc.setCallReady();
		});
	}
};

/**
 * ept, 对外(如：toolbar,aslib)提供的函数库
 */
Act.ept = {
	isLogin : function(){
		return Act.ptlogin.isLogin();
	},
	logout : function(param){
		Act.ptlogin.logout(param);
	},
	getQQNum : function() {
		return Act.ptlogin.getQQNum();
	},
	login : function(param,option){
		Act.ptlogin.login(param,option);
	},
	getACSRFToken : function(){
		return Act.util.getACSRFToken();
	},
	getJSONP : function(url, callback){
		Act.ajax.getJSONP(url, callback);
	},
	getScript : function(url, callback){
		Act.ajax.getScript(url, callback);
	},
	getQQAvatar : function(nodeId, uin, size){
		Act.util.qqHead(nodeId, uin, size);
	},
	getCss : function(url){
		seajs.use('util/ept',function(t){
			t.ept.getCss(url);
		});
	}
};
domReady(function(){

	//如果需要加载toolbar
	if(_toolbar == true) {
		setTimeout(function(){
			seajs.use('util/toolbar',function(t){
				t.init('2.4');
			});
		},500);
	};

	//如果需要加载toolbar
	if(_board == true){
		setTimeout(function(){
			seajs.use('weibo/board',function(b){
				b.board();
			});
		},5000)
	};

	//动态引入监测js文件
	if(_track == true){
		setTimeout(function(){
			seajs.use('util/base',function(b){
				b.initTrack();
			});
		},200);
	};
})
