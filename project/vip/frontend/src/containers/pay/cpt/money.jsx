import React from 'react';
import classNames from 'classnames/bind';


export default class money extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            curIndex: 0,
            moneys: []
        }
    }

    render() {
        let moneys = this.props.monthCost,
            curIndex = this.state.curIndex;

        return <div className="common-group">
            <div className="common-title"><h2>英雄时限</h2></div>
            <div className="money-list clear-fix">
                {
                    moneys.map((item, index) => {
                        return <div onClick={() => {
                            this.itemClick(index);
                        }} key={index} className={classNames(
                            'money-item',
                            { 'money-active': curIndex == index }
                        )}>
                            <div className="day-info">{item.days}天</div>
                            <div className="price-info"><b>¥</b>{item.cost}</div>
                        </div>;
                    })
                }
            </div>
            <p className="tips-info">成为英雄期间转修其他英雄系，将丢失所在系的英雄身份</p>
        </div>  
    }

    itemClick(n) {
        this.setState({ curIndex: n }, () => {
            this.props.callbackParent({
                type: "index",
                val: n
            });
        });
    }
};