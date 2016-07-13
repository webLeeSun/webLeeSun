//初始化iscroll
var myScroll;

function loaded() {
    myScroll = new IScroll('#wrapper', {
        mouseWheel: true,
        preventDefault: false
    });
    myScroll.on('scrollStart', function() {
        $("#text_input").blur();
        myScroll.refresh();
    });
}
document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, false);

//input focus 滚动页面 显示输入框
$("#text_input").focus(function() {
    setTimeout(function() {
        $('html,body').animate({
            scrollTop: $('.chat_footer').offset().top
        }, 100);
    }, 200)
})

$("#text_input").on("input propertychange", function() {
    if ($.trim($(this).val()) != "") {
        $(".add").hide();
        $(".send_message").show();
    } else {
        $(".add").show();
        $(".send_message").hide();
    }
})

//管理员右上按钮控制
$(".control_btn").click(function() {
    $(".header .cor").toggle();
    $(".header .control_panel").toggle();
})

//切换语音文字
$(".voice").click(function() {
    $(this).toggleClass("bord");
    $(".input_box").toggle();
    $(".voice_on_btn").toggle();
})

//上传图片
$("#newImg").on("change", function() {
    var formData = new FormData($("#myForm")[0]);
    $.ajax({
        url: '/upload_image.do',
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
            //do something
        },
        error: function(e) {
            alert(e);
        }
    });
})

//长按撤回
var timer = 0,
    timerhandle = null;
$('.msg.out').on("touchstart", ".info", function(e) {
    e.stopPropagation();
    if (e.target.outerHTML == '<b class="back_space"></b>') {
        $(e.target).parent().parent().parent().remove();
        //ajax
        //...
        $("#chat").append('<span class="back">你撤回了一条消息</span>');
    } else {
        $(".back_space").remove();
        var othis = $(this);
        timer = 0;
        clearInterval(timerhandle);
        timerhandle = setInterval(function() {
            timer++;
            if (timer >= 1) {
                clearInterval(timerhandle);
                othis.find("span").append('<b class="back_space"></b>');
            }
        }, 1000);
    }
});
$('.msg.out').on("touchend", ".info", function(e) {
    if (timer < 1) {
        timer = 0;
        clearInterval(timerhandle);
        $(".back_space").remove();
    }
})
//websocketJs
//----连接服务端
function connect() {
    // 创建websocket
    ws = new WebSocket("ws://" + document.domain + ":7272");
    // 当socket连接打开时，输入用户名
    ws.onopen = onopen;
    // 当有消息时根据消息类型显示不同信息
    ws.onmessage = onmessage;
    ws.onclose = function() {
        console.log("连接关闭，定时重连");
        connect();
    };
    ws.onerror = function() {
        console.log("出现错误");
    };
}
//----连接建立时发送登录信息
function onopen() {
    if (!name) {
        show_prompt();
    }
    // 登录
    var login_data = '{"type":"login","client_name":"' + name.replace(/"/g, '\\"') + '","room_id":"1"}';
    console.log("websocket握手成功，发送登录数据:" + login_data);
    ws.send(login_data);
}

//----服务端发来消息时
function onmessage(e) {
    console.log(e.data);
    var data = eval("(" + e.data + ")");
    switch (data['type']) {
        // 发言
        case 'say':
            //{"type":"say","from_client_id":xxx,"to_client_id":"all/client_id","content":"xxx","time":"xxx"}
            say(data['avatar'], data['nickname'], data['content'], data['time']);
            break;
    }
}

//----收到信息
function say(avatar, nickname, content, time) {
    $("#chat").append('<div class="msg in">\
        <div class="avatar">\
            <img src="' + avatar + '">\
        </div>\
        <div class="info">\
            <h3>' + nickname + '</h3>\
            <span><b class="cor"></b>' + content + '</span>\
        </div>\
    </div>');
}

//----提交对话
function onSubmit() {
    alert("已提交");
    var input = document.getElementById("text_input");
    ws.send('{"type":"say","content":"' + input.value);
    input.value = "";
}

$("#send_message").click(function() {
    onSubmit()
})
