// 封装多次使用的函数
const e = (selector) => document.querySelector(selector)
const es = (selector) => document.querySelectorAll(selector)
const log = function () {
    console.log.apply(console, arguments)
}

// 改变 selector 元素的 css
const changeCss = (selector, key, value) => {
    e(selector).style[key] = value
}

// 传入一个皆为 selector 的数组, 根据 condition 改变它们的 active 属性
const changeActive = (args, condition) => {
    if (condition === 'remove') {
        args.forEach((s) => {
            // 遍历获取每一个元素, 去除 active 属性
            e(s).classList.remove('active')
        })
    } else if(condition === 'add') {
        args.forEach((s) => {
            // 遍历获取每一个元素, 添加 active 属性
            e(s).classList.add('active')
        })
    }
}

// 传入一个 selector， 删除 class
const removeClass = (selector, className) => {
    // 考虑单个元素和多个元素
    if (typeof(selector) === 'string') {
        e(selector).classList.remove(className)
    } else if (typeof(selector) === 'array') {
        let elements = es(selector)
        // 遍历删除
        elements.forEach((e) => {
            e.classList.remove(className)
        })
    }
}

// 初始化常量
const audio = e('audio')
const _dirname_style = './static/music/style/img/'
const _dirname_music = './static/music/music/'

// 音乐数据   TODO:早日改为从后端获取数据
const musicList = [
    {
        music_title: 'El transcurrir de las horas',
        music_single: 'Bosques de mi Mente',
        music_src: _dirname_music + '1.mp3',
        music_id: 0,
        cover_src: _dirname_style + 'cover_1.jpg',
        background_src: _dirname_style + 'bg_1.jpg',
    },
    {
        music_title: 'The Whole Truth',
        music_single: 'Carlos Cipa',
        music_src: _dirname_music + '2.mp3',
        music_id: 1,
        cover_src: _dirname_style + 'cover_2.jpg',
        background_src: _dirname_style + 'bg_2.jpg',
    },
    {
        music_title: 'Flower dance',
        music_single: 'DJ OKAWARI',
        music_src: _dirname_music + '3.mp3',
        music_id: 2,
        cover_src: _dirname_style + 'cover_3.jpg',
        background_src: _dirname_style + 'bg_3.jpg',
    },
    {
        music_title: 'Давай за…',
        music_single: 'Lube',
        music_src: _dirname_music + '4.mp3',
        music_id: 3,
        cover_src: _dirname_style + 'cover_4.jpg',
        background_src: _dirname_style + 'bg_4.jpg',
    },
]

// 初始化页面

// 获取所有歌曲的 title
const getMusicTitle = () => {
    // 遍历每一个歌曲
    const result = []
    musicList.forEach((e) => {
        result.push(e.music_title)
    })
    // log(result)
    return result
}

// 初始化音乐列表的文本
const initMusicList = () => {
    const li = es('li')
    // 获取所有歌曲的 title
    const title = getMusicTitle()
    for (let i = 0; i < li.length; i++) {
        li[i].innerHTML = title[i]

    }
}

// 设置播放器顶端的 H1 和 P 标签的文本
const initMusicPlayerTitle = (index) => {
    const title = e('h1')
    const single = e('p')
    title.innerHTML = musicList[index].music_title
    single.innerHTML = musicList[index].music_single
    // 设置 audio 标签的自定义 id 属性为当前播放的歌曲
    audio.dataset.id = index
}

// 初始化
const ___init = () => {
    initMusicList()
    initMusicPlayerTitle(0)
    audio.volume = 0.7
}

// 传入一个 id， 返回一个 music Object
const getMusicForId = (id) => {
    let music = null
    musicList.forEach((e) => {
        // 遍历
        if (e.music_id == id) {
            music = e
        } 
    })
    // log('debug getMusicForId return', music)
    return music
}

const coverAndBackgroundSrc = (index) => {
    // log('back')
    const img = e('#id-img-cover')
    musicList.forEach((e) => {
        // log(e.music_id, index)
        if (e.music_id === index) {
            img.src = e.cover_src
            changeCss('.background', 'background', `url(${e.background_src})`)
        }
    })
}

// 播放状态的 style
const playedStyle = (index) => {
    // title 部分
    const title = e('h1')
    const single = e('p')
    const music = musicList[index]
    title.innerHTML = music.music_title
    single.innerHTML = music.music_single
    changeActive(['h1', 'p'], 'add')
    // main 部分
    // 唱片旋转效果
    changeCss('#id-img-cover', 'animation', 'cover_rotation 30s linear infinite')
    // 歌曲列表部分
    const ul = es('li')
    // 去除所有拥有 active 属性的 li 标签的 active 属性
    const activeLi = e('ul').querySelectorAll('.active')
    activeLi.forEach((e) => {
        e.classList.remove('active')
    })
    ul.forEach((e) => {
        // 删除所有 li 标签的 active 属性
        // 给符合条件的歌曲添加 active 属性
        // console.log(e.innerHTML === music.music_title)
        if (e.innerHTML === music.music_title) {
            e.classList.add('active')
            // log(e)
        }
    })
    // 左下角按钮
    const btn = e('#id-i-play')
    btn.classList.remove('fa-play')
    btn.classList.add('fa-pause')
}

// 暂停状态的 style
const pausedStyle = () => {
    // 去除掉 title 和 single 的 active 属性
    changeActive(['h1', 'p'], 'remove')
    es('.active').forEach((e) => {
        e.classList.remove('active')
    })
    changeCss('#id-img-cover ', 'animation', 'cover_rotation 30s linear infinite paused')
    // 左下角按钮
    const btn = e('#id-i-play')
    btn.classList.remove('fa-pause')
    btn.classList.add('fa-play')
}

// 根据 condetion 来进行播放或者暂停
const playOrPause = (condetion) => {
    if (condetion === true) {
        // 暂停状态点击
        let id = Number(audio.dataset.id)
        // 获取 audio 标签的 id
        const musicSrc = getMusicForId(id).music_src
        audio.src = musicSrc
        let music = null
        // music 是 null 或者一个 musicObject
        music = getMusicForId(id)
        // 根据 music id 改变当前歌曲状态, 开始播放
        playedStyle(id)
        coverAndBackgroundSrc(id)
        audio.play()
    } else if (condetion === false) {
        // 播放状态点击
        pausedStyle()
        audio.pause()
    }
}

// 播放或者暂停事件
const playOrPauseEvent = () => {
    const btn = e('#id-i-play')
    btn.addEventListener('click', () => {
        if (btn.classList.contains('fa-play') === true) {
            playOrPause(true)
        } else if(btn.classList.contains('fa-pause') === true)
            // log('播放状态点击')
            playOrPause(false)
      })    
}

// 进度条和歌曲时间事件
const progressStyle = () => {
    // 获取到缓存时间 / 总时间 的变量
    // const loadTime = audio.buffered.end(0) / audio.duration * 100
    const playTime = audio.currentTime / audio.duration * 100
    // changeCss('.progress-load', 'width', `${loadTime}%`/)
    changeCss('.progress-play', 'width', `${playTime}%`)
    const input = e('#id-input-play')
    input.value = playTime
}

// 进度条控制歌曲时间事件
const inputValueOnChangeEvent = () => {
    const input = e('#id-input-play')
    input.addEventListener('change', () => {
        const value = input.value
        const time = Number(value) / 100 * audio.duration
        audio.currentTime = time
    })
}

// 时间格式化
const timeInit = (time) => {
    let min = '' + Math.floor(time / 60) % 60
    let sec = Math.floor((time % 60).toFixed(2))
    // console.log(sec)
    let result = ''
    if (min < 10) {
        min = '0' + min
    }
    if (sec < 10) {
        sec = '0' + sec
    }
    result =  `${min}:${sec}`
    return result
}

// 歌曲时间
const musicTimeEvent = () => {
    // 获取到显示歌曲时间的 span 标签
    const TimeSpan = e('#id-span-time')
    audio.addEventListener('timeupdate', () => {
        // 获取到 audio 的现在时间和总时间， 只保留到小数点后两位
        let totalTime = timeInit(audio.duration) || 0
        let nowTime = timeInit(audio.currentTime)
        const time = `${nowTime} / ${totalTime}`
        TimeSpan.innerHTML = time
        progressStyle()
    })
}

// 歌曲列表点击事件
const musicListPlayEvent = () => {
    const ul = e('ul')
    ul.addEventListener('click', (element) => {
        // 获取到点击到的 li 标签
        const target = element.target
        const index = target.dataset.musicid
        // log(index)
        // 设置 audio 标签中的 data-id 为 点击到的 li 标签的 data-musicId
        audio.dataset.id = index
        playOrPause(true)
    })
}

// 下一首
const nextMusic = () => {
    // 获取到 audio 标签的 data-id
    let id = Number(audio.dataset.id)
    // 歌曲 id + 1 后取余， 成为一个 0 -- 3 -- 0 的循环
    let nextMusicId = (id + 1) % musicList.length
    // log('debug nextMusic, id, nextMusicId', id, nextMusicId)
    // 设置 audio 的 data-id 为下一首歌曲的 id
    audio.dataset.id = nextMusicId
    // 调用播放函数
    playOrPause(true)
}

// 下一首事件
const nextMusicEvent = () => {
    // 获取到下一首按钮
    const btn = e('.fa-step-forward')
    btn.addEventListener('click', () => {
        nextMusic()
    })
    // 歌曲播放结束触发 ended 事件
    audio.addEventListener('ended', () => {
        nextMusic()
    })
}

// 上一首

const backwardMusicEvent = () => {
    // 获取到上一首按钮
    const btn = e('.fa-step-backward')
    btn.addEventListener('click', () => {
        // 获取到 audio 标签的 data-id
        let id = Number(audio.dataset.id)
        // 歌曲 id + 3 后取余， 成为一个 3 -- 0 -- 3 的循环
        let preMusicId = (id + 3) % musicList.length
        // log('debug backwardMusic id, nextMusicID', id, preMusicId)
        audio.dataset.id = preMusicId
        // 调用播放函数
        // log('debug bacwardMusic, data-id', audio.dataset.id)
        playOrPause(true)
    })
}

// 音量按钮移除某个 class
const volumeChangeClass = (element, removeClassName, addClassName) => {
    removeClassName.forEach((e) => {
        element.classList.remove(e)
    })
    element.classList.add(addClassName)
}

// 音量按钮样式
const volumeStyle = (value) => {
    // 音量大于 0.5的样式, 小于 0.5 但是不为 0 的样式， 静音的样式
    const btn = e('#id-i-volume')
    if (value > 0.5) {
        volumeChangeClass(btn, ['fa-volume-off', 'fa-volume-down'], 'fa-volume-up')
    } else if (value < 0.5 && value > 0) {
        volumeChangeClass(btn, ['fa-volume-up', 'fa-volume-off'], 'fa-volume-down')
    } else if (value === 0) {
        volumeChangeClass(btn, ['fa-volume-up', 'fa-volume-down'], 'fa-volume-off')
    }
}

// 音量控制
const volumeValueOnChangeEvent = () => {
    const input = e('.volume-progress')
    input.addEventListener('change', () => {
        // 当 input 的 value 发生改变时
        const value = input.value
        log(value, typeof(value))
        volumeStyle(Number(value))
        audio.volume = value
    })
}

const ___main = () => {
    ___init()
    playOrPauseEvent()
    musicTimeEvent()
    inputValueOnChangeEvent()
    musicListPlayEvent()
    nextMusicEvent()
    backwardMusicEvent()
    volumeValueOnChangeEvent()
}

___main()