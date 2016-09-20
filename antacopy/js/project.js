/**---添加自定义函数---**/
String.prototype.trim = function() //去除两端空格
    {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }
String.prototype.left = function(count) { //截取左边count个字符
    return this.substr(0, count);
}
String.prototype.right = function(count) { //截取右边count个字符
    return this.substr(this.length - count);
}
String.prototype.zhLength = function() { //计算中文字符串的长度，两个英文符号算一个长度。
    return Math.ceil(this.replace(/[\u4e00-\u9fa5]/g, '**').length / 2);
}
String.prototype.checkMoblie = function() { //验证字符串是否为合法的手机号码
    return /^1[3|4|5|7|8][0-9]\d{8}$/.test(this);
}
String.prototype.checkIdCardNo = function() { //验证字符串是否为合法的身份证号码
    return /^[1-9]\d{13}[0-9,x,X]$|^[1-9]\d{16}[0-9,x,X]$/.test(this);
}
String.prototype.checkZipCode = function() { //验证字符串是否为合法的邮政编码
    return /^[0-9]{6}$/.test(this);
}
String.prototype.checkEmail = function() { //验证字符串是否为合法的电子邮箱地址
    return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this);
}
String.prototype.getFileExt = function() { //获得文件路径中的文件扩展名，可用于文件类型的判断
    return this.right(this.length - this.lastIndexOf('.') - 1);
}
String.prototype.copy = function(limit) { //将字符串本身复制limit次后返回一个新的字符串
    if (typeof(limit) == 'undefined') limit = 1;
    var temp = '';
    for (var i = 1; i <= limit; i++) {
        temp += this;
    }
    return temp;
}
String.prototype.openLabel = function() {
    if (this != '') return '<' + this.split(',').join('><') + '>';
    return '';
}
String.prototype.closeLabel = function() {
    if (this != '') return '</' + this.split(',').reverse().join('></') + '>';
    return '';
}

/**
 *var num = 123;
 *num.numCards(5);//output:00123
 *num.numCards(5,'b');//output:<b>0</b><b>0</b><b>1</b><b>2</b><b>3</b>
 */
Number.prototype.numCards = function(count, separater, frontChar) {
    if (typeof(separater) == 'undefined') separater = '';
    if (typeof(frontChar) == 'undefined') frontChar = '0';
    var temp = (frontChar.copy(count) + this).right(count).split('');
    return separater.openLabel() + temp.join(separater.closeLabel() + separater.openLabel()) + separater.closeLabel();
}

/**
 *将一维数组中的数据构建成表格形式
 *@numOfRow:每一行要展示的数据数量；@rowLabel:行标签,如:tr;@cellLabel:单元格标签,如:td;@filled:true/false,不满一行是否要填充
 */
Array.prototype.buildTable = function(numOfRow, rowLabel, cellLabel, filled) {
    var arrTemp = [];
    for (var i = 0; i < this.length; i++) {
        arrTemp.push(cellLabel.openLabel() + this[i] + cellLabel.closeLabel());
    }
    var arrTarget = [];
    var r = arrTemp.length % numOfRow;
    if (filled && r > 0) {
        arrTemp.push((cellLabel.openLabel() + cellLabel.closeLabel()).copy(numOfRow - r));
    }
    while (arrTemp.length > 0) {
        arrTarget.push(arrTemp.splice(0, numOfRow).join(''));
    }
    return rowLabel.openLabel() + arrTarget.join(rowLabel.closeLabel() + rowLabel.openLabel()) + rowLabel.closeLabel();
}

/**
 *打乱一维数组中数据的顺序
 */
Array.prototype.mix = function() {
    return this.sort(function(a, b) {
        return Math.random() > .5 ? 1 : -1;
    });
}

/**------**/

//新开发模式常用公共JS
var JG = {}; //全局变量
JG.domain = location.protocol + '//' + location.hostname + '/';
JG.index = {}; //index页面全局变量

/**
 *判断是否在QQ域名下
 */
JG.checkQQDomain = function() {
    return /qq\.com$/i.test(location.hostname);
}

JG.checkQQDomain() && (document.domain = 'qq.com');

/*获取页面名字
 *if location.href is http://gmond.act.qq.com/wap/index.html, when path is true, this function return 'wap/index'
 *when path is false, this function return 'index'.
 */
JG.templateName = function(path, suffix, params) {
    path = typeof path == "undefined" ? 1 : path;
    suffix = typeof suffix == "undefined" ? 1 : suffix;
    params = typeof params == "undefined" ? 1 : params;
    var pathname = location.pathname,
        ret; //location.pathname
    if (!!path) {
        ret = pathname.replace(/^\//i, '');
    } else {
        ret = pathname.substr(pathname.lastIndexOf('/')).replace(/^\//i, '');
    }
    if (!suffix) {
        ret = ret.replace(/\.html$/i, '');
    }
    if (!!params) {
        return ret + location.search;
    }
    return ret;
}

JG.getPathName = function() {
    //if location.href is http://gmond.act.qq.com, the function will return '/'
    //if location.href is http://gmond.act.qq.com/wap/index.html?rd=11, the function will return '/wap/index.html'
    return location.pathname;
}
JG.getURLParam = function(p) {
        //if you want to get parent window url params,please use top.window.location or parent.window.location object.
        var t = location.search.substr(1).match(new RegExp('(^|&)' + p + '\=([^&]*)(&|$)', 'i'));
        if (t === null) return null;
        else return t[2];
    }
    //document.domain = 'qq.com';
JG.loadJSFile = function(url, charset, callback) {
    var $node = document.createElement('script');
    $node.src = url;
    $node.onload = $node.onreadystatechange = function() {
        if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
            typeof callback === 'function' && callback();
            $node.onload = $node.onreadystatechange = null
        }
    }
    $node.type = "text/javascript";
    $node.charset = charset;
    $node.src = url;
    document.getElementsByTagName("head")[0].appendChild($node);
}

//邀请记录存进cookie
JG.registerInvite = function() {
    var jgDomain = window.location.hostname;
    //var cookieObj = {domain:JG.domain,path:'/'};
    var voptions = {
        expires: 10 * 60,
        path: '/',
        domain: JG.domain,
        secure: true
    };
    var fromqq = JG.getURLParam('from'); //$app.util.getURLParam('fromqq')
    var regExp = /^\d{5,12}$/; //校验QQ号码
    if (fromqq && !regExp.test(fromqq)) {
        //alert('xss_fromqq');
        //return;
    }
    Act.util.cookie('fromqq', null);
    if (fromqq) {
        //$app.util.cookie("fromqq", fromqq,cookieObj);
        Act.util.cookie('fromqq', fromqq);
    }

    var userid = JG.getURLParam('userid'); //$app.util.getURLParam('userid')
    userid = parseInt(userid);
    if (userid && isNaN(userid)) {
        //alert('xss_userid');
        return;
    }
    Act.util.cookie('userid', null);
    if (userid) {
        //$app.util.cookie("userid", userid,cookieObj);
        Act.util.cookie('userid', userid);
    }
    if (Act.ptlogin.isLogin()) {}

}
JG.markUser = function() {
    if (Act.ptlogin.isLogin()) {
        /**/
        $.ajax({
            type: 'GET',
            url: JG.domain + "default/loadProject_",
            dataType: 'json',
            data: {},
            success: function(e) {
                //var jsn = e;
            }
        });

    }
}
JG.loginQQ = function() {
    if (JG.checkQQDomain()) {
        Act.ptlogin.login();
    } else {
        var qq = prompt("请输入要登录的QQ号");
        qq && JG.setLoginQQ(qq.trim());
    }

}
JG.logoutQQ = function() {
    if (JG.checkQQDomain()) {
        Act.ptlogin.logout();
    } else {
        Act.util.cookie('uin', null);
        Act.util.cookie('skey', null);
    }
}
JG.setLoginQQ = function(qq) {
    $.ajax({
        type: 'POST',
        url: JG.domain + "default/initLogin",
        dataType: 'json',
        data: {
            'uin': qq
        },
        async: false,
        cache: false,
        success: function(e) {
            if (e.code == 1) {
                //Act.util.cookie('uin','o'+qq);
                //Act.util.cookie('skey','abcdefgh');
                location.reload();
            }
        }
    });
    //Act.util.cookie('luin','o'+qq);
}

JG.getInputChecked = function(box, type) {

    var radioarry = document.getElementById(box).getElementsByTagName('input');
    var numR = 0;
    var radiotrue = new Array();
    for (var radionum = 0; radionum < radioarry.length; radionum++) {
        if (radioarry[radionum].type == type && radioarry[radionum].checked == true) {
            radiotrue[numR] = radioarry[radionum];

            numR++;
        }
    }

    return radiotrue;
}

JG.trackAction = function(url) { //加监测地址
    var imgObj = new Image();
    imgObj.src = url;
}

var shareData = {
    title: "我们，只为“去打破”",
    desc: "安踏助力中国军团全新一代“去打破”。",
    timeLineTitle: '安踏助力中国军团全新一代“去打破”。',
    img: "http://appmedia.qq.com/media/641012099/share.jpg",
    url: JG.domain,
    onSuccess: function(res) {},
    onCancel: function(res) {}
};

function initApp(data) {
    var support = h5e.share.init(data);
    /*if (!support) {
      alert('此平台不支持init方法');
    }*/
}

Act.util.readyRun("*", function() {
    //<script type="text/javascript" src="http://appmedia.qq.com/media/641011945/h5e.js"></script>
    //if(isWeixinBrowser()){
    JG.loadJSFile('http://appmedia.qq.com/media/641011945/h5e.js', 'utf-8', function() {
        initApp(shareData);
    });
    //}
});

function txTrackAction(btnId) {
    var urlMap = {
            '1': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button6410120990&ref'],
            '2': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button6410120991&ref'],
            '3': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button6410120992&ref'],
            '4': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button6410120993&ref'],
            '5': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button6410120994&ref'],
            '6': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button6410120995&ref'],
            '7': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button6410120996&ref'],
            '8': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button6410120997&ref'],
            '9': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button6410120998&ref'],
            '10': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button6410120999&ref'],
            '11': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button64101209910&ref'], //龙浮现TVC
            '12': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button64101209911&ref', 'http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button64101209912&ref'], //龙浮现购买
            '13': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button64101209913&ref'], //头牌TVC
            '14': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button64101209914&ref', 'http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button64101209915&ref'],
            '15': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button64101209916&ref'], //问鼎TVC
            '16': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button64101209917&ref', 'http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button64101209918&ref'],
            '17': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button64101209919&ref'], //去打破TVC
            '18': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button64101209920&ref'], //里约TVC
            '19': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button64101209921&ref', 'http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button64101209922&ref'],
            '20': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button64101209923&ref'], //范儿TVC
            '21': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button64101209924&ref', 'http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button64101209925&ref'],
            '22': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button64101209926&ref'], //藏TVC
            '23': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button64101209927&ref', 'http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button64101209928&ref'],
            '24': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button64101209929&ref'], //静TVC
            '25': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button64101209930&ref', 'http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button64101209931&ref'],
            '26': ['http://t.l.qq.com/ping?t=m&cpid=641012099&url=http%3A//app_minisite_click_monitor/button64101209932&ref']
        },
        idx = 0;
    switch (+btnId) {
        case 12:
        case 14:
        case 16:
        case 19:
        case 21:
        case 23:
        case 25:
            isWeixinBrowser() && (idx = 1);
            break;
    }
    JG.trackAction(urlMap[btnId][idx]);
}

//判断是否是微信浏览器
function isWeixinBrowser() {
    //在windows phone中的微信里，此判断无效
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

//跳转链接
function goTo(uri) {
    window.setTimeout(function() {
        window.location.href = uri;
    }, 20);
}
