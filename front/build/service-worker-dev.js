// This service worker file is effectively a 'no-op' that will reset any
// previous service worker registered for the same host:port combination.
// In the production build, this file is replaced with an actual service worker
// file that will precache your site's local assets.
// See https://github.com/facebookincubator/create-react-app/issues/2272#issuecomment-302832432

window.addEventListener('load', function () {
  if ('serviceWorker' in navigator) {
    console.log('Loading development service worker')
    navigator.serviceWorker.register('/service-worker.js')
    .then(function (registration) {
      console.log('Se registro el Service Worker')

      registration.sync.register('testSync')

      var root = (function () {
        var tokens = (self.location + '').split('/')
        tokens[tokens.length - 1] = ''
        return tokens.join('/')
      })()

      var worker = new ServiceWorkerWare()

      worker.post(root + 'something', function (req, res) {
        return new Response({status: 202})
      })
    }).catch(function (e) {
      console.error('Error during service worker registration:', e)
    })

    console.info('Agregado')

    function tryOrFallback (fakeResponse) {
      return function (req, res) {
        if (!navigator.onLine) {
          console.log('No network!')
          return enqueue(req).then(function () {
            return fakeResponse.clone()
          })
        }

        console.log('Network available! Flushing queue')
        return flushQueue().then(function () {
          return fetch(req)
        })
      }

    }

    function enqueue (request) {
      return serialize(request).then(function (serialized) {
        localforage.getItem('queue').then(function (queue) {
          /* eslint no-param-reassign: 0 */
          queue = queue || []
          queue.push(serialized)
          return localforage.setItem('queue', queue).then(function () {
            console.log(serialized.method, serialized.url, 'enqueued!')
          })
        })
      })
    }

    function flushQueue () {
      return localforage.getItem('queue').then(function (queue) {
        /* eslint no-param-reassign: 0 */
        queue = queue || []

        if (!queue.length) {
          return Promise.resolve()
        }

        return sendInOrder(queue).then(function () {
          return localforage.setItem('queue', [])
        })
      })
    }

    function sendInOrder (requests) {
      var sending = requests.reduce(function (prevPromise, serialized) {
        console.log('Sending', serialized.method, serialized.url)
        return prevPromise.then(function () {
          return deserialize(serialized).then(function (request) {
            return fetch(request)
          })
        })
      }, Promise.resolve())
      return sending
    }

    function serialize (request) {
      var headers = {}

      for (var entry of request.headers.entries()) {
        headers[entry[0]] = entry[1]
      }

      var serialized = {
        url: request.url,
        headers: headers,
        method: request.method,
        mode: request.mode,
        credentials: request.credentials,
        cache: request.cache,
        redirect: request.redirect,
        referrer: request.referrer
      }

      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return request.clone().text().then(function (body) {
          serialized.body = body
          return Promise.resolve(serialized)
        })
      }
      return Promise.resolve(serialized)
    }

    function deserialize(data) {
      return Promise.resolve(new Request(data.url, data));
    }

    debugger

    self.addEventListener('online', flushRequestQueue)

    self.addEventListener('fetch', function (event) {
      var request = new URL(event.request.url)
      if (request.pathname === '/something') {
      }
    })
  }
})
