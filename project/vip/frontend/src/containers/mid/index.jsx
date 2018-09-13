import React from 'react';
import PropTypes from "prop-types";
import './style.less';
import Head from '../common/head';
import classNames from 'classnames/bind';
import yeepays from '../pay/cpt/channelyeepay';

export default class wxpay extends React.Component {
    static contextTypes = {
        router: PropTypes.object
    }

    constructor(props) {
        super(props);

        this.state = {
            userBank: false,
            userToken: "",
            user: {},
            order_money: "",
            order_code: "",
            order_id: "",
            order_payway: "",
            order_yeepay: ""
        }
    }

    render() {
        let user = this.state.user,
            userBank = this.state.userBank,
            order_money = this.state.order_money,
            order_payway = this.state.order_payway,
            order_yeepay = this.state.order_yeepay,
            order_code = this.state.order_code;

        return <div>
            <Head user={user} />
            <div className="pay-main">
                <div className="pay-mid-title clear-fix">
                    <div className="pay-mid-recive">收款方：上海熊猫互娱文化有限公司</div>
                    <div className="pay-mid-amount">应付金额:<b>¥{order_money}</b>元</div>
                </div>
                {
                    order_payway == "wxpay" ?
                        <div className="pay-mid-code-title">微信扫码支付</div> : <div className="pay-mid-code-title">银联扫码快捷支付</div>
                }
                <div className="pay-mid-code-img">
                    <img src={order_code} />
                </div>
                {
                    order_payway == "wxpay" &&
                    <div className="pay-mid-code-scan">
                        <img src="//image.xingyan.panda.tv/e2a6a6acc8cb8f0ff2f86c8685bdc892_w260_h86.png"/>
                    </div>
                }
                {
                    order_payway == "paynowzs" &&
                    <div>
                        <div className="pay-mid-code-title-spe">使用云闪付或各银行APP扫码支付<a href="//www.panda.tv/news/1101414857/3700943925/3701237158.html" target="_blank"></a></div>
                        <div className="usebanktopayouter">
                            <p className="usebanktopay" onClick={() => {
                                this.userBanks()
                            }}>还是想用网上银行支付</p>
                        </div>
                        <div className={classNames(
                            'bank-pop-cur',
                            { 'show': userBank }
                        )}></div>
                        <div className={classNames(
                            'bank-pop',
                            { 'show': userBank }
                        )}>
                            <h2 className="pop-head">正在使用网上银行支付<span className="pop-close" onClick={()=>{
                                this.closeBanks()
                            }}></span></h2>
                            <h3 className="pop-title">订单金额：¥{order_money}<b></b>元</h3>
                            <ul className={classNames(
                                'charge-pop-channelyeepay', 'pop', 'clear-fix',
                            )}>
                                {
                                    yeepays.map((item, index) => {
                                        return <li key={index} className={classNames(
                                            'channelyeepay-item',
                                            item.ename + "-OUTER",
                                            { 'active': order_yeepay == item.ename },
                                        )} onClick={() => {
                                            this.itemClick(item.ename);
                                        }}><span className={classNames(
                                            item.ename
                                        )}>{item.cname}</span></li>;
                                    })
                                }
                            </ul>
                            <div className={classNames(
                                'pop-submit',
                                { 'active': order_yeepay != "" }
                            )} onClick={() => {
                                this.chargeSubmit();
                            }}>确认充值</div>
                        </div>
                    </div>
                }
            </div>
        </div>

    }

    componentDidMount() {

        this.getToken();

        $.ajaxSetup({
            xhrFields: {
                withCredentials: true
            }
        });

        let code = localStorage.getItem("pay|charge|img"),
            id = localStorage.getItem("pay|charge|order_id"),
            money = localStorage.getItem("pay|charge|money"),
            payway = localStorage.getItem("pay|charge|payway");
            
        this.setState({ order_money: money, order_id: id, order_code: code, order_payway: payway });

        if (code && id && money) {
            // this.getToken();
            window.queryStatus = setInterval(() => {
                this.checkOrderStatus();
            }, 4000);
        } else {
            this.context.router.history.push("/");
        }
    }

    checkOrderStatus() {
        let othis = this;
        $.ajax({
            type: "GET",
            url: "/hero/query",
            data:{
                "rid":38616530,
                "order_id":othis.state.order_id,
                "channel":othis.state.order_payway,
                "__plat":"pc_web"
            },
            success: function (res) {
                let data = typeof (res) == "string" ? JSON.parse(res) : res;
                switch (data.data.pay_state) {
                    case "WAITING":
                        break;
                    case "SUCCESS":
                        othis.context.router.history.push("/success");
                        break;
                    default:
                        othis.context.router.history.push("/fail");
                        break;
                }
            },
            error:function (res) {
                othis.context.router.history.push("/fail");
            }
        });
    }

    userBanks() {
        this.setState({ userBank: true })
    }

    closeBanks() {
        this.setState({ userBank: false })
    }

    itemClick(n) {
        this.setState({ order_yeepay: n })
    }

    chargeSubmit() {
        let othis = this;
        let token = this.state.token,
            postmoney = this.state.order_money,
            postyeepay = this.state.order_yeepay;;

        if (postyeepay == "") {
            return false;
        }

        $.ajax({
            type: "POST",
            url: "/charge/order?token=" + token,
            data: JSON.stringify({
                "amount": postmoney,
                "channel": "yeepay",
                "yeepay": postyeepay,
                "type": 2
            }),
            success: function (res) {
                let data = typeof (res) == "string" ? JSON.parse(res) : res;
                location.href = data.url;
            }
        });
    }

    getToken() {
        $.get("/user/token").then((res) => {
            let data = typeof (res) == "string" ? JSON.parse(res) : res;
            this.setState({ userToken: data },()=>{
                this.getUser();
            });
        }).fail((err) => {
            window.location.href = "//www.panda.tv";
        }, 'json');
    }

    getUser() {
        $.get(`/profile?rid=${this.state.userToken.rid}`).then((res) => {
            let data = typeof (res) == "string" ? JSON.parse(res) : res;
            this.setState({ user: data.data });
        }).fail((err) => {
            window.location.href = "//www.panda.tv";
        }, 'json');
    }
};