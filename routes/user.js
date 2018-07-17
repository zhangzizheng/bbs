const express = require('express')
const main = express.Router()
const User = require('../models/user')
const Topic = require('../models/topic')
const Reply = require('../models/reply')
const { currentUser, topFive, queryBoard, loginRequired } = require('./main')

main.get('/', (request, response) => {
    response.sendfile('templates/login.html')
})

main.post('/register', (request, response) => {
    console.log(request.body)
    const form = request.body
    // 检查合法性
    let u = User.register(form)
    console.log(u)
    if (u !== 'false') {
        // 注册成功 则设置 session
        request.session.uid = u.id
    }
    response.json(u)
})

main.post('/login', (request, response) => {
    const form = request.body
    // 根据登陆用户的 username， 查找一个 user 实例
    const u = User.findOne('username', form.username)
    if (u.validateAuth(form)) {
        // 如果验证成功，
        request.session.uid = u.id
        // 重定向至 topic 页面
        response.json('true')
    } else {
        response.json('false')
    }
})

main.get('/logout', (request, response) => {
    // 注销登录的时候, 将 session 清空就可以了
    request.session = null
    response.redirect('/')
})

// 用户主页

main.get('/:id', (request, response) => {
    // 访问用户主页
    const u = currentUser(request)
    const userId = Number(request.params.id)
    // console.log(userId)
    const user = User.get(userId)
    const topics = Topic.find('user_id', userId)
    // console.log(u)
    // console.log(user)
    const users = User.all()
    const replys = Reply.find('user_id', userId)
    const args = {
        u: u,
        user: user,
        topics: topics,
        users: users,
        replys: replys,
    }
    response.render('member.html', args)
})

module.exports = {
    user: main,
}
