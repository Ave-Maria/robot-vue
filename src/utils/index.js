import _ from 'lodash'
export function dateAdd (interval, number, date) {
  /*
    * 功能:实现VBScript的DateAdd功能.
    * 参数:interval,字符串表达式，表示要添加的时间间隔.
    * 参数:number ,数值表达式，表示要添加的时间间隔的个数.
    * 参数:date,时间对象.
    * 返回:新的时间对象.
    * var now = new Date()
    * var newDate = DateAdd('d',5,now)
    *--------------- DateAdd(interval,number ,date) -----------------
    */
  switch (interval) {
    case 'year': {
      date.setFullYear(date.getFullYear() + number)
      return date
    }
    case 'quarter': {
      date.setMonth(date.getMonth() + number * 3)
      return date
    }
    case 'month': {
      date.setMonth(date.getMonth() + number)
      return date
    }
    case 'week': {
      date.setDate(date.getDate() + number * 7)
      return date
    }
    case 'day': {
      date.setDate(date.getDate() + number)
      return date
    }
    case 'hour': {
      date.setHours(date.getHours() + number)
      return date
    }
    case 'minute': {
      date.setMinutes(date.getMinutes() + number)
      return date
    }
    case 'second': {
      date.setSeconds(date.getSeconds() + number)
      return date
    }
    default: {
      date.setDate(date.getDate() + number)
      return date
    }
  }
}

/*
* 功能:判断是否在微信浏览器中打开
*/
export function isWeixn () {
  var ua = navigator.userAgent.toLowerCase()
  if (ua.indexOf('micromessenger') > -1) {
    return true
  } else {
    return false
  }
}
/*
* 功能:采用正则表达式获取地址栏参数
*/
export function GetQueryString (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

/*
* 功能:格式化喜马拉雅“单曲”数据格式（收藏功能）
*/
export function formatTrack (tracks) {
  let requestData = [
    {
      'musicId': tracks.id,
      'musicTitle': tracks.track_title,
      'musicType': '0',
      'artistsName': (tracks.announcer && tracks.announcer.nickname ? tracks.announcer.nickname : ''),
      'cover_url_middle': tracks.cover_url_middle,
      'cover_url_large': tracks.cover_url_large,
      // 'openid': window.openid,
      'play_url': (tracks.play_url_32 || tracks.play_url_64),
      'duration': tracks.duration,
      'albumName': (tracks.subordinated_album && tracks.subordinated_album.album_title ? tracks.subordinated_album.album_title : '')
    }
  ]
  return requestData
}
/*
* 功能:格式化喜马拉雅“单曲”数据格式（收藏功能）
*/
export function parseTrack (tracks) {
  return {
    'id': tracks.musicId,
    'track_title': tracks.musicTitle,
    'announcer': {
      'nickname': tracks.artistsName
    },
    'cover_url_middle': tracks.cover_url_middle,
    'cover_url_large': tracks.cover_url_large,
    'play_url_32': tracks.play_url,
    'duration': tracks.duration,
    'subordinated_album': {
      'album_title': tracks.albumName
    }
  }
}
/*
* 功能:格式化故事机传过来“单曲”数据格式（收藏功能）
*/
// export function formatTrackFromToy (tracks) {
//   let requestData = [
//     {
//       'musicTitle': tracks.song,
//       'cover_url_large': '',
//       'musicId': tracks.id,
//       'play_url': tracks.url,
//       'artistsName': '',
//       // 'openid': window.openid,
//       'musicType': '0',
//       'cover_url_middle': tracks.img
//     }
//   ]
//   return requestData
// }
/*
* 功能:判断中英文字符长度
*/
export function countLength (str) {
  var inputLength = 0
  // 给一个变量来记录长度
  for (var i = 0; i < str.length; i++) {
    var countCode = str.charCodeAt(i)
    // 返回指定位置的字符的Unicode编码
    // 判断是不是ASCII码,Unicode码前128个字符是ASCII码
    if (countCode >= 0 && countCode <= 128) {
      inputLength++
    } else {
      inputLength += 2
      // 如果是扩展码，则一次+2
    }
  }
  return inputLength
}
/*
* 功能:判断中英文字符长度是否超出长度
*/
export function isOverLength (str, strLength) {
  var isOver = false
  var inputLength = 0
  // 给一个变量来记录长度
  for (var i = 0; i < str.length; i++) {
    var countCode = str.charCodeAt(i)
    // 返回指定位置的字符的Unicode编码
    // 判断是不是ASCII码,Unicode码前128个字符是ASCII码
    if (countCode >= 0 && countCode <= 128) {
      inputLength++
    } else {
      inputLength += 2
      // 如果是扩展码，则一次+2
    }
    // 是否超过置顶长度
    if (strLength > inputLength) {
      isOver = true
    }
  }
  return isOver
}
/*
* 功能:判断中英文字符长度是否超出长度
*/
// export function dateDiff (date1, date2, type) {
//   date1 = typeof date1 === 'string' ? new Date(date1) : date1
//   date1 = date1.getTime()
//   date2 = typeof date2 === 'string' ? new Date(date2) : date2
//   date2 = date2.getTime()
//   type = type || 'hour'
//   var diffValue = Math.abs(date2 - date1)
//   var second = 1000
//   var minute = second * 60
//   var hour = minute * 60
//   var day = hour * 24
//   var month = day * 30
//   var year = month * 12
//   var timeType = {
//     second: second,
//     minute: minute,
//     hour: hour,
//     day: day,
//     month: month,
//     year: year
//   }
//   return Math.ceil(diffValue / timeType[type])
// }
/*
* 功能:根据日期格式，格式化时间戳
*/
export function timeformat (format, time) {
  if (!format) return
  var dateObj = time ? new Date(time) : new Date()
  var date = {
    'M+': dateObj.getMonth() + 1,
    'd+': dateObj.getDate(),
    'h+': dateObj.getHours(),
    'm+': dateObj.getMinutes(),
    's+': dateObj.getSeconds(),
    'q+': Math.floor((dateObj.getMonth() + 3) / 3),
    'S+': dateObj.getMilliseconds()
  }
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in date) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
    }
  }
  return format
}
export function landscapeScreen (className) {
  // 获取当前屏幕方向（是否是竖屏状态）
  // var mql = window.matchMedia('(orientation: portrait)')
  // console.log(mql)
  // function handleOrientationChange (mql) {
  //   var body = document.querySelector('body')
  //   var conW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  //   var conH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  //   if (mql.matches) {
  //     // 竖屏 console.log('portrait')
  //     body.style.setProperty('transform', '')
  //     body.style.setProperty('width', '')
  //     body.style.setProperty('height', '')
  //     body.style.setProperty('transform-origin', '')
  //     body.style.setProperty('-webkit-transform-origin', '')
  //   } else {
  //     // 横屏 console.log('landscape')
  //     console.log('transform', 'rotate(90deg) translate(' + ((conH - conW) / 2) + 'px,' + ((conH - conW) / 2) + 'px)')
  //     body.style.setProperty('transform', 'rotate(90deg)')
  //     // body.style.setProperty('width', conW + 'px')
  //     body.style.setProperty('height', conW + 'px')
  //     body.style.setProperty('transform-origin', 'center center')
  //     body.style.setProperty('-webkit-transform-origin', 'center center')
  //   }
  // }
  // // 输出当前屏幕模式
  // handleOrientationChange(mql)
  // // 监听屏幕模式变化
  // mql.addListener(handleOrientationChange)
  // // transform 强制横屏
  // var conW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  // var conH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  // // transform: rotate(90deg) width: 667px height: 375pxtransform-origin:28% 50%
  // // var iosTopHe = 0//若有其他样式判断，写于此
  // var body = document.querySelector('body')

  // $(className).css({
  //   'transform': 'rotate(90deg) translate(' + ((conH - conW) / 2) + 'px,' + ((conH - conW) / 2) + 'px)',
  //   'width': conH + 'px',
  //   'height': conW + 'px',
  //   'transform-origin': 'center center',
  //   '-webkit-transform-origin': 'center center'
  // })
}
/*
* 功能:横竖屏切换
*/
export function toggleScreen (designWidth, maxWidth) {
  var doc = document
  var win = window
  var docEl = doc.documentElement
  var remStyle = document.createElement('style')
  var tid

  function refreshRem () {
    var width = docEl.getBoundingClientRect().width
    maxWidth = maxWidth || 540
    width > maxWidth && (width = maxWidth)
    var rem = width * 10 / designWidth
    remStyle.innerHTML = 'html{font-size:' + rem + 'px}'
  }

  if (docEl.firstElementChild) {
    docEl.firstElementChild.appendChild(remStyle)
  } else {
    var wrap = doc.createElement('div')
    wrap.appendChild(remStyle)
    doc.write(wrap.innerHTML)
    wrap = null
  }
  // 要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
  refreshRem()

  win.addEventListener('resize', function () {
    clearTimeout(tid) // 防止执行两次
    tid = setTimeout(refreshRem, 300)
  }, false)

  win.addEventListener('pageshow', function (e) {
    if (e.persisted) { // 浏览器后退的时候重新计算
      clearTimeout(tid)
      tid = setTimeout(refreshRem, 300)
    }
  }, false)

  if (doc.readyState === 'complete') {
    doc.body.style.fontSize = '16px'
  } else {
    doc.addEventListener('DOMContentLoaded', function (e) {
      doc.body.style.fontSize = '16px'
    }, false)
  }
}
/*
* 功能:设置页面title
*/
export function setTitle (title) {
  document.title = title
}
/*
* 功能:页面输入框失去焦点
*/
export function inputBlur () {
  let inputArr = document.querySelectorAll('input,textarea')
  console.log('inputArr', inputArr)
  for (var i = 0; i < inputArr.length; i++) {
    inputArr[i].blur()
  }
}
/*
* 功能:计算图片的文件流大小 单位为字节
*/
export function countImgLength (str) {
  if (!str) return
  str = str.substring(22)
  var equalIndex = str.indexOf('=')
  if (str.indexOf('=') > 0) {
    str = str.substring(0, equalIndex)
  }
  var strLength = str.length
  var fileLength = parseInt(strLength - (strLength / 8) * 2)
  return fileLength
}
/*
* 功能:URL解析函数和分段URL解析方法
*/
export function parseURL (url) {
  var a = document.createElement('a')
  a.href = url
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function () {
      var ret = {}
      var seg = a.search.replace(/^\?/, '').split('&')
      var len = seg.length
      var i = 0
      var s
      for (; i < len; i++) {
        if (!seg[i]) {
          continue
        }
        s = seg[i].split('=')
        ret[s[0]] = s[1]
      }
      return ret
    })(),
    file: (a.pathname.match(/\/([^\\/?#]+)$/i) || ['', ''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^\\/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^\\/]+(.+)/) || ['', ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/')
  }
}
/*
* 功能:过滤字符串前后空格或去掉所有空格
* @param string
* @param {string}
* @returns string
*/
export function trim (str = '', isGlobal) {
  var result
  result = str.replace(/(^\s+)|(\s+$)/g, '')
  if (isGlobal && isGlobal.toLowerCase() === 'g') {
    result = result.replace(/\s/g, '')
  }
  return result
}
/*
* 功能:验证手机号码
*/
export function checkPhoneNum (mobile) {
  var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
  return reg.test(mobile)
}
/*
* 功能: 抓取页面错误
*/
export function catchError () {
  console.log('----init catchError----')
  window.onerror = (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) => {
    alert('错误信息：', errorMessage)
    alert('出错文件：', scriptURI)
    alert('出错行号：', lineNumber)
    alert('出错列号：', columnNumber)
    alert('错误详情：', errorObj)
  }
}
/*
* 功能: 生成指定随机数
* @params number
* return string
*/
export function generateMixed (n) {
  var jschars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  var res = ''
  for (var i = 0; i < n; i++) {
    var id = Math.ceil(Math.random() * 35)
    res += jschars[id]
  }
  return res
}
/*
* 功能:mqtt相关函数
*/
export function toyFormatData (data = {}) {
  let initData = {
    name: 'toy',
    data: {}
  }
  return _.assign(initData, data)
}
export function getTimestamp (command, value) {
  return new Date().getTime()
}
export function getCommandValueMessage (command, value) {
  var message = {
    'command': command,
    'value': value,
    'timestamp': getTimestamp()
  }
  return JSON.stringify(message)
}
export function getCommandIndexMessage (command, index) {
  var message = {
    'command': command,
    'index': index,
    'timestamp': getTimestamp()
  }
  return JSON.stringify(message)
}
export function getCommandMessage (command) {
  var message = {
    'command': command,
    'timestamp': getTimestamp()
  }
  return JSON.stringify(message)
}

