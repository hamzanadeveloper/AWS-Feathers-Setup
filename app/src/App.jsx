import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import responsive from 'FRS/components/responsive.jsx'
import LandingPage from 'FRS/pages/LandingPage.jsx'
import Home from 'FRS/pages/Home.jsx'

const TITLE = 'Insight POC'

@responsive
export default class App extends Component {
  render() {
    return (
        <div>
            <Helmet>
                <title>{ TITLE }</title>
            </Helmet>
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
