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

main.post('/:id', loginRequired, (request, response) => {
    // 获取到文章内容和作者信息
    let form = request.body
    const u = currentUser(request)
    form.user_id = u.id
    form.username = u.username
    form.topic_title = Topic.findOne('id', Number(form.topic_id)).title
    const r = Reply.createReply(form)
    if (r === true) {
        response.json(true)
    } else {
        response.json(false)
    }
})

module.exports = {
    reply: main,
}