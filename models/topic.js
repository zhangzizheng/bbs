const Model = require('./main')
const moment = require('moment')

class Topic extends Model {
    constructor(form={}) {
        super()
        this.id = form.id
        // views 是这个 topic 的浏览数目
        this.views = form.views || 0
        this.reply = form.reply || 0
        this.title = form.title || ''
        this.content = form.content || ''
        this.ct = moment().format('YYYY-MM-DD HH:mm:ss')
        this.ut = this.ct
        this.user_id = form.user_id || ''
        this.board_id = Number(form.board_id || 0)
        this.username = form.username || 0
        this.reply_username = form.reply_username || ''
        this.reply_id = form.reply_id || 1
    }

    static get(id, instance, username, replyId) {
        console.log(id)
        const m = Topic.findOne('id', id)
        if (instance === 'views') {
            m.views += 1
        } else if (instance === 'reply') {
            m.reply += 1
            m.reply_username = username
            m.reply_id = replyId
        }
        m.save()
        return m
    }

    static createTopic(form) {
        const tl = form.title.length
        const cl = form.content.length
        // 长度验证
        if((tl !== 0 && tl < 31) && cl < 3000) {
            this.create(form)
            return true
        } else {
            return false
        }
    }

    static allList(board_id) {
        let ms = []
        if (board_id === 0) {
            // 相当于 Model.all()
            ms = super.all()
        } else {
            ms = super.find('board_id', board_id)
        }
        return ms
    }
}

module.exports = Topic