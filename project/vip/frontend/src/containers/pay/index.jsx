import React from 'react';
import PropTypes from "prop-types";
import '../common/style.less';
import './style.less';
import Head from '../common/head';
import Money from './cpt/money';
import Channel from './cpt/channel';
import classNames from 'classnames/bind';

export default class application extends React.Component {

    static contextTypes = {
        router: PropTypes.object
    }

    constructor(props) {
        super(props);

        this.state = {
            userToken:{
                token: "",
                rid:"",
            },
            user: {},
            chargeUser:{
                cate:"",
                level:"",
                roomid:"",
                hostid:"",
                occupation_name:""
            },
            source:"",
            monthCost:[{
                "end_date":"",
                "cost":"",
                "days":"",
                "pdc":"",
            }],
            index:0,
            postmoney: 0,
            postway: "alipay",
            postyeepay: "",
            islocal: true,
            ddSrc:""
        };

    }

    onChildChanged = (params) => {
        if (!params || !params.type) {
            return false;
        }
        switch (params.type) {
            case "index":
                this.setState({ postmoney: this.state.monthCost[params.val].cost });
                this.setState({ index: params.val },()=>{
                    this.punchClick(this.state.monthCost[this.state.index].days);
                });
                break;
            case "postway":
                this.setState({ postway: params.val });
                break;
            case "postyeepay":
                this.setState({ postyeepay: params.val });
                break;
            default:
                break;
        }
    }

    render() {
        let user = this.state.user,
            chargeUser = this.state.chargeUser,
            monthCost = this.state.monthCost,
            index = this.state.index,
            postmoney = this.state.postmoney,
            postway = this.state.postway,
            postyeepay = this.state.postyeepay,
            islocal = this.state.islocal,
            ddSrc = this.state.ddSrc;

        return <div>
            <Head user={user} />
            <div className="pay-main">
                <div className="charge-user-info">
                    <h2>{user.nickName}</h2>
                    <p>已经准备好成为<span>Lv.{chargeUser.level}{chargeUser.occupation_name}</span></p>
                </div>

                <Money monthCost={monthCost} callbackParent={this.onChildChanged} />

                <div className="common-group">
                    <div className="common-title"><h2>获得宝藏</h2></div>
                    <div className="goods-list clear-fix">
                        <p>道具<span className="goods-mb">{monthCost[index].pdc}猫币</span></p>
                        <p>成为<span className="goods-lvl">Lv.{chargeUser.level}{chargeUser.occupation_name}</span><b>（有效期至{monthCost[index].end_date}）</b></p>
                    </div>
                </div>
                
                <Channel islocal={islocal} postmoney={postmoney} callbackParent={this.onChildChanged}/>

                <div className={classNames(
                    'charge-btn',
                    { 'charge-error': postway=="" || (postway=="yeepay" && postyeepay=="")}
                )} onClick={() => {
                    this.chargeSubmit();
                }}>确认充值</div>
                <p className="charge-tip">特别提示：未满18周岁的用户请您在监护人的同意和指导下使用熊猫直播的充值服务</p>
            </div>
            <img className="ddimg" src={ddSrc}/>
        </div>;
    }

    componentDidMount() {

        this.getToken();

        this.setState({chargeUser:{
            "cate":this.getUrlParam("cate"),
            "level":this.getUrlParam("level"),
            "roomid":this.getUrlParam("roomid"),
            "hostid":this.getUrlParam("hostid"),
            "occupation_name":""
        }})

        this.setState({source:this.getUrlParam("source")||""});

        localStorage.removeItem("pay|charge|img");
        localStorage.removeItem("pay|charge|order_id");
        localStorage.removeItem("pay|charge|money");
        localStorage.removeItem("pay|charge|payway");
        localStorage.removeItem("pay|charge|successinfo");

        if (window.queryStatus) {
            clearInterval(window.queryStatus);
        }
    }

    getToken() {
        $.get("/user/token").then((res) => {
            let data = typeof (res) == "string" ? JSON.parse(res) : res;
            this.setState({ userToken: data },()=>{
                this.getUser();
                this.getConstList();
                this.punchView();
            });
        }).fail((err) => {
            window.location.href = "//www.panda.tv";
        }, 'json');
    }

    punchView(){
        this.setState({ddSrc:`//dd.panda.tv/pc_import_punch.gif?pur=''&papp=pc_web&purl=''&puid=${this.state.userToken.rid}&prid=${this.state.chargeUser.roomid}&pcid=${this.getCookie("__guid")}&pae=view&paew=cash-${this.state.source}&pmsg=''&psrc=''&pchannel=''&pref=''`})
    }

    punchClick(day){
        this.setState({ddSrc:`//dd.panda.tv/pc_import_punch.gif?pur=''&papp=pc_web&purl=''&puid=${this.state.userToken.rid}&prid=${this.state.chargeUser.roomid}&pcid=${this.getCookie("__guid")}&pae=click&paew=cash-lv${this.state.chargeUser.level}-${this.state.chargeUser.cate}-${day}&pmsg=''&psrc=''&pchannel=''&pref=''`})
    }

    getCookie(name){ 
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)"); 
    　　 return (arr=document.cookie.match(reg))?unescape(arr[2]):null;
    }

    getUser() {
        $.get(`/profile?rid=${this.state.userToken.rid}`).then((res) => {
            let data = typeof (res) == "string" ? JSON.parse(res) : res;
            if(data.errno == 0){
                this.setState({ user: data.data });
            }else{
                window.location.href = "//www.panda.tv";
            }
        }).fail((err) => {
            window.location.href = "//www.panda.tv";
        }, 'json');
    }

    checkLocal() {
        $.get("/charge/local").then((res) => {
            let data = typeof (res) == "string" ? JSON.parse(res) : res;
            this.setState({ isLocal: (data.show == -1) ? true : false });
        }).fail((err) => {
            console.error(err);
        }, 'json');
    }

    getConstList() {
        let othis = this;
        $.ajax({
            type: "GET",
            url: "/hero/costlist",
            data: {
                "rid": othis.state.userToken.rid,
                "profession": othis.state.chargeUser.cate,
                "proflevel": othis.state.chargeUser.level,
                "__plat": "pc_web"
            },
            success: function (res) {
                if(res.errno == 0){
                    res.data.buyOccupationInfo.roomid = othis.state.chargeUser.roomid;
                    res.data.buyOccupationInfo.hostid = othis.state.chargeUser.hostid;
                    othis.setState({chargeUser:res.data.buyOccupationInfo});
                    othis.setState({monthCost:res.data.monthCost});
                    othis.setState({postmoney:res.data.monthCost[0].cost});
                }else{
                    window.location.href = "//www.panda.tv";
                }
            },
            error:function (res) {
                window.location.href = "//www.panda.tv";
            }
        });
    }

    getUrlParam (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    
    getImgUrl (str) {
        var reg = new RegExp("http://i[0-4].pdim.gs");
        var reg2 = new RegExp("http://i[5-9].pdim.gs");
        str = str.replace(reg, "https://p.ssl.qhimg.com");
        str = str.replace(reg2, "https://i.ssl.pdim.gs");
        return str;
    }

    chargeSubmit() {
        let othis = this;
        let postway = this.state.postway,
            postmoney = this.state.postmoney,
            postyeepay = this.state.postyeepay,
            $button = $(".charge-btn");
        
        if($button.hasClass("charge-error")){
            return false;
        }

        $.ajax({
            type: "POST",
            url: "/hero/charge",
            data: {
                "amount": postmoney,
                "channel": postway,
                "bank_id": postyeepay,
                "days": othis.state.monthCost[othis.state.index].days,
                "rid": othis.state.userToken.rid,
                "profession": othis.state.chargeUser.cate,
                "proflevel": othis.state.chargeUser.level,
                "room_id": othis.state.chargeUser.roomid,
                "host_id": othis.state.chargeUser.hostid,
                "__plat": "pc_web",
            },
            success: function (res) {
                let data = typeof (res) == "string" ? JSON.parse(res) : res;
                if(data.errno == 0){
                    localStorage.setItem("pay|charge|order_id", data.data.order_id);
                    localStorage.setItem("pay|charge|money", postmoney);
                    localStorage.setItem("pay|charge|successinfo", JSON.stringify({
                        "mobi":othis.state.monthCost[othis.state.index].pdc,
                        "end_date":othis.state.monthCost[othis.state.index].end_date,
                        "level":othis.state.chargeUser.level,
                        "occupation_name":othis.state.chargeUser.occupation_name,
                    }));
                    localStorage.setItem("pay|charge|payway", postway);
                    if ("alipay" == postway || "yeepay" == postway || "paypal" == postway) {
                        window.location.href = data.data.url;
                    }
                    if ("wxpay" == postway || "paynowzs" == postway) {
                        localStorage.setItem("pay|charge|img", data.data.url);
                        othis.context.router.history.push("/mid");
                    }
                }else{
                    window.location.href = "//www.panda.tv";
                }
            },
            error:function (res) {
                window.location.href = "//www.panda.tv";
            }
        });
    }
}