import { StyleSheet } from 'react-native'
import { widthPercentageToDP as w } from 'react-native-responsive-screen'

const dynamicStyles = (theme, appearance) =>
  StyleSheet.create({
    container: {
      width: w(100),
      backgroundColor:
        theme.colors[appearance].primaryBackground,
      alignItems: 'center',
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
    },
    modalContainer: {
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    buttonText: {
      color: theme.colors[appearance].primaryText,
    },
    actionContainer: {
      flexDirection: 'row',
      marginTop: 5,
    },
    actionButtonContainer: {
      flex: 1,
      borderRadius: 5,
      padding: 5,
      margin: 15,
      backgroundColor:
        theme.colors[appearance].primaryForeground,
    },
    actionButtonText: {
      fontWeight: 'bold',
      color: theme.colors[appearance].primaryBackground,
      fontSize: 16,
    },
    title: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      padding: 5,
      marginVertical: 15,
      fontSize: 16,
      textAlign: 'center',
      color: theme.colors[appearance].primaryText,
      borderColor: theme.colors[appearance].grey3,
    },
    cancel: {
      fontWeight: 'bold',
      color: 'white',
      fontSize: 14,
    },
  })

export default dynamicStyles
