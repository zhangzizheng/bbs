
const __init = () => {
    $('#id-fullpage').fullpage({
        anchors: ['page1', 'page2', 'page3'],
        navigation: true,
        navigationTooltips: ['关于我', '我的博客', '我的项目'],
        scrollingSpeed: 600,
    })
}

$(document).ready(() => {
    __init()
})

