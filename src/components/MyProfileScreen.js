import React, { useCallback, useLayoutEffect } from 'react'
import { BackHandler, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme, useTranslations } from '../core/dopebase'
import { IMUserProfileComponent } from '../core/profile'
import { logout, setUserData } from '../core/onboarding/redux/auth'
import Hamburger from './Hamburger/Hamburger'
import { useFocusEffect } from '@react-navigation/native'
import { useConfig } from '../config'
import { useAuth } from '../core/onboarding/hooks/useAuth'

const Images = {
  accountDetail: require('../assets/icons/account-detail.png'),
  settings: require('../assets/icons/settings.png'),
  contactUs: require('../assets/icons/contact-us.png'),
  delivery: require('../assets/icons/delivery.png'),
  favoriteRestaurant: require('../assets/icons/love.png'),
}
function MyProfileScreen(props) {
  const { navigation } = props

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()

  const config = useConfig()
  const authManager = useAuth()

  var menuItems = [
    {
      title: localized('Detalles cuenta'),
      icon: Images.accountDetail,
      tintColor: '#6b7be8',
      onPress: () =>
        navigation.navigate('AccountDetail', {
          form: config.editProfileFields,
          screenTitle: localized('Editar Perfil'),
        }),
    },/*
    {
      title: localized('Favorite Restaurants'),
      icon: Images.favoriteRestaurant,
      tintColor: '#ff726f',
      onPress: () => {
        console.log('Favourite Restaurants')
      },
    },
    {
      title: localized('Order History'),
      icon: Images.delivery,
      tintColor: '#999999',
      onPress: () => navigation.navigate('OrderList'),
    },*/
    {
      title: localized('Ajustes'),
      icon: Images.settings,
      tintColor: '#a6a4b1',
      onPress: () =>
        navigation.navigate('Settings', {
          form: config.userSettingsFields,
          screenTitle: localized('Settings'),
        }),
    },
    {
      title: localized('Contacto'),
      icon: Images.contactUs,
      tintColor: '#9ee19f',
      onPress: () =>
        navigation.navigate('Contact', {
          form: config.contactUsFields,
          screenTitle: localized('Contact us'),
        }),
    },
  ]

  const isAdmin = useSelector(state => state.auth.isAdmin)
  const currentUser = useSelector(state => state.auth.user)
  const dispatch = useDispatch()

  useLayoutEffect(() => {
    const colorSet = theme.colors[appearance]
    navigation.setOptions({
      title: localized('Mi Perfil'),
      headerTintColor: colorSet.primaryForeground,
      headerTitleStyle: { color: colorSet.primaryText },
      headerStyle: {
        backgroundColor: colorSet.primaryBackground,
      },
      headerLeft: () => (
        <Hamburger
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      ),
      headerRight: () => <View />,
    })
  }, [])

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      )

      return () =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onBackButtonPressAndroid,
        )
    }, []),
  )

  const onBackButtonPressAndroid = () => {
    navigation.goBack()

    return true
  }

  const onLogout = () => {
    authManager?.logout(currentUser)
    dispatch(logout())
    navigation.navigate('LoadScreen')
  }

  const onUpdateUser = newUser => {
    dispatch(setUserData({ user: newUser }))
  }

  if (isAdmin) {
    menuItems.push({
      title: localized('Admin Dashboard'),
      tintColor: '#8aced8',
      icon: Images.checklist,
      onPress: () => navigation.navigate('AdminDashboard'),
    })
  }

  return (
    <IMUserProfileComponent
      user={currentUser}
      onUpdateUser={user => onUpdateUser(user)}
      onLogout={() => onLogout()}
      menuItems={menuItems}
    />
  )
}

export default MyProfileScreen
