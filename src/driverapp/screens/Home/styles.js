import { StyleSheet } from 'react-native'
import { heightPercentageToDP as h } from 'react-native-responsive-screen'

const dynamicStyles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]

  return new StyleSheet.create({
    flat: {
      flex: 1,
      color: colorSet.primaryBackground,
    },
    container: {
      flex: 1,
    },
    logoutButton: {
      padding: 8,
    },
    logoutButtonImage: {
      width: 24,
      height: 24,
      resizeMode: 'contain',
      tintColor: 'red',
    },
    inactiveViewContainer: {
      flex: 1,
      paddingTop: h(25),
      backgroundColor: colorSet.primaryBackground,
    },
    goOnlineButton: {
      width: 200,
      paddingVertical: 16,
      backgroundColor: colorSet.primaryForeground,
      alignItems: 'center',
      borderRadius: 8,
    },
    goOnlineButtonText: {
      color: colorSet.grey0,
      fontSize: 20,
      fontWeight: 'bold',
    },
    mapStyle: {
      flex: 1,
    },
    mapCarIcon: {
      height: 32,
      width: 32,
      tintColor: colorSet.primaryForeground,
    },
  })
}

export default dynamicStyles
