import React, { Component } from 'react';
import { Modal } from 'antd-mobile';
import './index.less';
import ev from '../../ev';

const _UA = navigator.userAgent.toLowerCase();

var iswx = (_UA.indexOf('micromessenger') !== -1)
var isqq = (_UA.indexOf('qq') !== -1)
var iswb = (_UA.indexOf('weibo') !== -1)


class downloadDialog extends Component {
	static propTypes = {
	};

	constructor(props) {
        super(props);
        
        ev.on("ACTION_APPDOWNLOAD_CLICK", ()=>{
            this.setState({
                showTips:true,
            })
        });
    }
    
    state = {
        showTips:false,
        showwxTips:false,
    }

    openAppBtn = ()=>{
        if(iswx || isqq || iswb){
            this.setState({
                showwxTips:true,
            })
        }else{
            var node = document.createElement('iframe');
            var body = document.body;
            var url = "xingyan://xyshortvideo/" + this.props.xid;

            node.style.display = "none";
            node.onload = function(){
                node.parentNode.removeChild(node);
            }
            node.src = url;
            body.appendChild(node);
        }
        this.setState({
            showTips:false,
        })
    }

    downloadBtn = ()=>{
        window.location.href = "https://m.panda.tv/pages/download.html?src=h5";
    }

	render() {
        var self = this;
		return (
            <div>
                <Modal
                    ref="appDialog"
                    visible={this.state.showTips}
                    transparent
                    closable={true}
                    maskClosable={true}
                    onClose={()=>{
                        this.setState({
                            showTips:false,
                        })
                    }}
                    className="ui-app-dowload-dialog"
                    footer={[
                        { text: '打开App', onPress: this.openAppBtn.bind(self)},
                        { text: '去下载', onPress: this.downloadBtn.bind(self)},
                    ]}
                    >
                    <div className="download-app">
                        <div className="logo"></div>
                        <div className="desc">熊猫直播_泛娱乐直播平台</div>
                    </div>
                </Modal>

                    {this.state.showwxTips?(
                        <div id="weixintip">
                            <a id="tipbtn" onclick={()=>{
                                this.setState({
                                    showwxTips:false,
                                })
                            }}></a>
                        </div>
                    ):""}

                
            </div>
        )
    }
}

export default downloadDialog;