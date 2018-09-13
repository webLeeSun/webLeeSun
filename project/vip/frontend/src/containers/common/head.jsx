import React from 'react';
import classNames from 'classnames/bind';

export default class head extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchvalue: ""
        }
    }

    render() {
        let searchvalue = this.state.searchvalue;

        return <div className="header-container">
            <div className="header">
                <a href="http://www.panda.tv/"><img className="logo" src="//image.xingyan.panda.tv/b2a97149ec43dfc95eb177508af29f6c_w160_h92.png" /></a>
                <ul className="nav">
                    <li><a href="http://www.panda.tv/">首页</a></li>
                    <li><a href="http://www.panda.tv/all">全部</a></li>
                    <li><a href="http://www.panda.tv/cate">分类</a></li>
                </ul>
                <div className="right">
                    <div className="input-group search">
                        <input type="text" autoComplete="off" placeholder="搜游戏/主播" value={searchvalue}
                            onFocus={() => {
                                this.focusToggle();
                            }} onBlur={() => {
                                this.focusToggle();
                            }} onInput={(e) => {
                                this.inputChacnge(e);
                            }} onKeyUp={(e) => {
                                this.toSearch(e);
                            }} />
                        <span className="addon"
                            onClick={() => {
                                this.toSearch();
                            }}>
                            <i className="icon-search"></i>
                        </span>
                    </div>

                    <div className="user">
                        <a href="http://www.panda.tv/personal" target="_blank"><img src={this.props.user.avatar} /></a>
                        <div className="user-popup">
                            <i className="icon icon-drop"></i>
                            <ul>
                                <li className="user-nick"><a href="http://www.panda.tv/personal" target="_blank"><span className="user-name">{this.props.user.nickName}</span></a></li>
                                <li className="user-logout"><a href="#" onClick={()=>{
                                    this.loginOut();
                                }}>退出</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    focusToggle() {
        $(".input-group").toggleClass("active");
    }

    inputChacnge(e) {
        this.setState({ searchvalue: e.target.value })
    }

    loginOut() {
        $.get("/logout", function(data) {
            location.href = "///www.panda.tv";
        }, "json");
    }

    toSearch(e) {
        if (e) {
            if (e.keyCode == 13) {
                if (this.state.searchvalue.length > 0) {
                    window.location.href = "//www.panda.tv/search?kw=" + this.state.searchvalue;
                }
            }
            return false;
        } else {
            if (this.state.searchvalue.length > 0) {
                window.location.href = "//www.panda.tv/search?kw=" + this.state.searchvalue;
            }
        }
    }
};