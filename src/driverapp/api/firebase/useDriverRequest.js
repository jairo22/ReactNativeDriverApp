import { useState, useEffect } from 'react'
import { subscribeToDriver as subscribeToDriverAPI } from './FirebaseDriverClient'

const useDriverRequest = (config, driverID) => {
  const [updatedDriver, setUpdateDriverInfo] = useState()

  console.log('driverrequest1')
  console.log(driverID)

  useEffect(() => {
    if (!driverID) {
      return
    }
    const unsubcribeToDriver = subscribeToDriverAPI(
      config,
      driverID,
      onOrderRequestUpdate,
    )
    return unsubcribeToDriver
  }, [driverID])

  const onOrderRequestUpdate = data => {
    
    console.log('driverrequest2')
    console.log(data)
    setUpdateDriverInfo(data)

  }

 

  return {
    orderRequest: updatedDriver?.orderRequestData,
    inProgressOrderID: updatedDriver?.inProgressOrderID,
    //inProgressOrderID: updatedDriver?.orderRequestData,
    updatedDriver,
  }
}

export default useDriverRequest
