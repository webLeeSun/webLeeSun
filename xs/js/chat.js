//new add 0721
//emoj打开
$(".emoj").click(function() {
    $(".chat_footer").toggleClass("emoj_show");
    $(".emoj_box").toggleClass("emoj_show");
    $("#wrapper").toggleClass("emoj_show");

    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true
    });
})

//new add 0721
//发送emoj
$(".emoj_img").click(function() {
    var img_src = $(this).find("img").attr("src");
    alert("待发送emoj：" + img_src);
    //ajax
    //...
})


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

        //new add 0721
        $(".chat_footer").removeClass("emoj_show");
        $(".emoj_box").removeClass("emoj_show");
        $("#wrapper").removeClass("emoj_show");
    });
}
document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, false);

//需要滚动到底部时调用
//0726 add 添加高度判断
function scrollChat() {
    var max_h = Math.abs(myScroll.maxScrollY),
        current_h = Math.abs(myScroll.y);
    // 若此时已网上滚动了500px高度，则视为查看历史信息，不触发滚动到底部
    // 临界点可自己修改
    if (max_h - current_h < 500) {
        myScroll.refresh();
        myScroll.scrollTo(0, myScroll.maxScrollY, 1000, IScroll.utils.ease.bounce)
    }
}

//input focus 滚动页面 显示输入框
$("#text_input").focus(function() {
    setTimeout(function() {
        $('html,body').animate({
            scrollTop: $('.chat_footer').offset().top
        }, 100);
    }, 200);

    //new add 0721
    $(".chat_footer").removeClass("emoj_show");
    $(".emoj_box").removeClass("emoj_show");
    $("#wrapper").removeClass("emoj_show");
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
    $(".input_wrap").toggle();
    $(".voice_on_btn").toggle();

    //new add 0721
    $(".chat_footer").removeClass("emoj_show");
    $(".emoj_box").removeClass("emoj_show");
    $("#wrapper").removeClass("emoj_show");
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
//0726 add 绑定事件修改
$('.chat_box').on("touchstart", ".info", function(e) {
    e.stopPropagation();
    if ($(this).parent().hasClass("out")) {
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
    }
});
//0726 add 绑定事件修改
$('.chat_box').on("touchend", ".info", function(e) {
        if ($(this).parent().hasClass("out")) {
            if (timer < 1) {
                timer = 0;
                clearInterval(timerhandle);
                $(".back_space").remove();

                //0726 add 短按则跳转链接
                if($(this).find(".file_wrap").length>0){
                  var url = $(this).find(".file_wrap").attr("data");
                  window.open(url);
                }
            }
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

    scrollChat();

    alert("已提交");
    var input = document.getElementById("text_input");
    ws.send('{"type":"say","content":"' + input.value);
    input.value = "";
}

$("#send_message").click(function() {
    onSubmit()
})
