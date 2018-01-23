import fetch from '../utils/fetch'
import _ from 'lodash'
import {parseURL} from '../utils/index'
// 解析当前URL
export function parseURI () {
  return parseURL(window.location.href)
}
// 生成新的 url
export function encodeURI (params = {}) {
  params.openid = window.openid || ''
  params.deviceid = window.deviceid || ''
  let uri = parseURI()
  let backUrl = uri.host + uri.path + '?wechat_id=' + uri.params.wechat_id
  _.forIn(params, (value, key) => {
    backUrl += '&' + key + '=' + value
  })
  return backUrl
}

// 微信用户登录出错
export function errorLogin () {
  // 线上服务器
  // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx329d4d2c3f46f842&redirect_uri=http%3a%2f%2f116.62.212.119%2fAIHomeMP%2findex.html%23%2f&response_type=code&scope=snsapi_userinfo&state=1&connect_redirect=1#wechat_redirect'
  // 205服务器
  // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc9ca5115c3bef144&redirect_uri=http%3a%2f%2f116.62.212.119%2fAIHomeMP%2findex.html%23%2f&response_type=code&scope=snsapi_userinfo&state=1&connect_redirect=1#wechat_redirect'
  // 正式服务器
  // let uri = parseURL(window.location.href)
  // let appId = uri.params.app_id
  // let backUrl = window.encodeURIComponent(uri.host + uri.path + '?wechat_id=' + uri.params.wechat_id + '&app_id=' + appId)
  // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + backUrl + '&response_type=code&scope=snsapi_userinfo&state=1&connect_redirect=1#wechat_redirect'
  // 暂无404页面默认跳转到微信错误提示页面
  // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=404&redirect_uri=index.html&response_type=code&scope=snsapi_userinfo&state=1&connect_redirect=1#wechat_redirect'
  window.location.hash = '/error'
}
// 配网二维码-线上服务器
// export let wechatQRCode = 'static/images/QR_Code_Online.png'
// 配网二维码-205服务器
export let wechatQRCode = 'static/images/QR_Code_Inline.png'
// 配网二维码-正式服务器
// export let wechatQRCode = 'http://shp.qpic.cn/hd_priv_pic/0/1508898899705bcd9201952fb2d330a6906c4354c9/0'
// 轮播图
export function carousel (query) {
  return fetch({
    url: '/AIHomeMP/carousel',
    method: 'get',
    params: query
  })
}
// 欢迎词
export function welcome (query) {
  return fetch({
    url: '/AIHomeMP/welcome',
    method: 'get',
    params: query
  })
}
// 添加一条收藏记录
export function collectionCreate (data, query) {
  return fetch({
    url: '/AIHomeMP/collection/create',
    method: 'post',
    data: data,
    params: query
  })
}
// 删除一条收藏记录
export function collectionDel (data, query) {
  return fetch({
    url: '/AIHomeMP/collection/del',
    method: 'post',
    data: data,
    params: query
  })
}
// 获取收藏列表
export function collectionListGet (query) {
  return fetch({
    url: '/AIHomeMP/collection/list',
    method: 'get',
    params: query
  })
}
// 获取配网
export function config (query) {
  return fetch({
    url: '/AIHomeMP/net/config',
    method: 'get',
    params: query
  })
}
// 批量添加单曲到播放列表
export function playlistCreate (data, query) {
  return fetch({
    url: '/AIHomeMP/playlist/create',
    method: 'post',
    data: data,
    params: query
  })
}
// 批量删除单曲从播放列表
export function playlistDel (data, query) {
  return fetch({
    url: '/AIHomeMP/playlist/del',
    method: 'post',
    data: data,
    params: query
  })
}
// 获取播放列表
export function playlist (query) {
  return fetch({
    url: '/AIHomeMP/playlist/list',
    method: 'get',
    params: query
  })
}
// 每日推荐
// http://home.aispeech.com/robot/xmly/tracks/hot?category_id=6&count=3&page=1
export function recommend (query) {
  return fetch({
    url: '/AIHomeMP/xmly/tracks/hot',
    method: 'get',
    params: query
  })
}
//  新品上架 需要指定calc_dimension为2(最新) (http://home.aispeech.com/robot/xmly/albums/list?category_id=6&&calc_dimension=2&count=3&page=1)
//  大家都在听 需要指定calc_dimension为1(最火) (http://home.aispeech.com/robot/xmly/albums/list?category_id=6&&calc_dimension=1&count=6&page=1)
export function albumsList (query) {
  return fetch({
    url: '/AIHomeMP/xmly/albums/list',
    method: 'get',
    params: query
  })
}
// 根据专辑ID获取专辑下专辑详情 http://home.aispeech.com/robot/xmly/albums/get_batch?ids=4117832
export function albumsBatch (query) {
  return fetch({
    url: '/AIHomeMP/xmly/albums/get_batch',
    method: 'get',
    params: query
  })
}
// 根据专辑ID获取专辑下的声音列表 http://home.aispeech.com/robot/xmly/albums/browse?sort=desc&count=20&page=1&album_id=8742642
export function albumsBrowse (query) {
  return fetch({
    url: '/AIHomeMP/xmly/albums/browse',
    method: 'get',
    params: query
  })
}
// 专辑搜索
export function searchAlbums (query) {
  return fetch({
    url: '/AIHomeMP/xmly/search/albums',
    method: 'get',
    params: query
  })
}
// 单曲搜索
export function searchTracks (query) {
  return fetch({
    url: '/AIHomeMP/xmly/search/tracks',
    method: 'get',
    params: query
  })
}
// 获取播放位置
export function playlistCurindex (query) {
  return fetch({
    url: '/AIHomeMP/playlist/curindex',
    method: 'get',
    params: query
  })
}
// 获取播放模式
export function playlistCurmodel (query) {
  return fetch({
    url: '/AIHomeMP/playlist/curmodel',
    method: 'get',
    params: query
  })
}
// 播放单曲（不管是上一首，还是下一首，还是某首歌，都走该接口）
// export function musicPlayerPlay (query) {
//   return fetch({
//     url: '/AIHomeMP/musicPlayer/play',
//     method: 'get',
//     params: query
//   })
// }
// 改变播放模式
export function musicPlayerModel (query) {
  return fetch({
    url: '/AIHomeMP/musicPlayer/model',
    method: 'get',
    params: query
  })
}
// 清空收藏列表
export function cleanCollectionList (data, query) {
  return fetch({
    url: '/AIHomeMP/collection/clean',
    method: 'get',
    data: data,
    params: query
  })
}
// 清空播放列表
export function cleanPlaylist (data, query) {
  return fetch({
    url: '/AIHomeMP/playlist/clean',
    method: 'post',
    data: data,
    params: query
  })
}
// 获取微信配置
export function getWeixinConfig (query) {
  return fetch({
    url: '/AIHomeMP/wechat/get',
    method: 'get',
    params: query
  })
}
// 添加全部歌曲到播放列表
export function playlistCreateAlbum (data, query) {
  return fetch({
    url: '/AIHomeMP/playlist/create_album',
    method: 'post',
    data: data,
    params: query
  })
}
// 从播放列表删除全部歌曲
export function playlistDelAlbum (data, query) {
  return fetch({
    url: '/AIHomeMP/playlist/del_album',
    method: 'post',
    data: data,
    params: query
  })
}
// 收藏专辑
export function collectionCreateAlbum (data, query) {
  return fetch({
    url: '/AIHomeMP/collection/create_album',
    method: 'post',
    data: data,
    params: query
  })
}
// 取消收藏专辑
export function collectionDelAlbum (data, query) {
  return fetch({
    url: '/AIHomeMP/collection/del_album',
    method: 'post',
    data: data,
    params: query
  })
}
// 获取专辑收藏列表
export function collectionListAlbum (query) {
  return fetch({
    url: '/AIHomeMP/collection/list_album',
    method: 'get',
    params: query
  })
}
// 置顶单曲收藏
export function collectionTop (data, query) {
  return fetch({
    url: '/AIHomeMP/collection/top',
    method: 'post',
    data: data,
    params: query
  })
}
// 置顶专辑收藏
export function collectionTopAlbum (data, query) {
  return fetch({
    url: '/AIHomeMP/collection/top_album',
    method: 'post',
    data: data,
    params: query
  })
}
// 添加到播放历史
export function historyCreate (data, query) {
  return fetch({
    url: '/AIHomeMP/history/create',
    method: 'post',
    data: data,
    params: query
  })
}
// 删除播放历史
export function historyDel (data, query) {
  return fetch({
    url: '/AIHomeMP/history/del',
    method: 'post',
    data: data,
    params: query
  })
}
// 获取播放历史列表
export function historyList (query) {
  return fetch({
    url: '/AIHomeMP/history/list',
    method: 'get',
    params: query
  })
}
// 清空播放列表
export function historyClean (query) {
  return fetch({
    url: '/AIHomeMP/history/clean',
    method: 'get',
    params: query
  })
}
// 获取个人设置
export function userSettingGet (query) {
  return fetch({
    url: '/AIHomeMP/userSetting/get',
    method: 'get',
    params: query
  })
}
// 更新个人设置
export function userSettingUpdate (data, query) {
  return fetch({
    url: '/AIHomeMP/userSetting/update',
    method: 'post',
    data: data,
    params: query
  })
}
// 上传头像
// export var userSettingUploadPic = '/AIHomeMP/userSetting/uploadPic'
export function userSettingUploadPic (data, query) {
  return fetch({
    url: '/AIHomeMP/userSetting/uploadPic',
    method: 'post',
    data: data,
    params: query
  })
}
// 清空个人设置
export function userSettingClean (query) {
  return fetch({
    url: '/AIHomeMP/userSetting/clean',
    method: 'get',
    params: query
  })
}
// 置顶播放列表记录
export function playlistTop (data, query) {
  return fetch({
    url: '/AIHomeMP/playlist/top',
    method: 'post',
    data: data,
    params: query
  })
}
// (通过公众号前台)播放一首歌->自动完成添加到列表（如需要），播放，记录播放位置，记录播放列表，添加到播放历史
export function musicPlayerPlay (data, query) {
  return fetch({
    url: '/AIHomeMP/musicPlayer/play',
    method: 'post',
    data: data,
    params: query
  })
}
// （通过公众号前台）上一首
export function musicPlayerPrev (query) {
  return fetch({
    url: '/AIHomeMP/musicPlayer/prev',
    method: 'get',
    params: query
  })
}
// （通过公众号前台）下一首
export function musicPlayerNext (query) {
  return fetch({
    url: '/AIHomeMP/musicPlayer/next',
    method: 'get',
    params: query
  })
}
// （通过公众号前台）调整音量
export function musicPlayerSetVolume (data, query) {
  return fetch({
    url: '/AIHomeMP/musicPlayer/setVolume',
    method: 'post',
    data: data,
    params: query
  })
}
// （通过公众号前台）获取音量
export function musicPlayerGetVolume (query) {
  return fetch({
    url: '/AIHomeMP/musicPlayer/getVolume',
    method: 'get',
    params: query
  })
}
// 公众号前台请求童锁状态
export function userSettingGetLock (query) {
  return fetch({
    url: '/AIHomeMP/userSetting/getLock',
    method: 'get',
    params: query
  })
}
// 公众号前台修改童锁
export function userSettingUpdateLock (data, query) {
  return fetch({
    url: '/AIHomeMP/userSetting/updateLock',
    method: 'post',
    data: data,
    params: query
  })
}
// 公众号前台获取闹钟
export function alarmList (query) {
  return fetch({
    url: '/AIHomeMP/alarm/list',
    method: 'get',
    params: query
  })
}
// 公众号前台保存闹钟
export function alarmSave (data, query) {
  return fetch({
    url: '/AIHomeMP/alarm/save',
    method: 'post',
    data: data,
    params: query
  })
}
// 公众号前台删除闹钟
export function alarmDel (data, query) {
  return fetch({
    url: '/AIHomeMP/alarm/del',
    method: 'post',
    data: data,
    params: query
  })
}
// 关于
export function userSettingAbout (query) {
  return fetch({
    url: '/AIHomeMP/userSetting/about',
    method: 'get',
    params: query
  })
}
// 收藏播放列表所有歌曲
export function playlistCollectAll (query) {
  return fetch({
    url: '/AIHomeMP/playlist/collectAll',
    method: 'get',
    params: query
  })
}
// 清空专辑收藏列表
export function collectionCleanAlbum (query) {
  return fetch({
    url: '/AIHomeMP/collection/clean_album',
    method: 'get',
    params: query
  })
}
// 获取低电量提示音
export function getLowBatteryPrompt (query) {
  return fetch({
    url: '/AIHomeMP/userSetting/getLowBatteryPrompt',
    method: 'get',
    params: query
  })
}
// 修改低电量提示音
export function updateLowBatteryPrompt (data, query) {
  return fetch({
    url: '/AIHomeMP/userSetting/updateLowBatteryPrompt',
    method: 'post',
    data: data,
    params: query
  })
}
// 检查设备是否在升级中
export function deviceStatusGet (query) {
  return fetch({
    url: '/AIHomeMP/deviceStatus/get',
    method: 'get',
    params: query
  })
}
// 获取config
export function wechatGetConfig (query) {
  return fetch({
    url: '/AIHomeMP/wechat/getConfig',
    method: 'get',
    params: query
  })
}
// 获取耳灯亮度
export function getEarLampBrightness (query) {
  return fetch({
    url: '/AIHomeMP/userSetting/getEarLampBrightness',
    method: 'get',
    params: query
  })
}
// 修改耳灯亮度
export function updateEarLampBrightness (data, query) {
  return fetch({
    url: '/AIHomeMP/userSetting/updateEarLampBrightness',
    method: 'post',
    data: data,
    params: query
  })
}
// 获取家庭成员
export function getFamilyGroup (query) {
  return fetch({
    url: '/AIHomeMP/familyGroup/getFamilyGroup',
    method: 'get',
    params: query
  })
}
// 修改群昵称
export function updateNickname (data, query) {
  return fetch({
    url: '/AIHomeMP/familyGroup/updateNickname',
    method: 'post',
    data: data,
    params: query
  })
}
// 获取分享页面
export function share (query) {
  return fetch({
    url: '/AIHomeMP/familyGroup/share',
    method: 'get',
    params: query
  })
}
// 获取宝宝语录
export function voiceRecordList (query) {
  return fetch({
    url: '/AIHomeMP/voiceRecord/list',
    method: 'get',
    params: query
  })
}
// 获取微信语聊提示
export function getChatPrompt (query) {
  return fetch({
    url: '/AIHomeMP/userSetting/getChatPrompt',
    method: 'get',
    params: query
  })
}
// 修改微信语聊提示
export function updateChatPrompt (data, query) {
  return fetch({
    url: '/AIHomeMP/userSetting/updateChatPrompt',
    method: 'post',
    data: data,
    params: query
  })
}
// 获取配网二维码
export function configQrcode (query) {
  return fetch({
    url: '/AIHomeMP/config/qrcode',
    method: 'get',
    params: query
  })
}
// 升级
export function upgradeVersion (data, query) {
  return fetch({
    url: '/AIHomeMP/userSetting/about/upgradeVersion',
    method: 'post',
    data: data,
    params: query
  })
}
// 搜索历史记录
export function searchHistoryList (query) {
  return fetch({
    url: '/AIHomeMP/search/history/list',
    method: 'get',
    params: query
  })
}
// 清空搜索历史记录
export function searchHistoryClean (query) {
  return fetch({
    url: '/AIHomeMP/search/history/clean',
    method: 'get',
    params: query
  })
}
// 热门搜索记录
export function searchHotList (query) {
  return fetch({
    url: '/AIHomeMP/search/hot/list',
    method: 'get',
    params: query
  })
}
// 绑定设备
export function deviceBindAdd (data, query) {
  return fetch({
    url: '/AIHomeMP/deviceBind/add',
    method: 'post',
    data: data,
    params: query
  })
}
// 获取设备列表
export function deviceBindList (query) {
  return fetch({
    url: '/AIHomeMP/deviceBind/list',
    method: 'get',
    params: query
  })
}
// 切换设备
export function deviceBindSetDefault (data, query) {
  return fetch({
    url: '/AIHomeMP/deviceBind/setDefault',
    method: 'post',
    data: data,
    params: query
  })
}
// 删除设备
export function deviceBindDelete (data, query) {
  return fetch({
    url: '/AIHomeMP/deviceBind/delete',
    method: 'post',
    data: data,
    params: query
  })
}
// 获取点阵屏开关
export function getScreenSetting (query) {
  return fetch({
    url: '/AIHomeMP/userSetting/getScreenSetting',
    method: 'get',
    params: query
  })
}
// 修改点阵屏开关
export function updateScreenSetting (data, query) {
  return fetch({
    url: '/AIHomeMP/userSetting/updateScreenSetting',
    method: 'post',
    data: data,
    params: query
  })
}
