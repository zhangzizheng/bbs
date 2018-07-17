const express = require('express')
const main = express.Router()
const User = require('../models/user')
const Topic = require('../models/topic')
const Reply = require('../models/reply')
const { currentUser, topFive, queryBoard, loginRequired } = require('./main')
const marked = require('marked')
const hljs = require('highlight.js')


marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    highlight: function (code) {
        return hljs.highlightAuto(code).value;
    }
})

main.get('/', (request, response) => {
    const user = currentUser(request)
    // console.log('debug id user', id, user)
    // 获取所有的文章
    const board = Number(queryBoard(request.query.board))
    const topics = Topic.allList(board).reverse()
    const hotTopics = topFive()
    const users = User.all()
    const args = {
        user: user,
        topics: topics,
        hotTopics: hotTopics,
        b: board,
        users: users,
    }
    response.render('topic.html', args)
})

main.get('/new', loginRequired, (request, response) => {
    const user = currentUser(request)
    const users = User.all()
    const args = {
        user: user,
        users: users,
    }
    response.render('new.html', args)
})

main.post('/new/add', (request, response) => {
    // 发表新文章
    // console.log(request.body)
    // 获取到文章内容和作者信息
    let form = request.body
    const u = currentUser(request)
    // 动态设置 topic 的作者
    form.user_id = u.id
    form.username = u.username
    const t = Topic.createTopic(form)
    if (t == true) {
        response.json(true)
    } else {
        response.json(false)
    }
})

main.get('/:id', loginRequired, (request, response) => {
    const id = Number(request.params.id)
    let m = Topic.get(id, 'views')
    const hotTopics = topFive()
    const user = currentUser(request)
    m.content = marked(m.content)
    const replys = Reply.find('topic_id', id)
    console.log(replys)
    // console.log(m)
    const users = User.all()
    const args = {
        topic: m,
        hotTopics: hotTopics,
        user: user,
        replys: replys,
        users: users,
    }
    response.render('detail.html', args)
})

module.exports = {
    topic: main,
}