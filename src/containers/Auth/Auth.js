import React, { useEffect, useState } from 'react'
import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import classes from './Auth.css'
import * as actions from '../../store/actions/index'
import { connect } from 'react-redux'
import Spinner from '../../components/UI/Spinner/Spinner'
import { Redirect } from 'react-router-dom'
import { checkValidity, updateObject } from '../../shared/utility'

const Auth = props => {

  const [authForm, setAuthForm] = useState({
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
  })
  const [isSignup, setIsSignup] = useState(true)

  useEffect(() => {
    if (!props.buildingBurger && props.authRedirectPath !== '/') {
      props.onSetAuthRedirectPath()
    }
  }, [props])

  const inputChangedHandler = (event, controlsName) => {
    event.preventDefault()
    const updatedControls = updateObject(authForm, {
      [controlsName]: updateObject(authForm[controlsName], {
        value: event.target.value,
        valid: checkValidity(event.target.value, authForm[controlsName].validation),
        touched: true
      })
    })
    setAuthForm(updatedControls)
  }

  const submitHandler = (event) => {
    event.preventDefault()
    props.onAuth(authForm.email.value, authForm.password.value, isSignup)
  }

  const switchAuthModeHandler = () => {
    setIsSignup(!isSignup)
  }


    const controlsElementArray = []
  for (let key in authForm) {
      controlsElementArray.push({
        id: key,
        config: authForm[key],
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
        changed={(event) => inputChangedHandler(event, controlsElement.id)}/>
    ))

  if (props.loading) {
      form = <Spinner/>
    }

    let errorMessage = null
  if (props.error) {
      errorMessage = (
        <p>{props.error.message}</p>
      )
    }

    let authRedirect = null
  if (props.isAuthenticated) {
    authRedirect = <Redirect to={props.authRedirectPath}/>
    }
    return (
      <div className={classes.Auth}>
        {authRedirect}
        {errorMessage}
        <form onSubmit={submitHandler}>
          {form}
          <Button btnType='Success'>SUBMIT</Button>
        </form>
        <Button
          clicked={switchAuthModeHandler}
          btnType='Danger'>SWITCH TO {isSignup ? 'SIGN IN' : 'SIGN UP'}</Button>
      </div>
    )

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