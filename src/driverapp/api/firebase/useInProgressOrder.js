import { useState, useEffect } from 'react'
import { subscribeToInprogressOrder as subscribeToInprogressOrderAPI } from './FirebaseOrderClient'

const useInProgressOrder = (config, orderID) => {
  const [order, setOrder] = useState()

  useEffect(() => {
    if (!orderID) {
      return
    }

    console.log('inProgressOrderID')
    console.log(orderID)

    const unsubscribeFromInprogressOrder = subscribeToInprogressOrderAPI(
      config,
      orderID,
    //orderID.id,
      onInprogressOrderUpdate,
    )
    return unsubscribeFromInprogressOrder
  }, [orderID])

  const onInprogressOrderUpdate = currentOrder => {
   
   console.log('currentOrder')
    console.log(currentOrder)
    setOrder(currentOrder)
   
  }

  return { order }
}

export default useInProgressOrder
