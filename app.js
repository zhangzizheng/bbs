// 引入模块
const express = require('express')
const nunjucks = require('nunjucks')

const bodyParser = require('body-parser')
const session = require('cookie-session')

const log = console.log.bind(console)
// 引入密钥
const { secretKey } = require('./config')

// 初始化 express 实例
const app = express()

// 设置 bodyParser
app.use(bodyParser.urlencoded({
    extended: false,
}))

// 设置 bodyParser 解析 json 格式的数据
app.use(bodyParser.json())

// 设置 session
app.use(session({
    secret: secretKey,
}))

// 配置 nunjucks 模板, 第一个参数是模板文件的路径
// nunjucks.configure 返回的是一个 nunjucks.Environment 实例对象
const env = nunjucks.configure('templates', {
    autoescape: true,
    express: app,
    noCache: true,
})

// nunjucks 添加自定义的过滤器
// env.addFilter('formattedTime', (ts) => {
//     // 引入自定义的过滤器 filter
//     const formattedTime = require('./filter/formattedTime')
//     const s = formattedTime(ts)
//     return s
// })

// 配置静态资源文件
const asset = __dirname + '/static'
app.use('/static', express.static(asset))

// 引入路由文件
const { index } = require('./routes/index')
const { user } = require('./routes/user')
const { topic } = require('./routes/topic')
const { reply } = require('./routes/reply')

// 注册路由程序
app.use('/', index)
app.use('/user', user)
app.use('/topic', topic)
app.use('/reply', reply)

// 404 和 500 错误返回的页面
app.use((request, response) => {
    response.status(404)
    response.render('404.html')
})

app.use((error, request, response) => {
    console.error(error.stack)
    response.status(500)
    response.render('500.html')
})
//
//
const run = (port=5000, host='') => {
    const server = app.listen(port, host, () => {
        const address = server.address()
        host = address.address
        port = address.port
        log(`listening server at http://${host}:${port}`)
    })
}

if (require.main === module) {
    const port = 5000
    // host 参数指定为 '0.0.0.0' 可以让别的机器访问你的代码
    const host = '0.0.0.0'
    run(port, host)
}