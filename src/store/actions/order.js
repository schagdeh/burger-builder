import * as actionTypes from './actionTypes'
import axios from '../../axios-orders'

export const purchaseBurgerSuccess = (id, orderData) => {
  return {
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    orderId: id,
    orderData: orderData
  }
}

export const purchaseBurgerFail = (error) => {
  return {
    type: actionTypes.PURCHASE_BURGER_FAIL,
    error: error
  }
}
export const purchaseBurgerStart = () => {
  return {
    type: actionTypes.PURCHASE_BURGER_START,
  }
}

export const purchaseBurger = (orderData, token) => {
  return dispatch => {
    dispatch(purchaseBurgerStart())
    axios.post('/orders.json?auth=' + token, orderData)
    .then(response => {
      dispatch(purchaseBurgerSuccess(response.data.name, orderData))
    })
    .catch(error => {
      dispatch(purchaseBurgerFail(error))
    })
  }
}

export const purchaseInit = () => {
  return {
    type: actionTypes.PURCHASE_INIT
  }
}

export const fetchOrdersSuccess = (orders) => {
  return {
    type: actionTypes.FETCH_ORDERS_SUCCESS,
    orders: orders
  }
}

export const fetchOrdersFail = (error) => {
  return {
    type: actionTypes.FETCH_ORDERS_FAIL,
    error: error
  }
}

export const fetchOrdersStart = () => {
  return {
    type: actionTypes.FETCH_ORDERS_START,
  }
}
export const fetchOrders = (token, userId) => {
  return dispatch => {
    dispatch(fetchOrdersStart())
    const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"'
    axios.get('/orders.json' + queryParams)
    .then(response => {
      const fetchedOrders = []
      for (let key in response.data) {
        fetchedOrders.push({
          ...response.data[key],
          id: key
        })
      }
      dispatch(fetchOrdersSuccess(fetchedOrders))
    })
    .catch(err => {
      dispatch(fetchOrdersFail(err))
    })
  }

}

export const fetchDeleteOrdersSuccess = (orderId) => {
  return {
    type: actionTypes.FETCH_DELETE_ORDERS_SUCCESS,
    orderId: orderId,
  }
}

export const fetchDeleteOrdersFail = (error) => {
  return {
    type: actionTypes.FETCH_DELETE_ORDERS_FAIL,
    error: error
  }
}

export const fetchDeleteOrdersStart = () => {
  return {
    type: actionTypes.FETCH_DELETE_ORDERS_START,
  }
}

export const fetchDeleteOrders = (orderId, token, orderData) => {
  return dispatch => {
    dispatch(fetchDeleteOrdersStart())
    const param = orderId + '.json?auth=' + token
    axios.delete('/orders/' + param)
    .then(response => {
      console.log(response)
      dispatch(fetchDeleteOrdersSuccess(orderId, orderData))
    })
    .catch(err => {
      dispatch(fetchDeleteOrdersFail(err))
    })
  }

}


