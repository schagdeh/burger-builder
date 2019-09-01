import React, { Component } from 'react'
import Layout from './hoc/Layout/Layout'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'
//import Checkout from './containers/Checkout/Checkout'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'
//import Orders from './containers/Orders/Orders'
//import Auth from './containers/Auth/Auth'
import Logout from './containers/Auth/Logout/Logout'
import { connect } from 'react-redux'
import * as actions from './store/actions/index'
import asyncComponent from './hoc/asyncComponent/asyncComponent'

const asyncCheckOut = asyncComponent(() => {
  return import('./containers/Checkout/Checkout')
})
const asyncOrders = asyncComponent(() => {
  return import('./containers/Orders/Orders')
})
const asyncAuth = asyncComponent(() => {
  return import('./containers/Auth/Auth')
})

class App extends Component {

  componentDidMount () {
    this.props.onTryAutoSignup()
  }

  render () {
    let route = (
      <Switch>
        <Route path='/auth' component={asyncAuth}/>
        <Route path='/' exact component={BurgerBuilder}/>
        <Redirect to="/"/>
      </Switch>
    )
    if (this.props.isAuthenticated) {
      route = (
        <Switch>
          <Route path='/checkout' component={asyncCheckOut}/>
          <Route path='/orders' component={asyncOrders}/>
          <Route path='/logout' component={Logout}/>
          <Route path='/auth' component={asyncAuth}/>
          <Route path='/' exact component={BurgerBuilder}/>
          <Redirect to="/"/>
        </Switch>
      )

    }
    return (
      <div>
        <Layout>
          {route}
        </Layout>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
