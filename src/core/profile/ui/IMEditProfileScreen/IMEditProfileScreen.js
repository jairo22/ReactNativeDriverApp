import React, { useLayoutEffect, useCallback, useState } from 'react'
import { BackHandler, View, Text, TouchableOpacity } from 'react-native'
import { useDispatch } from 'react-redux'
import { useTheme, useTranslations, Alert } from '../../../dopebase'
import { useFocusEffect } from '@react-navigation/core'
import { updateUser } from '../../../users'
import IMFormComponent from '../IMFormComponent/IMFormComponent'
import { setUserData } from '../../../onboarding/redux/auth'
import { useAuth } from '../../../onboarding/hooks/useAuth'
import {
  ErrorCode,
  localizedErrorMessage,
} from '../../../onboarding/api/ErrorCode'
import dynamicStyles from './styles'
import { useCurrentUser } from '../../../onboarding'

export default function IMEditProfileScreen(props) {
  const { navigation, route } = props
  const { theme, appearance } = useTheme()
  const { localized } = useTranslations()
  const authManager = useAuth()

  let screenTitle = route.params.screenTitle

  const currentUser = useCurrentUser()
  const dispatch = useDispatch()
  const styles = dynamicStyles(theme, appearance)

  const form = route.params.form
  const onComplete = route.params.onComplete

  const [alteredFormDict, setAlteredFormDict] = useState({})

  useLayoutEffect(() => {
    const colorSet = theme.colors[appearance]
    navigation.setOptions({
      headerTitle: screenTitle,
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 12 }} onPress={onFormSubmit}>
          <Text style={{ color: colorSet.primaryText }}>
            {localized('Listo')}
          </Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: colorSet.primaryBackground,
      },
      headerTintColor: colorSet.primaryText,
    })
  }, [alteredFormDict])

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      )
      return () => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onBackButtonPressAndroid,
        )
      }
    }, []),
  )

  const onBackButtonPressAndroid = () => {
    navigation.goBack()
    return true
  }

  const isInvalid = (value, regex) => {
    const regexResult = regex.test(value)

    if (value.length > 0 && !regexResult) {
      return true
    }
    if (value.length > 0 && regexResult) {
      return false
    }
  }

  const onFormSubmit = async () => {
    var newUser = { ...currentUser }
    var allFieldsAreValid = true

    form.sections.forEach(section => {
      section.fields.forEach(field => {
        const newValue = alteredFormDict[field.key]?.trim()
        if (newValue != null) {
          if (field.regex && isInvalid(newValue, field.regex)) {
            allFieldsAreValid = false
          } else {
            newUser[field.key] = alteredFormDict[field.key]?.trim()
          }
        }
      })
    })

    if (allFieldsAreValid) {
      await updateUser(currentUser.id, newUser)
      dispatch(setUserData({ user: newUser }))
      navigation.goBack()
      if (onComplete) {
        onComplete()
      }
    } else {
      alert(
        localized(
          'An error occurred while trying to update your account. Please make sure all fields are valid.',
        ),
      )
    }
  }

  const onFormChange = alteredFormDict => {
    setAlteredFormDict(alteredFormDict)
  }

  const onDeletePrompt = () => {
    Alert.alert(
      localized('Confirmación'),
      localized(
        '¿Estás seguro de que deseas eliminar tu cuenta? Esto eliminará todos tus datos y la acción no es reversible.',
      ),
      [
        {
          text: localized('Cancelar'),
        },
        {
          text: localized('Sí'),
          onPress: onDeleteAccount,
        },
      ],
      {
        cancelable: false,
      },
    )
  }

  const onDeleteAccount = () => {
    authManager.deleteUser(currentUser?.id, response => {
      if (response.success) {
        Alert.alert(
          localized('Success'),
          localized('Cuenta eliminada exitosamente'),
        )
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'LoadScreen',
            },
          ],
        })

        return
      }
      if (response.error === ErrorCode.requiresRecentLogin) {
        Alert.alert(
          localized(localized('Error')),
          localized(localizedErrorMessage(response.error, localized)),
        )
        return
      }
      Alert.alert(
        localized(localized('Error')),
        localized(localized('We were not able to delete your account')),
      )
    })
  }

  return (
    <View style={styles.container}>
      <IMFormComponent
        form={form}
        initialValuesDict={currentUser}
        onFormChange={onFormChange}
        navigation={navigation}
      />
      <TouchableOpacity style={styles.deleteButton} onPress={onDeletePrompt}>
        <Text style={styles.deleteButton}>{localized('Eliminar cuenta')}</Text>
      </TouchableOpacity>
    </View>
  )
}
