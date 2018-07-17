const Model = require('./main')
const crypto = require('crypto')
const moment = require('moment')

class User extends Model {
    constructor(form={}) {
        super()
        this.id = form.id
        this.username = form.username || ''
        this.password = form.password || ''
        this.note = form.note || ''
        this.rank = form.rank || '大佬'
        this.ct = moment().format('YYYY-MM-DD HH:mm:ss')
    }

    static create(form={}) {
        // 加密密码
        form.password = this.saltedPassword(form.password)
        const u = super.create(form)
        u.save()
        // 返回 user 实例
        return u
    }

    static saltedPassword(password, salt='zelda') {
        // 先加密用户密码， 再加盐， 再进行二次加密
        function _sha1(s) {
            const algorithm = 'sha1'
            const hash = crypto.createHash(algorithm)
            hash.update(s)
            const h = hash.digest('hex')
            return h
        }
        // 返回最终加密的结果
        const hash1 = _sha1(password)
        const hash2 = _sha1(hash1 + salt)
        return hash2
    }

    validateAuth(form) {
        const cls = this.constructor
        const { username, password } = form
        const pwd = cls.saltedPassword(password)
        // 加密密码， 再与数据库中的密码比较
        const usernameEquals = this.username === username
        const passwordEquals = this.password === pwd
        return usernameEquals && passwordEquals
    }

    static register(form={}) {
        // 注册验证
        const { username, password } = form
        // 判断长度
        const validForm = (username.length >= 2 && username.length <= 8) && (password.length >= 6 && password.length <= 12) && form.note.length < 30
        // 判断用户名是否已经存在
        const uniqueUser = User.findOne('username', username) === null
        if (validForm && uniqueUser) {
            // 创建这个用户
            const u = this.create(form)
            u.save()
            return u
        } else {
            return false
        }
    }
}

// 当 nodejs 直接运行一个文件时, require.main 会被设为它的 module
// 所以可以通过如下检测确定一个文件是否直接运行
if (require.main === module) {
    test()
}

module.exports = User