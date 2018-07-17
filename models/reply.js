const Model = require('./main')
const Topic = require('./topic')
const moment = require('moment')

class Reply extends Model {
    constructor(form={}) {
        super()
        this.id = form.id
        // views 是这个 topic 的浏览数目
        this.content = form.content || ''
        this.ct = moment().format('YYYY-MM-DD HH:mm:ss')
        this.ut = this.ct
        this.user_id = form.user_id || ''
        this.topic_id = Number(form.topic_id || 0)
        this.username = form.username || 0
        this.topic_title = form.topic_title || 0
    }

    static createReply(form) {
        const cl = form.content.length
        // 长度验证
        if ( cl < 101 && cl !== 0) {
            this.create(form)
            const topiId = Number(form.topic_id)
            Topic.get(topiId, 'reply', form.username, form.user_id)
            return true
        } else {
            return false
        }
    }
}

module.exports = Reply