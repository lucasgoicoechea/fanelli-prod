/* eslint-disable */
importScripts('./static/js/workbox-sw.prod.v2.1.3.js')
importScripts('./static/js/workbox-background-sync.prod.v2.1.3.js')
importScripts('./static/js/localforage.js')

const reportLog = msg => {
  /**
   * Log the msg
   */
  return msg
}

localforage.config({
  name: 'requests',
  version: 3.0
})

const workboxSW = new WorkboxSW({
  skipWaiting: true,
  clientsClaim: true
})

const updateTaskInIDB = (taskData) => {
  localforage.getItem(taskData.idempotencyKey).then((item) => {
    item.state = taskData.state
    localforage.setItem(taskData.idempotencyKey, item)
      .then((res) => {
        reportLog('SW updated task state:')
        return res
      })
      .catch((err) => {
        reportLog('Error while updating task to IDB')
        return err
      })
  })
}

const toastChannel = new BroadcastChannel('toast')

const bgQueue = new workbox.backgroundSync.QueuePlugin({
  callbacks: {
    replayDidSucceed: async (hash, res) => {
      res.json().then(res => {
          const responseChannel = new BroadcastChannel('requests-response')

          const response = {
            idempotencyKey: res['idempotencyKey'],
            state: res.success ? 'COMPLETED' : 'ERROR'
          }

          updateTaskInIDB(response)
          responseChannel.postMessage(response)
          let message
          if (res.success) {
            message = 'La tarea ha sido enviada con éxito'
          } else {
            message = 'Se produjo un error con la tarea enviada'
          }

          toastChannel.postMessage({msg: message, type: res.success ? 'SUCCESS' : 'ERROR'})

          self.registration.showNotification('Tareas', {
            body: message
          })
        }
      )
    },
    requestWillEnqueue: () => {
      toastChannel.postMessage({msg: 'La tarea se completará cuando se recupere la conexión', type: 'INFO'})
    }
  }
})

const replayChannel = new BroadcastChannel('replay-requests')

replayChannel.onmessage = function () {
  bgQueue.replayRequests()
  reportLog('replaying requests')

}

workboxSW.router.registerRoute(
  new RegExp('.*\/api\/security-element'),
  workboxSW.strategies.networkOnly({plugins: [bgQueue]}), 'POST'
)

workboxSW.router.registerRoute(
  new RegExp('.*\/api\/staff-news$'),
  workboxSW.strategies.networkOnly({plugins: [bgQueue]}), 'POST'
)

workboxSW.router.registerRoute(
  new RegExp('.*\/api\/checklist\/comment'),
  workboxSW.strategies.networkOnly({plugins: [bgQueue]}), 'POST'
)
workboxSW.router.registerRoute(
  new RegExp('.*\/api\/checklist\/'),
  workboxSW.strategies.networkOnly({plugins: [bgQueue]}), 'POST'
)

workboxSW.router.registerRoute(
  new RegExp('.*fanelli\.s3\.amazonaws\.com\/.*'),
  workboxSW.strategies.cacheFirst()
)

workboxSW.router.registerRoute(
  new RegExp('.*/api\/checklist\/EXTRUSORA'),
  workboxSW.strategies.networkFirst()
)

workboxSW.router.registerRoute(
  new RegExp('.*/api\/checklist\/APILADORA'),
  workboxSW.strategies.networkFirst()
)

workboxSW.router.registerRoute(
  new RegExp('.*/api\/checklist\/DESAPILADORA'),
  workboxSW.strategies.networkFirst()
)

workboxSW.router.registerRoute(
  new RegExp('.*\/api\/catalog\/available'),
  workboxSW.strategies.networkFirst()
)

workboxSW.router.registerRoute(
  new RegExp('.*\/api\/user'),
  workboxSW.strategies.networkFirst()
)

workboxSW.router.registerRoute(
  new RegExp('.*\/static\/fonts\/.*'),
  workboxSW.strategies.cacheOnly()
)

workboxSW.precache([])

self.addEventListener('push', function (event) {
  reportLog('[Service Worker] Push Received.')
  reportLog(`[Service Worker] Push had this data: "${event.data.text()}"`)

  let notification
  try {
    notification = JSON.parse(event.data.text())
  } catch (e) {
    notification = {message: event.data.text(), type: 'EPP'}
  }

  let title
  switch (notification.type) {
    case 'EPP':
      title = `${notification.message} para ${notification.data.collaborator.name}`
      break
    default:
      title = notification.message
  }

  const options = {
    icon: `static/img/push-notifications/${notification.type}.png`,
    badge: `static/img/push-notifications/ic_stat_business.png`,
    data: notification
  }
  const notificationPromise = self.registration.showNotification(title, options)
  event.waitUntil(notificationPromise)
})

self.addEventListener('notificationclick', function (event) {
  reportLog('[Service Worker] Notification click Received.')

  event.notification.close()

  const link = event.notification.data.url || '/notificaciones'

  event.waitUntil(
    clients.openWindow(link)
  )
})
