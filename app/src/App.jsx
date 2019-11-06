import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import responsive from 'FRS/components/responsive.jsx'
import LandingPage from 'FRS/pages/LandingPage.jsx'
import Home from 'FRS/pages/Home.jsx'

@responsive
export default class App extends Component {
  render() {
    return (
        <div>
            <BrowserRouter>
                <Switch>
                    <Route path="/home" component={Home} />
                    <Route path="/" component={LandingPage}/>
                </Switch>
            </BrowserRouter>
        </div>
    )
  }
}
