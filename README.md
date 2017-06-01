# Router

Example:

```js
var router = new Router

router.route('/hello', function() {
  console.log('Hello World !')
})

router.route('/hello/:name', function(parameters) {
  console.log('Hello', paremeters.name, '!')
})

router.go('/hello')       // Hello World !
router.go('/hello/Lucky') // Hello Lucky !
```

## API

### `Router#route`

Create or override a route

Parameters:
* `{String} path`
* `{Function} closure`
* `{Any} options`
  * `{Boolean} replace` —  Replace the current state
  * `{String} defaultValue` — Set a default value when the path is dynamic
  * `{String|RegExp|Function} constraint` — Add constraint

```js
router.route('/', function() {
  console.log('home')
})
```

### `Router#scope`

Create or override a scope

Parameters:
* `path` — `string`
* `closure` — `function`

```js
router.scope('/hello', function() {
  router.route('/', function() {
    console.log('Hello World !')
  })

  router.route('/:name', function() {
    console.log('Hello', paremeters.name, '!')
  })
})

// Equivalent to

router.route('/hello', function() {
  console.log('Hello World !')
})

router.route('/hello/:name', function() {
  console.log('Hello', paremeters.name, '!')
})
```

### `Router#contraint`

Add a constraint to a dynamic route

```js
router.route('/hello/:name', function() {
  console.log('Hello', paremeters.name, '!')
})

route.contraint('/hello/:name', /\s/)

route.go('/hello/10') // Nothing happen
route.go('/hello/Lucky') // Hello Lucky !
```

### `Router#defaultValue`

Add a default value to a dynamic route

```js
router.route('/hello/:name', function() {
  console.log('Hello', paremeters.name, '!')
})

route.defaultValue('/hello/:name', 'World')

route.go('/hello/Lucky') // Hello Lucky !
route.go('/hello/:name') // Hello World !
```

### `Router#go`

Parameters:
* `{String} path`
* `{Any} options`
  * `{Boolean} replace` — Replace current state
  * `{Boolean} force` — Force state
  * `{Any} parameters` — Route parameters

```js
router.route('/hello/:name', function() {
  console.log('Hello', paremeters.name, '!')
})

route.go('/hello/:name', { parameters: { name: 'Lucky' } }) // Hello Lucky !
```

### `Router#forward`

Go forward in the stack

### `Router#backward`

Go backward in the stack

### `Router#getRoutes`

Return a list of routes

### `Router#extension`

Get or set extension

Parameters:
* `{String|Function} extension` — String or class constructor

```js
router.route('/404', function() {
  console.log('Not found')
})

var redirect = router.extension('redirect')
redirect.set('/:anything', '/404')

router.go('/hello') // Not found
```

## Extensions

### Redirect

#### `Redirect#set`

Parameters:
* `{String|Route} pathOrRoute`
* `{String|Any} options` — If `any`, pass same as `Router#go` options

```js
var redirect = router.extension('redirect')

router.route('/:error', function(parameters) {
  if (parameters.error === '404') console.log('Not found')
  if (parameters.error === '500') console.log('Internal error')
}, { constraint: /(404|500)/ })

// Set redirection
router.route('/:anything', function() {
  console.log('anything')
}, { redirect: '/404' })

// Equivalent to
// redirect.set('/:anything', '/404')
// redirect.set('/:anything', { path: '/:error', { parameters: { error: '404' } } })

router.go('/hello') // Not found
```

### Concern

#### `Concern#create`

Create concern

Parameters:
* `{String} name`
* `{Function} closure`

#### `Concern#set`

Set concern(s)

Parameters:
* `{String|Route} pathOrRoute`
* `{String|String[]} concern`

```js
var concern = router.extension('concern')

// Create concern
concern.create('errors', function() {
  router.route('/404', function() {
    console.log('Not found')
  })
})

// Set concern
router.route('/en', function() {
  console.log('Home EN')
}, { concern: 'errors' })

// Equivalent to
// concern.set('/en', 'errors')
// concern.set('/en', [ 'errors' ])

router.getRoutes() // [ '/', '/en', '/en/404' ]
```

### Reference

#### `Reference#set`

Set a name to the route

Parameters:
* `{String|Route} pathOrRoute`
* `{String} name`

```js
var reference = router.extension('reference')

// Set reference
router.route('/404', function() {
  console.log('Not found')
}, { reference: 'not_found' })

// Equivalent to
// reference.set('/404', 'not_found')

router.go('not_found') // Not found
```

### Order

#### `order#set`

Set a position to the route

Parameters:
* `{String|Route} pathOrRoute`
* `{Number} position`

```js
var order = router.extension('order')

router.route('/500', function() {
  console.log('Internal error')
})

// Set order
router.route('/404', function() {
  console.log('Not found')
}, { order: 1 })

// Equivalent to
// order.set('/404', 1)

router.getRoutes() // [ '/', '/404', '/500' ]

order.set('/500', 500)

router.getRoutes() // [ '/', '/500', '/404' ]
```

### History

```js
router.extension('history')

// Disable history
router.route('/500', function() {
  console.log('Internal error')
}, { history: false })

// Set history parameters
router.route('/404', function() {
  console.log('Not found')
}, { history: { path: '/404', title: 'Not found', data: { hello: 'World' } } })
```
