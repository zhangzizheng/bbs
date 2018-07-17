const blockActive = function (tabName) {
    // 滑块左右滑动
    const block = $('.block')
    if (tabName === 'register') {
        block.css('left', '155px')
    } else if (tabName = 'login') {
        block.css('left', '100px')
    }
}

const registerTabActive = function () {
    // 注册
    // 标签样式
    const registerPage = $('#id-a-register')
    registerPage.addClass('active')
    const loginPage = $('#id-a-login')
    loginPage.removeClass('active')
    //  form 表单的显示
    const registerForm = $('#id-div-register')
    const loginForm = $('#id-div-login')
    loginForm.hide()
    registerForm.show()
    blockActive('register')
}

const loginTabActive = function () {
    // 登陆
    const loginPage = $('#id-a-login')
    loginPage.addClass('active')
    const registerPage = $('#id-a-register')
    registerPage.removeClass('active')
    // form 表单的显示
    const loginForm = $('#id-div-login')
    const registerForm = $('#id-div-register')
    registerForm.hide()
    loginForm.show()
    blockActive('login')
}

const changeActive = function () {
    // 获取 url 的 hash， 根据 hash 展示 登陆 / 注册 页面
    const hash = window.location.hash
    if (hash === '#register') {
        registerTabActive()
    } else if (hash === '#login') {
        loginTabActive()
    }
}

const onHashChangeEvent = function () {
    // init
    changeActive()
    // 绑定事件
     $(window).bind('hashchange', function () {
         changeActive()
    })
}

const ajax = function(method, path, data, reseponseCallback) {
    // 创建 ajax 对象
    const r = new XMLHttpRequest()
    // 设置请求方法和请求地址
    r.open(method, path, true)
    // 设置发送的数据的格式( setRequestHeader 是套路函数)
    r.setRequestHeader('Content-Type', 'application/json')
    // 注册响应函数(当服务器返回数据之后，执行 reseponseCallback 函数)
    r.onreadystatechange = function() {
        if(r.readyState === 4) {
            reseponseCallback(r)
        }
    }
    // 发送请求
    r.send(data)
}

const login = function () {
    // 登陆
    const loginBtn = $('#id-button-login')
    loginBtn.click(function () {
        let data = {}
        const un = $('#id-input-login-username').val()
        const pw = $('#id-input-login-password').val()
        data.username = un
        data.password = pw
        data = JSON.stringify(data)
        ajax('post', '/user/login', data, function (r) {
            let response = JSON.parse(r.response)
            // console.log(response)
            if (response === false) {
                // 如果返回 false
                $('#id-p-login').fadeIn(800)
                setTimeout(function () {
                    $('#id-p-login').fadeOut(800)
                }, 4000)
            } else {
                loginBtn.text('登陆成功')
                loginBtn.css({
                    color: '#fff',
                    backgroundColor: '#00cc00',
                })
                setTimeout(function () {
                    window.location.href = '/'
                }, 1000)
            }
        })
    })
}

const register = function () {
    // 注册
    const registerBtn = $('#id-button-register')
    registerBtn.click(function () {
        let data = {}
        const un = $('#id-input-register-username').val()
        const pw = $('#id-input-register-password').val()
        const note = $('#id-input-register-note').val()
        data.username = un
        data.password = pw
        data.note = note
        data = JSON.stringify(data)
        // console.log(data)
        ajax('post', '/user/register', data, function (r) {
            let response = JSON.parse(r.response)
            if (response === false) {
                // 如果返回 false
                $('#id-p-register').fadeIn(1000)
                setTimeout(function () {
                    $('#id-p-register').fadeOut(1000)
                }, 3000)
            } else {
                registerBtn.text('注册成功')
                registerBtn.css({
                    color: '#fff',
                    backgroundColor: '#00cc00',
                })
                setTimeout(function () {
                    window.location.href = '/'
                }, 1000)
            }
    })
    })
}

const __main = function () {
    console.log('加载完毕')
    onHashChangeEvent()
    register()
    login()
}

$(document).ready(function () {
    __main()
})