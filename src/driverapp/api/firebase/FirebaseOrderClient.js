import firestore from '@react-native-firebase/firestore'

export const subscribeToOrders = (config, driverID, callback) => {
  if (!driverID) {
    return () => {}
  }

  console.log('ubscribeToOrders')

  const ref = firestore()
    .collection(config.FIREBASE_COLLECTIONS.ORDERS)
    .where('driverID', '==', driverID)
    .orderBy('createdAt', 'desc')

  return ref.onSnapshot(
    sanapshot => {
      callback?.(sanapshot.docs.map(doc => doc.data()))
    },
    error => {
      console.log(error)
      alert(error)
    },
  )
}

export const subscribeToInprogressOrder = (config, orderID, callback) => {
  
  console.log('subscribeToInprogressOrder')
  console.log(orderID)
  console.log(config.FIREBASE_COLLECTIONS.ORDERS)

  /* if (!orderID?.trim()) {
  orderID =  orderID.id*/

 if (!orderID?.trim()){
   
    return () => {}
  }

  return firestore()
    .collection(config.FIREBASE_COLLECTIONS.ORDERS)
    .doc(orderID)
    .onSnapshot(
      snapshot => { 
        console.log('subscribeToInprogressOrdessss')
        callback?.(snapshot.data())
      },
      error => {
        
        console.log(error)
      },
    )
}

export const accept = async (config, order, driver) => {

  console.log('accept')

  if (!driver || !driver.id || driver.id.length === 0) {
    return
  }
  if (!order || !order.id || order.id.length === 0) {
    return
  }


  console.log(driver.id)
  
  console.log(order)

  firestore()
    .collection(config.FIREBASE_COLLECTIONS.ORDERS)
    .doc(order.id)
    .update({
      status: 'Driver Accepted',
      driver,
      driverID: driver.id,
    })

  firestore()
    .collection(config.FIREBASE_COLLECTIONS.USERS)
    .doc(driver.id)
    .update({
      orderRequestData: null,
      inProgressOrderID: order.id,
    })
}

export const reject = async (config, order, driver) => {
  var rejectedByDrivers = order.rejectedByDrivers ? order.rejectedByDrivers : []
  rejectedByDrivers.push(driver.id)

  firestore()
   /* .collection(this.config.FIREBASE_COLLECTIONS.USERS)   ---code modified by jairo (this. get error)*/
    .collection(config.FIREBASE_COLLECTIONS.USERS)
    .doc(driver.id)
    .update({ orderRequestData: null })

  firestore()
    .collection(config.FIREBASE_COLLECTIONS.ORDERS)
    .doc(order.id)
    .update({ status: 'Driver Rejected', rejectedByDrivers })
}

export const onDelete = (config, orderID) => {
  firestore()
    .collection(config.FIREBASE_COLLECTIONS.ORDERS)
   // .doc(orderID)
   .doc(orderID.id) 
   .delete()
    .then(result => console.warn(result))
}

export const markAsPickedUp = async (config, order) => {

  console.log('markAsPickedUp2'+order)

  firestore()
    .collection(config.FIREBASE_COLLECTIONS.ORDERS)
    .doc(order)
    .update({ status: 'In Transit' })
}

export const markAsCompleted = async (config, order, driver) => {

   console.log('markAsCompleted ')
   console.log(order)

  firestore()
    .collection(config.FIREBASE_COLLECTIONS.ORDERS)
    /*.doc(order.id)*/
    .doc(order)
    .update({ status: 'Order Completed' })

  firestore()
    .collection(config.FIREBASE_COLLECTIONS.USERS)
    .doc(driver.id)
    .update({ inProgressOrderID: null, orderRequestData: null })
}
