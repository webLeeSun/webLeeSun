import 'whatwg-fetch';
import 'es6-promise';
import React, { Component } from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import pay from "../pay";
import mid from "../mid";
import success from "../back/success";
import fail from "../back/fail";
import nomatch from "../nomatch";

class Main extends Component {
    render() {
        return (
            <BrowserRouter basename="/hero/">
                <div className="content">
                    <Switch>
                        <Route exact path="/" component={pay} />
                        <Route path="/mid" component={mid} />
                        <Route path="/success" component={success} />
                        <Route path="/fail" component={fail} />
                        <Route component={nomatch} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default Main;