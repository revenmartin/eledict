let http = require('http')

function switchToDailyPage() {
    document.getElementById('dailybar').classList.add('is-shown')
    document.getElementById('dictpage').classList.remove('is-shown')
}

function switchToDictPage() {
    document.getElementById('dailybar').classList.remove('is-shown')
    document.getElementById('dictpage').classList.add('is-shown')
}

function initDailyData() {
    let url = 'http://dict.youdao.com/infoline/style/cardList?apiversion=3.0&client=deskdict&style=daily&lastId=0&keyfrom=deskdict.8.1.2.0&size=1';

    http.get(url, (res) => {
        let code = res.statusCode
        if (code == 200) {
            res.setEncoding('utf-8')
            let rawData = ''

            res.on('data', function(chunk) {
                rawData += chunk
            })

            res.on('end', () => {
                let jsonContent = JSON.parse(rawData)[0]
                let voiceURL = jsonContent.voice

                document.getElementById('dailytitle').innerHTML = jsonContent.title
                document.getElementById('dailysummary').innerHTML = jsonContent.summary
                document.getElementById('dailyimage').setAttribute('src', jsonContent.image[0])
                switchToDailyPage()
                console.log("首页加载成功")
            })
        } else {
            document.getElementById('dailytitle').innerHTML = "加载失败，请检查您的网络"
            console.log("首页加载失败")
        }
    })
}

function queryWord(string) {
    let url = `http://dict.youdao.com/jsonresult?q=${string}&type=1&client=desktop&pos=-1&len=eng`

    http.get(url, (res) => {
        let code = res.statusCode

        if (code == 200) {
            res.setEncoding('utf-8')
            let rawData = ''

            res.on('data', function(chunk) {
                rawData += chunk
            })

            res.on('end', () => {
                var jsonContent = JSON.parse(rawData)
                // console.log(rawData)

                // 音标
                var uspron = ''
                var ukpron = ''

                if (jsonContent.uksm != "") {
                    ukpron = `英 /${jsonContent.uksm}/`
                }

                if (jsonContent.ussm != "") {
                    uspron = `美 /${jsonContent.ussm}/`
                }

                // 设置内容
                document.getElementById('word').innerHTML = jsonContent.rq
                document.getElementById('ukpron').innerHTML = ukpron
                document.getElementById('uspron').innerHTML = uspron

                var basic_len = jsonContent.basic
                var basic_content = ''
                for (var i = 0; i < basic_len.length; ++i) {
                    basic_content += `${jsonContent.basic[i]} <br>`
                }

                document.getElementById('basic').innerHTML = basic_content

                // 切换到词典页面
                document.getElementById('dailybar').classList.remove('is-shown')
                document.getElementById('dictpage').classList.add('is-shown')
            })
        } else {
            // network error
        }
    })
}

function handleQueryWord() {
    var text = queryBox.value

    if (text.trim() != "") {
        queryWord(text.trim())
    } else {
        switchToDailyPage()
    }    
}

// 增加事件
const queryButton = document.querySelector('#querybutton')
const queryBox = document.querySelector('#querybox')

// queryBox.oninput = () => {
//     handleQueryWord()
// }

queryBox.onkeyup = function(event){
    // console.log(event.keyCode)
    // 13 表示回车

    if (event.keyCode == 13) {
        handleQueryWord()
    }
}

queryBox.oninput = () => {
    if (queryBox.value.trim() == "") {
        switchToDailyPage()
    }
}

queryButton.onclick = () => {
    handleQueryWord()
}

initDailyData()
