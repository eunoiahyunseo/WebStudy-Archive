// @ts-check

const http = require('http')

const { routes } = require('./api')

const server = http.createServer((req, res) => {
  async function main() {
    // 이 조건에 맞는 route하나만 찾게 된다.
    const route = routes.find(
      _route =>
        req.url && _route.url.test(req.url) && _route.method === req.method
    )

    // route가 없다면
    if (!req.url || !route) {
      res.statusCode = 404
      res.end('Not found')
      return
    }

    const regexResult = route.url.exec(req.url)
    if (!regexResult) {
      res.statusCode = 404
      res.end('Not found.')
      return
    }

    /** @type {Object<string, *> | undefined} */
    const requestBody =
      (req.headers['content-type'] === 'application/json' &&
        (await new Promise((resolve, reject) => {
          req.setEncoding('utf-8')
          req.on('data', data => {
            try {
              resolve(JSON.parse(data))
              /* eslint-disable-next-line */
            } catch {
              reject(new Error('Ill-formed json'))
            }
          })
        }))) ||
      undefined

    const result = await route.callback(regexResult, requestBody)

    res.statusCode = result.statusCode
    if (typeof result.body === 'string') {
      res.end(result.body)
    } else {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(result.body))
    }
  }
  main()
})

const PORT = 3000
server.listen(PORT, () => {
  /* eslint-disable-next-line no-console */
  console.log(`The server is listening at port ${PORT}`)
})
