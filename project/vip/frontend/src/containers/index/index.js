import 'raf/polyfill';
import 'core-js/es6/map';
import 'core-js/es6/set';
import React from "react";
import ReactDOM from "react-dom";
import '../../static/css/common.less';
import Main from "./Main";

$.ajaxSetup({
    beforeSend: function (xhr, status) {
        if(_process_ == "development"){
            status.crossDomain = true;
        }
        var url = status.url;
        var url = _process_ == "development" ? (url.indexOf("http")>-1?url:"http://vip.pay.panda.tv" + url):(url.indexOf("http")>-1? url:"//vip.pay.panda.tv"+url);
        status.url = url;
        xhr.url = url;
    },
    xhrFields: {
        withCredentials: true
    },
});

ReactDOM.render( <
    Main / > ,
    document.getElementById("root")
);