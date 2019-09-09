import React, { useEffect, useState } from 'react'
import Aux from '../../hoc/Aux/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import { connect } from 'react-redux'
import * as burgerBuilderAction from '../../store/actions/index'

export const BurgerBuilder = props => {

  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    props.onInitIngredients()
  }, [])

  const updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
    .map(igKey => {
      return ingredients[igKey]
    })
    .reduce((sum, el) => {
      return sum + el
    }, 0)
    return sum > 0
  }

  const purchaseHandler = () => {
    if (props.isAuthenticated) {
      setPurchasing(true)
    } else {
      props.onSetAuthRedirectPath('/checkout')
      props.history.push('/auth')
    }
  }

  const purchaseCancelHandler = () => {
    setPurchasing(false)
  }

  const purchaseContinueHandler = () => {
    props.history.push('/checkout')
    props.onInitPurchase()

  }

    const disableInfo = {
      ...props.ings
    }
    for (let key in disableInfo) {
      disableInfo[key] = disableInfo[key] <= 0
    }

    let orderSummary = null

  let burger = props.error ? <p>Ingredients can't be loaded!</p> : <Spinner/>

  if (props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={props.ings}/>
          <BuildControls
            ingredientAdded={props.onIngredientAdded}
            ingredientRemoved={props.onIngredientRemoved}
            disabled={disableInfo}
            purchasable={updatePurchaseState(props.ings)}
            ordered={purchaseHandler}
            isAuth={props.isAuthenticated}
            price={props.price}/>
        </Aux>
      )
      orderSummary = <OrderSummary
        ingredients={props.ings}
        price={props.price}
        purchaseCancelled={purchaseCancelHandler}
        purchaseContinued={purchaseContinueHandler}/>
    }


    return (
      <Aux>
        <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    )

}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch(burgerBuilderAction.addIngredient(ingName)),
    onIngredientRemoved: (ingName) => dispatch(burgerBuilderAction.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(burgerBuilderAction.initIngredients()),
    onInitPurchase: () => dispatch(burgerBuilderAction.purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(burgerBuilderAction.setAuthRedirectPath(path))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios))