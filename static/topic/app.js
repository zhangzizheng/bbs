const tabactiveEvet = function () {
    const btn = $('.topic-page')
    btn.click(function () {
        // 获取到自己
        console.log(this)
        btn.removeAttr("id")
        this.id = 'id-topic-active'
    })
}

const initTabActive = function () {
    const btn = document.querySelectorAll('.topic-page')
    // 获取 board id
    const search = location.search
    if (search === '') {
        console.log('null')
        $('.topic-page:first')[0].id = 'id-topic-active'
    }
    const boardId = search[search.length - 1]
    console.log('boardId', boardId)
    btn.forEach((e) => {
        // console.log(e.dataset.id)
        if (e.dataset.id === boardId) {
            // console.log(true)
            e.id = 'id-topic-active'
        }
    })
}

const ___main = function () {
    tabactiveEvet()
    initTabActive()
}

___main()