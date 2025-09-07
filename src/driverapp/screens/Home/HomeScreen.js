import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react'
import {
  Image,
  PermissionsAndroid,
  Platform,
  View,
  TouchableOpacity,
} from 'react-native'
import { useDispatch } from 'react-redux'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation'
import {
  useTheme,
  useTranslations,
  EmptyStateView,
} from '../../../core/dopebase'
import dynamicStyles from './styles'
import Hamburger from '../../../components/Hamburger/Hamburger'
import { setUserData } from '../../../core/onboarding/redux/auth'
import { updateUser } from '../../../core/users'
import { getDistance } from '../../../core/location'
import {
  useDriverRequest,
  useInProgressOrder,
  useDriverRequestMutations,
} from '../../api'
import { NewOrderRequestModal } from '../../components'
import { getDirections } from '../../../core/delivery/api/directions'
import { OrderPreviewCard } from '../../components'
import { useConfig } from '../../../config'
import { useCurrentUser } from '../../../core/onboarding'
function HomeScreen(props) {
  const { navigation } = props

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const config = useConfig()

  const [isWaitingForOrders, setIsWaitingForOrders] = useState(false)

  const currentUser = useCurrentUser()

  const dispatch = useDispatch()

  const { inProgressOrderID, orderRequest, updatedDriver } = useDriverRequest(
    config,
    currentUser.id,
  )

  

 /* const { order } = useInProgressOrder(config, orderID)  -- change by jairo (orderID not send id instead send all data)*/

  const { order } = useInProgressOrder(config, inProgressOrderID)
  console.log('order '+order+' inProgressOrderID '+inProgressOrderID) 

  const { accept, reject, goOffline, goOnline } =
    useDriverRequestMutations(config)

  const [region, setRegion] = useState(null)
  const [routeCoordinates, setRouteCoordinates] = useState([])
  const [positionWatchID, setPositionWatchID] = useState(null)

  console.log(inProgressOrderID)
  console.log(order)

  useLayoutEffect(() => {
    navigation.setOptions({
      title: localized('Inicio'),
      headerLeft: () => (
        <Hamburger
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      ),
    })
  }, [])

  useEffect(() => {
    if (
      !orderRequest &&
      !inProgressOrderID &&
      updatedDriver?.isActive === true
    ) {
      // Driver has no in-progress order, so they can go offline => enable button, show user location on map
      setIsWaitingForOrders(true)
      setRouteCoordinates([])
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity style={styles.logoutButton} onPress={onGoOffline}>
            <Image
              source={require('../../../assets/icons/shutdown.png')}
              style={styles.logoutButtonImage}
            />
          </TouchableOpacity>
        ),
      })
    } else {
      // Disable button, hide user location on map
      setIsWaitingForOrders(false)
      navigation.setOptions({
        headerRight: null,
      })
    }

    if (updatedDriver) {
      dispatch(setUserData({ user: updatedDriver }))
    }
  }, [inProgressOrderID, orderRequest, updatedDriver])

  useEffect(() => {
    if (!currentUser) {
      return
    }

    setRegion({
      latitude: currentUser.location?.latitude,
      longitude: currentUser.location?.longitude,
      latitudeDelta: 0.00922,
      longitudeDelta: 0.00421,
    })
  }, [currentUser?.id])

  useEffect(() => {
    console.log('positionWatchID')
    return () => {
      //positionWatchID != null && Geolocation.clearWatch(positionWatchID);
    }
  }, [positionWatchID])

  useEffect(() => {
    if (order) {
      computePolylineCoordinates(order)
      trackDriverLocation()
    } else {
      //positionWatchID != null && Geolocation.clearWatch(positionWatchID);
      setRouteCoordinates([])
    }
  }, [order])

  const onGoOnline = () => {
    goOnline(currentUser.id)
  }

  const onGoOffline = () => {
    console.log('+++ currentUser.id', currentUser.id)
    goOffline(currentUser.id)
  }

  const onMessagePress = () => {
    const customerID = order.author && order.author.id
    const viewerID = currentUser.id || currentUser.userID
    let channel = {
      id: viewerID < customerID ? viewerID + customerID : customerID + viewerID,
      participants: [order.author],
    }
    props.navigation.navigate('PersonalChat', { channel })
  }

  const emptyStateConfig = {
    title: localized("Estás desconectado"),
    description: localized(
      'Conéctate para comenzar a recibir solicitudes de entrega de clientes y vendedores.',
    ),
    callToAction: localized('Conectar'),
    onPress: onGoOnline,
  }

  const onAcceptNewOrder = () => {
    
    orderRequest && accept(orderRequest, currentUser)
  }

  const onRejectNewOrder = () => {
    orderRequest && reject(orderRequest, currentUser)
  }

  const computePolylineCoordinates = useCallback(order => {
    if (!order) {
      // invalid order
      return
    }
    const driver = currentUser
    const author = order.author
    const vendor = order.vendor
    const address = order.address

    

    if (order.status === 'Order Shipped' && vendor && driver) {
      // Driver has been allocated, and they're driving to pick up the order from the vendor location
      const sourceCoordinate = {
        latitude: driver.location?.latitude,
        longitude: driver.location?.longitude,
      }
      const destCoordinate = {
        latitude: vendor.latitude,
        longitude: vendor.longitude,
      }
      getDirections(
        sourceCoordinate,
        destCoordinate,
        config.googleAPIKey,
        coordinates => {
          setRouteCoordinates(coordinates)
        },
      )
      return
    }



    if (order.status === 'In Transit' && vendor && driver) {

      console.log('poly vendor '+vendor)

      console.log('poly driver '+driver)


      // Driver has picked up the order from the vendor, and now they're delivering it to the shipping address
      const sourceCoordinate = {
        latitude: driver.location?.latitude,
        longitude: driver.location?.longitude,
      }
      const destLocation = address ? address.location : author.location
      if (!destLocation) {
        return
      }
      const destCoordinate = {
        latitude: destLocation.latitude,
        longitude: destLocation.longitude,
      }
      getDirections(
        sourceCoordinate,
        destCoordinate,
        config.googleAPIKey,
        coordinates => {
          setRouteCoordinates(coordinates)
        },
      )
      return
    }
  })

  const renderMapElements = () => {
    if (!order || routeCoordinates.length < 2 || isWaitingForOrders) {
      console.log('no render map elements'+isWaitingForOrders)
      return null
    }
    return (
      <>
        <Polyline coordinates={routeCoordinates} strokeWidth={5} />
        {order.driver !== undefined && (
          <Marker
            title={order.driver.firstName}
            coordinate={routeCoordinates[0]}
            style={styles.marker}>
            <Image
              source={require('../../../core/delivery/assets/car-icon.png')}
              style={styles.mapCarIcon}
            />
          </Marker>
        )}
        {order.status === 'Order Shipped' && order.vendor && (
          <Marker
            title={order.vendor?.title}
            coordinate={routeCoordinates[routeCoordinates.length - 1]}
            style={styles.marker}>
            <Image
              source={require('../../../core/delivery/assets/destination-icon.png')}
              style={styles.mapCarIcon}
            />
          </Marker>
        )}

        {order.status === 'In Transit' && order.address && (
          <Marker
            title={`${order.address?.line1} ${order.address?.line2}`}
            coordinate={routeCoordinates[routeCoordinates.length - 1]}
            style={styles.marker}>
            <Image
              source={require('../../../core/delivery/assets/destination-icon.png')}
              style={styles.mapCarIcon}
            />
          </Marker>
        )}
      </>
    )
  }

  const updatePolyline = location => {
    if (!order) {
      return
    }
    if (routeCoordinates.length < 2) {
      computePolylineCoordinates(order)
      return
    }
    console.log('updatePolyline2')
    const firstPoint = routeCoordinates[0]
    const distance = getDistance(
      firstPoint.latitude,
      firstPoint.longitude,
      location.latitude,
      location.longitude,
    )
    if (distance < 1) {
      const tmp = routeCoordinates.splice(0, 1)
      setRouteCoordinates(tmp)
      console.log('removed ')
    } else if (distance > 2) {
      console.log('updatePolyline3')

      // we need to reroute since driver took a wrong turn
      computePolylineCoordinates(order)
    }
  }

  const watchPosition = () => {
    return Geolocation.watchPosition(
      position => {
        const coords = position.coords
        const locationDict = {
          location: {
            latitude: coords?.latitude,
            longitude: coords?.longitude,
          },
        }
        dispatch(setUserData({ user: { ...currentUser, ...locationDict } }))
        updateUser(currentUser.id, locationDict)
        updatePolyline(coords)
        setRegion({
          latitude: coords?.latitude,
          longitude: coords?.longitude,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
        })
      },
      () => {},
      { enableHighAccuracy: true },
    )
  }

  const handleAndroidLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: localized('Instamobile'),
          message: localized('Instamobile wants to access your location.'),
        },
      )

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPositionWatchID(watchPosition())
      } else {
        alert(
          localized(
            'Location permission denied. Turn on location to use the app.',
          ),
        )
      }
    } catch (err) {
      console.log(err)
    }
  }

  const trackDriverLocation = async () => {
    if (Platform.OS === 'ios') {
      setPositionWatchID(watchPosition())
    } else {
      handleAndroidLocationPermission()
    }
  }

  if (currentUser && !currentUser.isActive) {
    return (
      <View style={styles.inactiveViewContainer}>
        <EmptyStateView emptyStateConfig={emptyStateConfig} />
      </View>
    )
  }

  if (currentUser && currentUser.isActive === true) { 
    return (
      <View style={styles.container}>
        <MapView
          initialRegion={region}
          showsUserLocation={isWaitingForOrders}
          provider={Platform.OS === 'ios' ? null : PROVIDER_GOOGLE}
          style={styles.mapStyle}>
          {renderMapElements()}
        </MapView>
        {orderRequest && (
          <NewOrderRequestModal
            onAccept={onAcceptNewOrder}
            onReject={onRejectNewOrder}
            isVisible={orderRequest !== undefined}
            onModalHide={onRejectNewOrder}
          />
        )}
        {order && currentUser.inProgressOrderID && (
          <OrderPreviewCard
            onMessagePress={onMessagePress}
            driver={currentUser}
            order={order}
            inProgressOrderID = {currentUser.inProgressOrderID}
          />
        )}
      </View>
    )
  }

  return null
}

export default HomeScreen
