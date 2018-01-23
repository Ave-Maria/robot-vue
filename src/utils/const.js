// 搜索分类
export let searchSorts = [
  {
    title: '趣萌儿歌',
    value: 1,
    checked: false,
    icon: 'static/images/FunnyChant@2x.png',
    keyword: ' 儿歌 '
  },
  {
    title: '趣萌故事',
    value: 2,
    checked: false,
    icon: 'static/images/FunnyStory@2x.png',
    keyword: ' 故事 '
  },
  {
    title: '国学启蒙',
    value: 3,
    checked: false,
    icon: 'static/images/SinologyEnlightenment@2x.png',
    keyword: ' 国学启蒙 国学 '
  },
  {
    title: '英语启蒙',
    value: 4,
    checked: false,
    icon: 'static/images/EnglishEnlightenment@2x.png',
    keyword: ' 英语启蒙 '
  },
  {
    title: '睡前故事',
    value: 5,
    checked: false,
    icon: 'static/images/BedtimeStory@2x.png',
    keyword: ' 睡前故事 哄睡故事 晚安故事 '
  },
  {
    title: '成语故事',
    value: 6,
    checked: false,
    icon: 'static/images/idiomStory@2x.png',
    keyword: ' 成语故事 '
  },
  {
    title: '相声小品',
    value: 7,
    checked: false,
    icon: 'static/images/CrossTalk@2x.png',
    keyword: ' 相声小品 相声 小品 '
  },
  {
    title: '趣萌笑话',
    value: 8,
    checked: false,
    icon: 'static/images/jokes@2x.png',
    keyword: ' 笑话 '
  },
  {
    title: '聆听历史',
    value: 9,
    checked: false,
    icon: 'static/images/ListenToHistory@2x.png',
    keyword: ' 聆听历史 历史故事 历史 '
  }
]
// 搜索年龄
export let searchAges = [
  {
    title: '孕期',
    value: 1,
    checked: false
  },
  {
    title: '0~1岁',
    value: 2,
    checked: false
  },
  {
    title: '1~2岁',
    value: 3,
    checked: false
  },
  {
    title: '2~3岁',
    value: 4,
    checked: false
  },
  {
    title: '3~6岁',
    value: 5,
    checked: false
  },
  {
    title: '6岁以上',
    value: 6,
    checked: false
  }
]
// 播放列表类型
export let listArray = [
  'playlist',
  'favlist',
  'other'
]
// 闹钟重复选项
export let alarmRuleOption = {
  'NULL': '永不',
  'EVERYDAY': '每天',
  'W1': {
    simple: '周一',
    complete: '每周一'
  },
  'W2': {
    simple: '周二',
    complete: '每周二'
  },
  'W3': {
    simple: '周三',
    complete: '每周三'
  },
  'W4': {
    simple: '周四',
    complete: '每周四'
  },
  'W5': {
    simple: '周五',
    complete: '每周五'
  },
  'W6': {
    simple: '周六',
    complete: '每周六'
  },
  'W7': {
    simple: '周日',
    complete: '每周日'
  }
}
// 耳灯亮度 选项
export let earlampOption = {
  0: {
    name: '不亮',
    num: 0
  },
  2: {
    name: '较暗',
    num: 2
  },
  3: {
    name: '较亮',
    num: 3
  },
  4: {
    name: '最亮',
    num: 4
  }
}
// 定时关机 选项
export let poweroffOption = {
  0: {
    num: 0,
    name: '取消定时关机',
    poweroff: 0,
    duration: 0 * 60
  },
  1: {
    num: 1,
    name: '立即关机',
    poweroff: 1,
    duration: 0 * 60
  },
  2: {
    num: 2,
    name: '10分钟',
    poweroff: 1,
    duration: 10 * 60
  },
  3: {
    num: 3,
    name: '20分钟',
    poweroff: 1,
    duration: 20 * 60
  },
  4: {
    num: 4,
    name: '30分钟',
    poweroff: 1,
    duration: 30 * 60
  },
  5: {
    num: 5,
    name: '60分钟',
    poweroff: 1,
    duration: 60 * 60
  },
  6: {
    num: 6,
    name: '90分钟',
    poweroff: 1,
    duration: 90 * 60
  },
  7: {
    num: 7,
    name: '120分钟',
    poweroff: 1,
    duration: 120 * 60
  }
}
// 耳灯亮度 选项
export let lockOption = {
  1: {
    name: '开',
    num: true
  },
  0: {
    name: '关',
    num: false
  }
}
// 语音消息 选项
export let volumeTipOption = {
  5: {
    url: 'static/audio/WxMsg4.mp3',
    name: '宝贝收消息啦',
    num: 5
  },
  // 4: {
  //   url: 'static/audio/WxMsg3.mp3',
  //   name: '妈妈来消息啦',
  //   num: 4
  // },
  3: {
    url: 'static/audio/WxMsg2.mp3',
    name: '宝宝,微信有留言哦',
    num: 3
  },
  2: {
    url: 'static/audio/WxMsg1.mp3',
    name: '宝宝,有新的微信消息',
    num: 2
  },
  1: {
    url: 'static/audio/WxMsg0.mp3',
    name: '新消息来啦',
    num: 1
  }
}
// 语音消息 选项
export let powerTipOption = {
  5: {
    url: 'static/audio/LpPmpt4.mp3',
    name: '宝贝,我饿了,记得给我充电哦',
    num: 5
  },
  4: {
    url: 'static/audio/LpPmpt3.mp3',
    name: '宝贝,小驰需要补充能量啦,赶紧帮我充电吧',
    num: 4
  },
  3: {
    url: 'static/audio/LpPmpt2.mp3',
    name: '宝贝,快充电吧,我饿得没力气了',
    num: 3
  },
  2: {
    url: 'static/audio/LpPmpt1.mp3',
    name: '宝贝,电池电量低,请让爸爸妈妈充电吧',
    num: 2
  },
  1: {
    url: 'static/audio/LpPmpt0.mp3',
    name: '宝贝,我快没电了,快让爸爸妈妈帮我充电吧',
    num: 1
  }
}
// 添加单曲,静默删除类型 选项
export let coverOption = {
  AutoCoverPlaylist: 'AutoCoverPlaylist' // 播放列表500首单曲 -> 超过删除
}
// 添加单曲长度界限
export let playListLength = 500
// 操作状态
export let actions = {
  create: 'create', // 递增
  delete: 'delete', // 删除
  update: 'update', // 更改
  read: 'read' // 读取
}

