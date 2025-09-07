import React, { useLayoutEffect } from 'react'
import { FlatList, Text, View } from 'react-native'
import {
  useTheme,
  useTranslations,
  ActivityIndicator,
  EmptyStateView,
} from '../../../core/dopebase'
import { Image } from 'expo-image'
import { useSelector } from 'react-redux'
import dynamicStyles from './styles'
import Hamburger from '../../../components/Hamburger/Hamburger'
import { useOrders } from '../../api'
import { useConfig } from '../../../config'

const OrdersScreen = props => {
  const { navigation } = props

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const config = useConfig()

  const currentUser = useSelector(state => state.auth.user)

  const { orders } = useOrders(config, currentUser.id)

  useLayoutEffect(() => {
    navigation.setOptions({
      title: localized('Pedidos'),
      headerLeft: () => (
        <Hamburger
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      ),
    })
  })

  const renderItem = ({ item }) => {
    const address = item.address
    const addressText = localized('Enviar a: ')
    return (
      <View style={styles.container}>
        <View>
          {item != null &&
            item.products != null &&
            item.products[0] != null &&
            item.products[0].photo != null &&
            item.products[0].photo.length > 0 && (
              <Image
                placeholderColor={theme.colors[appearance].grey9}
                style={styles.photo}
                source={{ uri: item.products[0].photo }}
              />
            )}
          <View style={styles.overlay} />
          <Text style={styles.address}>
            {`${addressText} ${address?.line1} ${address?.line2} ${address?.city} ${address?.postalCode}`}
          </Text>
        </View>
        {item.products.map(product => {
          return (
            <View style={styles.rowContainer} key={product.id}>
              <Text style={styles.count}>{product.quantity}</Text>
              <Text style={styles.title}>{product.name}</Text>
              <Text style={styles.price}>${product.price}</Text>
            </View>
          )
        })}
        <View style={styles.actionContainer}>
          <Text style={styles.total}>
            {localized('Total: $')}
            {item.products
              .reduce((prev, next) => prev + next.price * next.quantity, 0)
              .toFixed(2)}
          </Text>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    )
  }

  const emptyStateConfig = {
    title: localized('Sin Pedidos'),
    description: localized(
      'Aún no has entregado ningún pedido. Todos sus pedidos se mostrarán aquí.',
    ),
  }

  if (orders == null) {
    return <ActivityIndicator />
  }

  if (orders.length == 0) {
    return (
      <View style={styles.emptyViewContainer}>
        <EmptyStateView emptyStateConfig={emptyStateConfig} />
      </View>
    )
  }

  return (
    <FlatList
      style={styles.orderList}
      data={orders}
      renderItem={renderItem}
      keyExtractor={item => `${item.id}`}
      initialNumToRender={5}
    />
  )
}

export default OrdersScreen
