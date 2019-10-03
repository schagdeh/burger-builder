import React, { useEffect } from 'react'
import Order from '../../components/Order/Order'
import axios from '../../axios-orders'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index'
import { connect } from 'react-redux'
import Spinner from '../../components/UI/Spinner/Spinner'

const Orders = props => {

  const {onFetchOrders, userId, token} = props

  useEffect(() => {
    onFetchOrders(token, userId)
  }, [onFetchOrders, token, userId])



    let orders = <Spinner/>
  if (!props.loading) {
    orders = props.orders.map((order) => (
        <Order
          key={order.id}
          ingredients={order.ingredients}
          price={+order.price}
          clicked={() => props.onDeleteOrder(order.id, props.token)}
        />
      ))
    }
    return (
      <div>
        {orders}
      </div>
    )

}

const mapStateToProps = state => {
  return {
    orders: state.order.orders,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId)),
    onDeleteOrder: (id, token) => dispatch(actions.fetchDeleteOrders(id, token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios))