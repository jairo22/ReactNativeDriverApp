import React from 'react'
import { View, Text } from 'react-native'
import Modal from 'react-native-modal'
import { useTheme, useTranslations, Button } from '../../../core/dopebase'
import dynamicStyles from './styles'

export default function NewOrderRequestModal({
  onAccept,
  onReject,
  isVisible,
  onModalHide,
}) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  return (
    <Modal
      style={styles.modalContainer}
      swipeDirection="down"
      isVisible={isVisible}
      onModalHide={onModalHide}>
      <View style={styles.container}>
        <Text style={styles.title}>{localized('Aceptar Nuevo Pedido?')}</Text>
        <View style={styles.actionContainer}>
          <Button
            containerStyle={styles.actionButtonContainer}
            textStyle={styles.actionButtonText}
            onPress={onAccept}
            text={localized('Aceptar')}
          />
        </View>
        <Button
       
          textStyle={styles.cancel}
          onPress={onReject}
          text={localized('Rechazar')}
        />
      </View>
    </Modal>
  )
}
