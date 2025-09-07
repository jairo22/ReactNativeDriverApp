import { accept as acceptAPI, reject as rejectAPI } from './FirebaseOrderClient'
import {
  goOnline as goOnlineAPI,
  goOffline as goOfflineAPI,
} from './FirebaseDriverClient'

const useDriverRequestMutations = config => {
  const accept = (order, driver) => {
    return acceptAPI(config, order, driver)
  }

  const reject = (order, driver) => {
    return rejectAPI(config, order, driver)
  }

  const goOnline = driverID => {
    return goOnlineAPI(config, driverID)
  }

  const goOffline = driverID => {
    return goOfflineAPI(config, driverID)
  }

  return { accept, reject, goOnline, goOffline }
}

export default useDriverRequestMutations
