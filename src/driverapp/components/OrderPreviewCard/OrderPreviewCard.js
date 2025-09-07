import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useTheme, useTranslations, Card } from '../../../core/dopebase'
import dynamicStyles from './styles'
import { useOrderMutations } from '../../api'
import { useConfig } from '../../../config'

const OrderPreviewCard = ({ order, driver, onMessagePress,inProgressOrderID }) => {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const config = useConfig()

  const { markAsPickedUp, markAsCompleted } = useOrderMutations(config)

  const buttonTitle =
    order.status === 'Order Shipped'
      ? localized('Completar Recogida')
      : localized('Completar Entrega')
  const headlineText =
    order.status === 'Order Shipped'
      ? localized('Recoger - ') + order.vendor?.title
      : localized('Enviar a ') + order.author?.firstName
  const address =
    order.status === 'Order Shipped'
      ? ''
      : order.address?.line1 + ' ' + order.address?.line2

  const onPress = () => {
    if (order.status === 'Order Shipped') {
      // Order has been picked up, so we update the status
      
      /*markAsPickedUp(order)*/
      markAsPickedUp(inProgressOrderID)
    } else {
      // Order has been delivered, so we update the status of both driver and order
      
      /*markAsCompleted(order, driver)*/
      markAsCompleted(inProgressOrderID, driver)
    }
  }

  return (
    <Card containerStyle={styles.container}>
      <View style={styles.contentView}>
        <View style={styles.textContainer}>
          <Text style={styles.headline}>{headlineText}</Text>
          <Text style={styles.description}>
            {localized('Pedido # ')}
            {order.id}
            {inProgressOrderID}
          </Text>
          <Text style={styles.description}>{address}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.actionButtonContainer}
            onPress={onPress}>
            <Text style={styles.actionButtonText}>{buttonTitle}</Text>
          </TouchableOpacity>
          {order.status === 'In Transit' && (
            <TouchableOpacity
              style={styles.secondaryButtonContainer}
              onPress={onMessagePress}>
              <Text style={styles.secondaryButtonText}>
                {localized('Mensaje')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Card>
  )
}

export default OrderPreviewCard
