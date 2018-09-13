import React from 'react';
import PropTypes from "prop-types";
import Head from '../common/head';

export default class fail extends React.Component {

    static contextTypes = {
        router: PropTypes.object
    }

    constructor(props) {
        super(props);

        this.state = {
            userToken: "",
            user: {},
        };
    }

    render() {
        let user = this.state.user;

        return <div>
            <Head user={user} />
            <h2 className="pay-title">英雄充值</h2>
            <div className="pay-main pay-back">
                <div className="back-text fail">充值失败</div>
            </div>
        </div>;
    }

    componentDidMount() {

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