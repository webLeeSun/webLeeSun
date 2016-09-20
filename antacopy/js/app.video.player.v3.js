document.write('<script src="http://imgcache.gtimg.cn/tencentvideo_v1/tvp/js/tvp.player_v2.js" charset="utf-8"></script>');

function isMobile() {
    var userAgents = window.navigator.userAgent;
    var mobileUserAgents = new Array("android", "iphone", "ucweb", "symbian", "windows phone", "blackberry os", "palm", "maemo", "meego", "bada", "kindle", "smartphone", "windows ce");
    var ismobile = false;
    for (var i = 0; i < mobileUserAgents.length; i++) {
        var patten = new RegExp(mobileUserAgents[i], 'i');
        if (patten.test(userAgents)) {
            ismobile = true;
            break;
        }
    }
    return ismobile;
}

function videoPlayer(vid, width, height, playerDivId, type, isAutoPlay) {
    var video = new tvp.VideoInfo();
    var player = new tvp.Player(width, height);
    if (type == 'y') {
        if (!vid) vid = '1975434150';
        video.setChannelId(vid);
        /*var ismobile = isMobile();
        if(ismobile){
        	player.isUseHLS=true;
        	player.addParam("player","html5");
        }
        else{
        	player.addParam("player","flash");
        }*/
        player.addParam("autoplay", isAutoPlay);
        player.addParam("wmode", "transparent");
        player.addParam("showcfg", "0");
        player.addParam("adplay", 0);
        player.addParam("showend", 0);
        player.addParam("type", "1");
    } else {
        if (!vid) vid = 't0015rsuzyv';
        player.addParam("autoplay", isAutoPlay);
        player.addParam("wmode", "transparent");
        player.addParam("showcfg", "0");
        player.addParam("adplay", 0);
        player.addParam("showend", 0);
        video.setVid(vid);
    }
    player.setCurVideo(video);
    player.write(playerDivId);

    player.onallended = function() {
        onQQVideoAllEnded(player);
    }

    player.onpause = function() {
        onQQVideoPause(player);
    }

    player.onresume = function() {
        onQQVideoResume(player);
    }
}
