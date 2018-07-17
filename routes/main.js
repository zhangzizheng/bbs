const User = require('../models/user')
const Topic = require('../models/topic')

const currentUser = (request) => {
    // 通过 session 获取 uid, 如果没有的话就设置成空字符串
    const uid = request.session.uid || ''
    const u = User.findOne('id', uid)
    if (u === null) {
        // 如果当前没有用户登录, 造一个占位的用户
        // 这样我们处理会非常方便,
        // 比如显示用户名就直接用 u.username
        // 而不需要 u !== null && u.username

        // function -> f g h
        const fakeUser = {
            id: -1,
            username: '游客',
            note: '请登录',
        }
        return fakeUser
    } else {
        return u
    }
}

// 快速排序, 递归返回一个从大到小的数组
const quickSort = (arr) => {
    // 传入数据太短的情况
    let array = arr
    if (array.length <= 1) {
        return array
    }
    // 定义基准
    const pivotIndex = Math.floor(array.length / 2)
    // 将基准从原数组中取出来
    const pivot = array.splice(pivotIndex, 1)[0]
    // 初始化子集
    let leftArray = []
    let rightArray = []
    // 遍历
    array.forEach((e) => {
        if (e < pivot) {
            rightArray.push(e)
        } else {
            leftArray.push(e)
        }
    })
    const left = quickSort(leftArray)
    const right = quickSort(rightArray)
    return left.concat(pivot, right)
}

const topicsViews = (topics) => {
    let result = []
    topics.forEach((t) => {
        result.push(t.views)
    })
    return result
}

const topFive = () => {
    // 获取到所有文章
    const topics = Topic.all()
    // 获取出所有文章中点击量最高的 5 个
    const topTen = quickSort(topicsViews(topics)).splice(0, 5)
    let result = []
    topTen.forEach((e) => {
        result.push(Topic.findOne('views', e))
    })
    return result
}

const queryBoard = (board) => {
    console.log('board', board)
    if (board === undefined) {
        // 如果传来的 query 中没有 board
        board = 0
    }
    return board
}

const loginRequired = (request, response, next) => {
    const u = currentUser(request)
    if (u.id === -1) {
        const baseUrl = '/user#login'
        if (request.method === 'GET') {
            response.redirect(baseUrl)
        } else {
            // 应该用一个函数来生成 url, 这里的写法实际上并不好, 因为以后可能还会添加相关的数据
            const nextUrl = baseUrl + '?next_url=' + request.originalUrl
            response.redirect(nextUrl)
        }
    } else {
        next()
    }
}

module.exports = {
    currentUser: currentUser,
    topFive: topFive,
    queryBoard: queryBoard,
    loginRequired: loginRequired,
}