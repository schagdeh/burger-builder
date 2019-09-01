import React, { Component } from 'react'
import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import classes from './Auth.css'
import * as actions from '../../store/actions/index'
import { connect } from 'react-redux'
import Spinner from '../../components/UI/Spinner/Spinner'
import { Redirect } from 'react-router-dom'
import { checkValidity, updateObject } from '../../shared/utility'

class Auth extends Component {

  state = {
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Mail Address'
        },
        value: '',
        validation: {
          require: true,
          isEmail: true
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password'
        },
        value: '',
        validation: {
          require: true,
          minLength: 6
        },
        valid: false,
        touched: false
      },
    },
    isSignUp: true
  }

  componentDidMount () {
    if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
      this.props.onSetAuthRedirectPath()
    }
  }

  inputChangedHandler = (event, controlsName) => {
    event.preventDefault()
    const updatedControls = updateObject(this.state.controls, {
      [controlsName]: updateObject(this.state.controls[controlsName], {
        value: event.target.value,
        valid: checkValidity(event.target.value, this.state.controls[controlsName].validation),
        touched: true
      })
    })
    this.setState({controls: updatedControls})
  }

  submitHandler = (event) => {
    event.preventDefault()
    this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp)
  }

  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return {isSignUp: !prevState.isSignUp}
    })
  }

  render () {

    const controlsElementArray = []
    for (let key in this.state.controls) {
      controlsElementArray.push({
        id: key,
        config: this.state.controls[key],
      })
    }
    let form = controlsElementArray.map(controlsElement => (
      <Input
        key={controlsElement.id}
        elementType={controlsElement.config.elementType}
        elementConfig={controlsElement.config.elementConfig}
        value={controlsElement.config.value}
        invalid={!controlsElement.config.valid}
        shouldValidate={controlsElement.config.validation}
        touched={controlsElement.config.touched}
        changed={(event) => this.inputChangedHandler(event, controlsElement.id)}/>
    ))

    if (this.props.loading) {
      form = <Spinner/>
    }

    let errorMessage = null
    if (this.props.error) {
      errorMessage = (
        <p>{this.props.error.message}</p>
      )
    }

    let authRedirect = null
    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to={this.props.authRedirectPath}/>
    }
    return (
      <div className={classes.Auth}>
        {authRedirect}
        {errorMessage}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType='Success'>SUBMIT</Button>
        </form>
        <Button
          clicked={this.switchAuthModeHandler}
          btnType='Danger'>SWITCH TO {this.state.isSignUp ? 'SIGN IN' : 'SIGN UP'}</Button>
      </div>
    )
  }

}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)