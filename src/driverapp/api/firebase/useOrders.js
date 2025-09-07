import { useState, useEffect } from 'react'
import { subscribeToOrders as subscribeToOrdersAPI } from './FirebaseOrderClient'

const useOrders = (config, driverID) => {
  const [orders, setOrders] = useState()
  
  console.log('onOrdersUpdate1')

  useEffect(() => {
    if (!driverID) {
      return
    }

    const unsubscribeOrders = subscribeToOrdersAPI(
      config,
      driverID,
      onOrdersUpdate,
    )
    return unsubscribeOrders
  }, [driverID])

  const onOrdersUpdate = currentOrder => {
    setOrders(currentOrder)
    console.log('onOrdersUpdate')
  }

  return { orders }
}

export default useOrders
