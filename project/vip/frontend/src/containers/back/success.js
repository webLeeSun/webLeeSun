import React from 'react';
import PropTypes from "prop-types";
import './style.less';
import Head from '../common/head';
import classNames from 'classnames/bind';

export default class success extends React.Component {

    static contextTypes = {
        router: PropTypes.object
    }

    constructor(props) {
        super(props);

        this.state = {
            userToken: "",
            user: {},
            successInfo:{}
        };
    }

    render() {
        let user = this.state.user,
            successInfo = this.state.successInfo;

        return <div>
            <Head user={user} />
            <h2 className="pay-title">英雄充值</h2>
            <div className="pay-main pay-back">
                <div className="" className={classNames(
                    'back-text',
                    'success',
                    { 'spe': !(successInfo&&successInfo.mobi)}
                )}>充值成功</div>
                {successInfo&&successInfo.mobi? <div className="back-info">
                    <h3>你获得了</h3>
                    <div className="back-info-main">
                        <div className="back-info-title">{successInfo.mobi}猫币</div>
                        <div className="back-info-detail">
                            <h2>Lv.{successInfo.level}{successInfo.occupation_name}</h2>
                            <p>（有效期至{successInfo.end_date}）</p>
                        </div>
                    </div>
                </div> : ``}
               
            </div>
        </div>;
    }

    componentDidMount() {

        this.setState({successInfo:JSON.parse(localStorage.getItem("pay|charge|successinfo"))});

        localStorage.removeItem("pay|charge|img");
        localStorage.removeItem("pay|charge|order_id");
        localStorage.removeItem("pay|charge|money");
        localStorage.removeItem("pay|charge|payway");

        if (window.queryStatus) {
            clearInterval(window.queryStatus);
        }
        
        this.getToken();
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
}