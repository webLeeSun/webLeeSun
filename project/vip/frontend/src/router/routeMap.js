import React from 'react'
// import { Router, Route, IndexRoute } from 'react-router'
import { Switch, Route, Router, Redirect } from 'react-router'

import Home from '../containers/Home'
import Room from '../containers/Room/index'
//import ShippingAddress from '../containers/ShippingAddress'
import LivingEnd from '../containers/LivingEnd'
/*代码分片*/
// import asyncComponent from '../components/asyncComponent/asyncComponent.js'
// const AsyncRankList = asyncComponent(() => import("../containers/RankList"));

// 如果是大型项目，router部分就需要做更加复杂的配置
// 参见 https://github.com/reactjs/react-router/tree/master/examples/huge-apps

class RouterMap extends React.Component {
    render() {
        return (
            <Router history={this.props.history}>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/home" component={Home}/>
                    <Route path="/room/:id" component={Room}/>
                    <Route path="/LivingEnd" component={LivingEnd}/>
                    <Redirect path='/' to={{pathname:'/'}}/>
                </Switch>
            </Router>
        )
    }
}
// RouterMap.propTypes = {
//     history: PropTypes.object.isRequired,
// };

  
export default RouterMap
//                     {/* <Route path="/ranklist" component={AsyncRankList} /> */}
