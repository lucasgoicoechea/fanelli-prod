import Vue from 'vue'
import auth from './../auth'

const applicationServerPublicKey = 'BGJp2P2ZPJ0Ame-rHhniMtpwwr-oCC5wWK0qh__luJxm9YIBMm-SdCvLxHaxS-FNkzDprhv71i_iFMpXDAWpPP8'
let isSubscribed
let serviceWorkerRegistration

function reportLog (msg) {
  /**
   * Log the msg
   */
  return msg
}

function urlB64ToUint8Array (base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function subscribeUser () {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey)
  serviceWorkerRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
    .then(function (subscription) {
      updateSubscriptionOnServer(subscription)
      isSubscribed = true
    })
    .catch(function (err) {
      return err
    })
}

function updateSubscriptionOnServer (subscription) {
  if (subscription) {
    Vue.http.post('subscribe', {subscription: subscription})
      .then(
        (res) => {
          auth.setUserSubscription(res.body.subscription_id)
        },
        (err) => err
      )
  }
}

export default {
  pushCompability () {
    return ('serviceWorker' in navigator && 'PushManager' in window)
  },
  initPushNotification () {
    if (!this.pushCompability()) {
      reportLog('Browser not compatible with SW and PushNotification')
      return
    }
    if (Notification.permission === 'denied') {
      reportLog('Push notifications are not allowed')
      return
    }
    navigator.serviceWorker.ready.then(
      function (swRegistration) {
        serviceWorkerRegistration = swRegistration
        swRegistration.pushManager.getSubscription()
          .then(
            function (subscription) {
              isSubscribed = !(subscription === null)
              if (isSubscribed) {
                reportLog('User IS subscribed.')
              } else {
                reportLog('User is NOT subscribed.')
                subscribeUser()
              }
            }
          )
      }
    )
  },
  unsubscribeUser () {
    if (!this.pushCompability()) {
      reportLog('Browser not compatible with SW and PushNotification')
      return
    }
    if (Notification.permission === 'denied') {
      reportLog('It is not necessary, subscriptions are not allowed')
      return new Promise((resolve) => { resolve() })
    }

    navigator.serviceWorker.ready.then(
      function (swRegistration) {
        swRegistration.pushManager.getSubscription()
          .then(function (subscription) {
            if (subscription) {
              isSubscribed = false
              auth.removeUserSubscription()
              return subscription.unsubscribe()
            }
          })
          .catch(function (error) {
            reportLog('Error unsubscribing')
            return error
          })
      }
    )
  }
}
