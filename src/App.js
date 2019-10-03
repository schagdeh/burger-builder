import React, { Suspense, useEffect } from 'react'
import Layout from './hoc/Layout/Layout'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'
//import Checkout from './containers/Checkout/Checkout'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'
//import Orders from './containers/Orders/Orders'
//import Auth from './containers/Auth/Auth'
import Logout from './containers/Auth/Logout/Logout'
import { connect } from 'react-redux'
import * as actions from './store/actions/index'
//import Checkout from './containers/Checkout/Checkout'

const CheckOut = React.lazy(() => {
  return import('./containers/Checkout/Checkout')
})
const Orders = React.lazy(() => {
  return import('./containers/Orders/Orders')
})
const Auth = React.lazy(() => {
  return import('./containers/Auth/Auth')
})

const App = props => {

  const {onTryAutoSignup} = props

  useEffect(() => {
    onTryAutoSignup()
  }, [onTryAutoSignup])

    let route = (
      <Switch>
        <Route path='/auth' render={(props) => <Auth {...props} />}/>
        <Route path='/' exact component={BurgerBuilder}/>
        <Redirect to="/"/>
      </Switch>
    )
  if (props.isAuthenticated) {
      route = (
        <Switch>
          <Route path='/checkout' render={(props) => <CheckOut {...props} />}/>
          <Route path='/orders' render={(props) => <Orders {...props} />}/>
          <Route path='/logout' component={Logout}/>
          <Route path='/auth' render={(props) => <Auth {...props} />}/>
          <Route path='/' exact component={BurgerBuilder}/>
          <Redirect to="/"/>
        </Switch>
      )

    }
    return (
      <div>
        <Layout>
          <Suspense fallback={<p>Loading...</p>}>
            {route}
          </Suspense>
        </Layout>
      </div>
    )

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
