import React from 'react';
import classNames from 'classnames/bind';
import yeepays from './channelyeepay';


export default class channel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            payWay: "alipay",
            yeepaysFlag: false,
            chooseFlag: false,
            chooseClass: "",
        }
    }

    render() {
        let payWay = this.state.payWay,
            yeepaysFlag = this.state.yeepaysFlag,
            chooseFlag = this.state.chooseFlag,
            chooseClass = this.state.chooseClass;

        return <div className="common-group">
            <div className="common-title"><h2>支付方式</h2></div>
            <div className="channel-list clear-fix">
                <div className={classNames(
                    'channel-item', 'alipay',
                    { 'active': payWay == 'alipay' }
                )} onClick={() => {
                    this.yeepayClick('alipay');
                }}>
                    <span>支付宝</span>
                </div>
                <div className={classNames(
                    'channel-item', 'weixin',
                    { 'active': payWay == 'wxpay' }
                )} onClick={() => {
                    this.yeepayClick('wxpay');
                }}>
                    <span>微信</span>
                    <p>支持信用卡</p>
                </div>
                <div className={classNames(
                    'channel-item', 'yeepay','show',
                    { 'active': payWay == 'yeepay' },
                    { 'choosed': chooseFlag },
                    chooseClass
                )} onClick={() => {
                    this.yeepayClick('yeepay');
                    this.setState({ yeepaysFlag: true });
                }}>
                    <span>网上银行支付</span>
                </div>
                {/* <div className={classNames(
                    'channel-item', 'paynowzs',
                    { 'active': payWay == 'paynowzs' },
                    { 'hide': this.props.postmoney > 2000 }
                )} onClick={() => {
                    this.yeepayClick('paynowzs');
                }}>
                    <span>二维码支付</span>
                    <b></b>
                    <p>仅支持2000元及以下的支付<br />支持信用卡</p>
                </div>
                <div className={classNames(
                    'channel-item', 'paypal',
                    { 'active': payWay == 'paypal' },
                    { 'show': !this.props.islocal }
                )} onClick={() => {
                    this.yeepayClick('paypal');
                }}>
                    <span>paypal</span>
                </div> */}
            </div>
            <div>
                <ul className={classNames(
                    'charge-channelyeepay', 'clear-fix',
                    { 'show': yeepaysFlag }
                )}>
                    {
                        yeepays.map((item, index) => {
                            return <li key={index} className={classNames(
                                'channelyeepay-item',
                                item.ename + "-OUTER",
                                { 'active': chooseClass == item.ename },
                            )} onClick={() => {
                                this.itemClick(item.ename);
                                this.setState({ yeepaysFlag: false });
                            }}><span className={classNames(
                                item.ename
                            )}>{item.cname}</span></li>;
                        })
                    }
                </ul>
            </div>
        </div>
    }

    yeepayClick(w) {
        this.setState({ payWay: w }, () => {
            this.props.callbackParent({
                type: "postway",
                val: this.state.payWay
            });
            if (this.state.payWay != "yeepay") {
                this.setState({ yeepaysFlag: false });
            }
        });
    }

    itemClick(c) {
        this.setState({ chooseClass: c, chooseFlag: true }, () => {
            this.props.callbackParent({
                type: "postyeepay",
                val: this.state.chooseClass
            });
        });
    }

    // moneyChanged = () => {
    //     if (this.props.postmoney <= 2000) {
    //         if (this.state.payWay == "yeepay") {
    //             this.yeepayClick("paynowzs")
    //         }
    //     } else {
    //         if (this.state.payWay == "paynowzs" && this.state.chooseClass != "") {
    //             this.yeepayClick("yeepay")
    //         } else {
    //             if(this.state.payWay == "paynowzs"){
    //                 this.yeepayClick("")
    //             }
    //         }
    //     }
    // }
};