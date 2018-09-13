import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'

import Home from '../containers/Home'
//import RankList from '../containers/RankList'


export default class SubRouter extends Component {


  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path='/ranklist' getComponent={(location, cb) => {
            require.ensure([], require => {
               cb(null, require('../containers/RankList').default)
            },'ranklist');
         }} />
        {/*<Route path='/ranklist' component={RankList}/>*/}
        
      </Switch>
    )
  }
}