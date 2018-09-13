import React, { Component } from 'react';
import './index.less';
import ev from '../../ev';

class head extends Component {
	static propTypes = {
	};

	constructor(props) {
		super(props);
	}

	render() {
		return (
            <div id="head">
				<a className="logo" href="https://m.panda.tv">
					<img src="https://i.h2.pdim.gs/f89ab1ce63538491ebec491a509f71ef.png" alt="熊猫直播" />
				</a>

				<a onClick={()=>{
					ev.emit("ACTION_APPDOWNLOAD_CLICK");
				}} className="btn-download">APP观看</a>
			</div>
		);
	}
}

export default head;