var localId;
//需要后台生成签名
wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: '', // 必填，公众号的唯一标识
    timestamp: "{$sign.timestamp}", // 必填，生成签名的时间戳
    nonceStr: '{$sign.nonceStr}', // 必填，生成签名的随机串
    signature: '{$sign.signature}', // 必填，签名，见附录1
    jsApiList: ["startRecord", 'stopRecord', 'playVoice', 'pauseVoice', 'onVoiceRecordEnd', 'stopVoice', 'uploadVoice', 'downloadVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
});
wx.ready(function() {
    // 1 判断当前版本是否支持指定 JS 接口，支持批量判断
    wx.checkJsApi({
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'translateVoice',
            'startRecord',
            'stopRecord',
            'onRecordEnd',
            'playVoice',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay',
            'openProductSpecificView',
            'addCard',
            'chooseCard',
            'openCard'
        ],
        success: function(res) {
            console.log("检测通过：" + JSON.stringify(res));
        },
        fail: function(res) {
            console.log("检测失败：" + JSON.stringify(res));
        },
        complete: function(res) {
            console.log("检测结束");
        }
    });
    //开始录音
    $('.voice_on_btn').bind("touchstart", function() {
        // 0731添加——pdf问题7：一遍播放音频，一遍开始
        //停止所有播放的audio
        $('.voice_bar').removeClass('active');
        for (var i = 0; i < $('audio').length; i++) {
            $('audio')[i].currentTime = 0;
            $('audio')[i].pause();
        }
        //关于pdf问题4、5：如果需要隐藏录音的图标，hide即可
        //$(".mic_pop").hide();

        $(".mic_pop").toggle();
        wx.startRecord();
    });
    //结束录音-上传
    $('.voice_on_btn').bind("touchend", function() {
        $(".mic_pop").toggle();

        wx.stopRecord({
            success: function(res) {
                localId = res.localId;
                wx.uploadVoice({
                    localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function(res) {
                        var serverId = res.serverId; // 返回音频的服务器端ID
                        $.ajax({
                            url: "<php>echo U('Index/downLoadMedia')</php>",
                            type: "POST",
                            data: {
                                media: serverId,
                                tid: tid,
                                replyid: replyid
                            },
                            success: function(result) {
                                //do something
                            }
                        });

                    }
                });
            }
        });
    });

    wx.onVoiceRecordEnd({
        // 录音时间超过一分钟没有停止的时候会执行 complete 回调
        complete: function(res) {
            localId = res.localId;
        }
    });

});
