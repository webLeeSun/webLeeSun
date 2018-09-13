import React from 'react';
import classNames from 'classnames/bind';

export default class dialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            type:1,
            stiTimer: null,
            timer: 3,
        }
    }

    render() {
        let show = this.state.show,
            type = this.state.type,
            timer = this.state.timer;

        return <div className={classNames(
            'dialog',
            { 'show': show }
        )}>
            <div className="dialog-bg"></div>
            <div className="dialog-wrap">
                {type==1?<div className="dialog-title">金额输入有误，充值不可小于<span>10元</span></div>:<div className="dialog-title">金额输入有误，单次充值最高<span>50万元</span></div>}
                <div className="dialog-timer">{timer}s</div>
            </div>
        </div>
    }

    showDialog = (t) => {
        this.setState({ show: true,type:t });
        this.state.stiTimer = setInterval(() => {
            this.setState({ timer: --this.state.timer }, () => {
                if (this.state.timer == -1) {
                    clearInterval(this.state.stiTimer);
                    this.setState({ show: false, timer: 3 });
                }
            })
        }, 1000);
    }
};