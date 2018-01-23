import {errorLogin, getWeixinConfig} from '../../api/album'
import {inputBlur} from '../../utils/index'
import {EventMethods} from '../../components/Modal/EventBus'
// import _ from 'lodash'
export default {
  state: {
    onLine: true,
    portraitScreen: true, // 默认当前屏幕方向（竖屏状态）
    WeixinConfig: {}, // 微信配置
    WeixinReady: false, // 是否微信配置ok
    WeixinLoading: false // 是否微信正在loading
  },
  mutations: {
    // 当前屏幕方向（是否是竖屏状态）
    SET_PORTRAIT_SCREEN (state, portraitScreen) {
      state.portraitScreen = portraitScreen
    },
    // 设置微信用户config
    SET_WEIXIN_CONFIG (state, WeixinConfig) {
      state.WeixinConfig = WeixinConfig
    },
    // 设置微信用户config
    SET_WEIXIN_READY (state, WeixinReady) {
      state.WeixinReady = WeixinReady
    },
    // 设置微信loading
    SET_WEIXIN_LOADING (state, WeixinLoading) {
      state.WeixinLoading = WeixinLoading
    },
    // 设置微信loading
    SET_CLIENT_ONLINE (state, onLine) {
      state.onLine = onLine
    }
  },
  actions: {
    // 监听设置设备联网状态
    listenClientOnline ({ commit, state, dispatch }) {
      commit('SET_CLIENT_ONLINE', window.navigator.onLine)
      // 离线
      window.addEventListener('offline', (e) => {
        commit('SET_CLIENT_ONLINE', false)
        EventMethods.tip('请检查网络是否连接')
      })
      // 上线
      window.addEventListener('online', (e) => {
        commit('SET_CLIENT_ONLINE', true)
      })
    },
    // 当前屏幕方向（是否是竖屏状态）
    listenPortraitScreen ({ commit, state, dispatch }) {
      if (!window.matchMedia) return
      // 监听媒体对象
      let mql = window.matchMedia('(orientation: portrait)')
      commit('SET_PORTRAIT_SCREEN', mql.matches)
      // 监听横竖屏
      mql.addListener(() => {
        commit('SET_PORTRAIT_SCREEN', mql.matches) // 竖屏 | 横屏
        if (!mql.matches && !(/Android/gi.test(navigator.userAgent))) {
          // 横屏页面输入框失去焦点
          inputBlur()
        }
      })
      // Android 手机下, input 或 textarea 元素聚焦时, 主动滚动可视区域
      if (!(/Android/gi.test(navigator.userAgent))) return
      window.addEventListener('resize', () => {
        setTimeout(() => {
          if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') return
          // 输入框滚动可视区域
          document.activeElement.scrollIntoViewIfNeeded()
          // 屏幕高度 大于 宽度 得出 竖屏
          if (window.screen.height <= window.screen.width) {
            // 横屏页面输入框失去焦点
            inputBlur()
            commit('SET_PORTRAIT_SCREEN', false)
            return
          }
          commit('SET_PORTRAIT_SCREEN', true)
        }, 10)
      })
    },
    getWeixinConfig ({ commit, state, dispatch }, code) {
      commit('SET_WEIXIN_LOADING', true)
      getWeixinConfig({code}).then(response => {
        commit('SET_WEIXIN_LOADING', false)
        let responseData = response.data
        // 非微信用户 则强制用户登录
        if (!responseData.openid) {
          errorLogin()
        }
        // 设置微信信息
        commit('SET_WEIXIN_READY', true)
        commit('SET_WEIXIN_CONFIG', responseData)
        window.openid = responseData.openid
        window.deviceid = responseData.deviceid
        // 设置device id
        dispatch('intWeixinConfig', responseData.deviceid)
      }).catch(error => {
        console.log(error)
        commit('SET_WEIXIN_READY', false)
      })
    },
    intWeixinConfig ({commit, state, dispatch}, deviceid = null) {
      dispatch('listenClientOnline')
      dispatch('listenPortraitScreen')
    },
    // 未绑定设备
    noClientBind ({ commit, state, dispatch }) {
      commit('SET_CLIENT_BIND', false)
    }
    // ,
    // // 修改微信语聊提示
    // chatPromptUpdate ({commit, state, dispatch}, postdata = {}) {
    //   let orgindata = {auto: state.volumeTipAutoPlay, index: state.volumeTip}
    //   postdata = _.assign(orgindata, postdata)
    //   updateChatPrompt(postdata).then(response => {
    //     response = response.data
    //     if (response.errcode === 0) {
    //       commit('SET_VOLUME_TIP_AUTO_PLAY', postdata.auto)
    //       commit('SET_VOLUME_TIP', postdata.index)
    //     }
    //   })
    // }
  }
}
