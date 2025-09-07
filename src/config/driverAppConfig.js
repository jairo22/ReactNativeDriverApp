import React, { useContext } from 'react'
import { Platform } from 'react-native'
import { useTheme, useTranslations } from '../core/dopebase'

const regexForNames = /^[a-zA-Z]{2,25}$/
const regexForPhoneNumber = /\d{9}$/

export const ConfigContext = React.createContext({})

export const ConfigProvider = ({ children }) => {
  const { theme } = useTheme()
  const { localized } = useTranslations()
  const config = {
    isSMSAuthEnabled: true,
    isGoogleAuthEnabled: true,
    isAppleAuthEnabled: true,
    isFacebookAuthEnabled: true,
    forgotPasswordEnabled: true,
    appIdentifier: `rn-multivendor-driverapp-${Platform.OS}`,
    facebookIdentifier: '1288726485109267',
    isDelayedLoginEnabled: false,
    googleAPIKey: 'AIzaSyAN2El9dQsoSgTZh07R-JmjsTlzmiaZXwQ', // This is used for fetching Google Maps data, such as geocoding data, reverse geocoding, directions, maps, etc.
    tables: {
      vendorsTableName: 'vendors',
      vendorOrdersTableName: 'restaurant_orders',
      vendorDeliveriesTableName: 'restaurant_deliveries',
      vendorReviewsTableName: 'vendor_reviews',
      vendorProductsTableName: 'vendor_products',
      reservationsTableName: 'reservations',
    },
    onboardingConfig: {
      welcomeTitle: localized('Bienvenido a Yasta'),
      welcomeCaption: localized('Gana dinero entregando comida.'),
      walkthroughScreens: [
        {
          icon: require('../assets/icons/restaurant-menu.png'),
          title: localized('Bienvenido a Yasta'),
          description: localized(
            'Inicia sesión y comienza a entregar comida para ganar dinero.',
          ),
        },
        {
          icon: require('../assets/icons/delivery-icon.png'),
          title: localized('Pedidos de comida'),
          description: localized(
            'Entrega comida y gana una tarifa por tu trabajo.',
          ),
        },
        {
          icon: require('../assets/icons/binoculars.png'),
          title: localized('Entrega'),
          description: localized(
            'Realice un seguimiento de sus rutas y pedidos en tiempo real, directamente en la aplicación.',
          ),
        },
        {
          icon: require('../assets/icons/apple.png'),
          title: localized('Pagos'),
          description: localized(
            'Nos encargamos de los pagos , para que puedas concentrarte en ganar dinero entregando.',
          ),
        },
      ],
    },
    drawerMenuConfig: {
      driverDrawerConfig: {
        upperMenu: [
          {
            title: localized('INICIO'),
            icon: theme.icons.shop,
            navigationPath: 'Home',
          },
          {
            title: localized('PEDIDOS'),
            icon: theme.icons.delivery,
            navigationPath: 'DriverOrderList',
          },
          {
            title: localized('PERFIL'),
            icon: theme.icons.profile,
            navigationPath: 'MyProfile',
          },
        ],
        lowerMenu: [
          {
            title: localized('SALIR'),
            icon: theme.icons.shutdown,
            action: 'logout',
          },
        ],
      },
    },
    tosLink: 'https://www.instamobile.io/eula-instachatty/',
    isUsernameFieldEnabled: false,
    smsSignupFields: [
      {
        displayName: localized('Nombre'),
        type: 'ascii-capable',
        editable: true,
        regex: regexForNames,
        key: 'firstName',
        placeholder: 'Nombre',
      },
      {
        displayName: localized('Apellido'),
        type: 'ascii-capable',
        editable: true,
        regex: regexForNames,
        key: 'lastName',
        placeholder: 'Apellido',
      },
    ],
    signupFields: [
      {
        displayName: localized('Nombre'),
        type: 'ascii-capable',
        editable: true,
        regex: regexForNames,
        key: 'firstName',
        placeholder: localized('Nombre'),
      },
      {
        displayName: localized('Apellido'),
        type: 'ascii-capable',
        editable: true,
        regex: regexForNames,
        key: 'lastName',
        placeholder: localized('Apellido'),
      },
      {
        displayName: localized('Modelo de coche'),
        type: 'ascii-capable',
        editable: true,
        regex: regexForNames,
        key: 'carName',
        placeholder: localized('Modelo de coche'),
      },
      {
        displayName: localized('Matrícula de coche'),
        type: 'ascii-capable',
        editable: true,
        regex: regexForNames,
        key: 'carNumber',
        placeholder: localized('Matrícula de auto'),
      },
      {
        displayName: localized('E-mail'),
        type: 'ascii-capable',
        editable: true,
        regex: regexForNames,
        key: 'email',
        placeholder: localized('E-mail'),
        autoCapitalize: 'none',
      },
      {
        displayName: localized('Contraseña'),
        type: 'default',
        secureTextEntry: true,
        editable: true,
        regex: regexForNames,
        key: 'password',
        placeholder: 'Contraseña',
        autoCapitalize: 'none',
      },
    ],
    editProfileFields: {
      sections: [
        {
          title: localized('PERFIL PUBLICO'),
          fields: [
            {
              displayName: localized('Nombre'),
              type: 'text',
              editable: true,
              regex: regexForNames,
              key: 'firstName',
              placeholder: 'Nombre',
            },
            {
              displayName: localized('Apellido'),
              type: 'text',
              editable: true,
              regex: regexForNames,
              key: 'lastName',
              placeholder: 'Apellido',
            },
            {
              displayName: localized('Modelo de coche'),
              type: 'text',
              editable: true,
              key: 'carName',
              placeholder: localized('Modelo de coche'),
            },
            {
              displayName: localized('Matrícula de auto'),
              type: 'text',
              editable: true,
              key: 'carNumber',
              placeholder: localized('Matrícula de auto'),
            },
          ],
        },
        {
          title: localized('DETALLES PRIVADOS'),
          fields: [
            {
              displayName: localized('E-mail'),
              type: 'text',
              editable: false,
              key: 'email',
              placeholder: 'email',
            },
            {
              displayName: localized('Teléfono'),
              type: 'text',
              editable: true,
              regex: regexForPhoneNumber,
              key: 'phone',
              placeholder: 'Teléfono',
            },
          ],
        },
      ],
    },
    userSettingsFields: {
      sections: [
        {
          title: localized('SEGURIDAD'),
          fields: [
            {
              displayName: localized('Permitir Notificationes'),
              type: 'switch',
              editable: true,
              key: 'push_notifications_enabled',
              value: true,
            },
            {
              ...(Platform.OS === 'ios'
                ? {
                    displayName: localized('Enable Face ID / Touch ID'),
                    type: 'switch',
                    editable: true,
                    key: 'face_id_enabled',
                    value: false,
                  }
                : {}),
            },
          ],
        },
        {
          title: localized('NOTIFICATIONES'),
          fields: [
            {
              displayName: localized('Actualizaciones de pedidos'),
              type: 'switch',
              editable: true,
              key: 'order_updates',
              value: false,
            },
            {
              displayName: localized('Novedades'),
              type: 'switch',
              editable: false,
              key: 'new_arrivals',
              value: false,
            },
            {
              displayName: localized('Promociones'),
              type: 'switch',
              editable: false,
              key: 'promotions',
              value: false,
            },
          ],
        },
        {
          title: localized('CUENTA'),
          fields: [
            {
              displayName: localized('Guardar'),
              type: 'button',
              key: 'savebutton',
            },
          ],
        },
      ],
    },
    contactUsFields: {
      sections: [
        {
          title: localized('CONTACTO'),
          fields: [
            {
              displayName: localized('Address'),
              type: 'text',
              editable: false,
              key: 'contacus',
              value: '142 Steiner Street, San Francisco, CA, 94115',
            },
            {
              displayName: localized('E-mail'),
              value: 'florian@instamobile.io',
              type: 'text',
              editable: false,
              key: 'email',
              placeholder: 'email',
            },
          ],
        },
        {
          title: '',
          fields: [
            {
              displayName: localized('LLAMANOS'),
              type: 'button',
              key: 'savebutton',
            },
          ],
        },
      ],
    },
    contactUsPhoneNumber: '+16504859694',
    APIs: {
      firebase: 'firebase',
    },
    API_TO_USE: 'firebase', // "firebase", "wooCommerce", "shopify",
    serverSideEnv: {
      API: {
        baseURL: 'https://yastaconsumidor-2602d2b61ea4.herokuapp.com/', //your copied heroku link
        timeout: 15000,
      },
    },
    stripeConfig: {
      PUBLISHABLE_KEY:
        'pk_live_51ROuaLBCZoMKnAmD5CpNAQzSiy3KCv6OKjUZEz1MbmudDskoGOj97GDtjEoHZH5kULeocpNxXRfpeMtjzSppvPUo00zLKcx8v0', // "pk_test_..." in test mode and ""pk_live_..."" in live mode
      MERCHANT_ID: 'merchant.io.yasta',
      ANDROID_PAYMENT_MODE: 'production', // test || production
    },
    GOOGLE_SIGNIN_CONFIG: {
      SCOPES: ['https://www.googleapis.com/auth/drive.photos.readonly'],
      WEB_CLIENT_ID:
        '706061484183-l0l58dds4kg329fh1trbiha1ci5rqm5n.apps.googleusercontent.com', // from google-services.json file
      OFFLINE_ACCESS: true,
    },
    FIREBASE_COLLECTIONS: {
      USERS: 'users',
      PAYMENT_METHODS: 'payment_methods',
      STRIPE_CUSTOMERS: 'stripe_customers',
      CATEGORIES: 'vendor_categories',
      CHARGES: 'charges',
      ORDERS: 'restaurant_orders',
      SOURCES: 'sources',
      PRODUCTS: 'vendor_products',
      SHIPPING_METHODS: 'shipping_methods',
    },
  }

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  )
}

export const useConfig = () => useContext(ConfigContext)
