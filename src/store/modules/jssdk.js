// import {EventMethods} from '../../components/Modal/EventBus'
import _ from 'lodash'
import wx from 'weixin-js-sdk'
import {wechatGetConfig} from '../../api/album'
export default {
  namespaced: true,
  state: {
    wx: wx, // js-sdk
    wxConfig: { // 微信配置
      beta: true,
      debug: false,
      jsApiList: [
        'closeWindow', // 关闭当前网页窗口接口
        'hideOptionMenu', // 隐藏网页右上角菜单
        'onMenuShareTimeline', // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
        'onMenuShareAppMessage', // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
        'hideMenuItems', // 批量隐藏功能按钮接口
        'openWXDeviceLib', // 初始化设备库（只支持蓝牙设备）
        'closeWXDeviceLib', // 关闭设备库（只支持蓝牙设备）
        'getWXDeviceInfos', // 获取设备信息（获取当前用户已绑定的蓝牙设备列表）
        'sendDataToWXDevice', // 发送数据给设备
        'startScanWXDevice', // 扫描设备（获取周围所有的设备列表，无论绑定还是未被绑定的设备都会扫描到）
        'stopScanWXDevice', // 停止扫描设备
        'connectWXDevice', // 连接设备
        'disconnectWXDevice', // 断开设备连接
        'getWXDeviceTicket', // 获取操作凭证
        'configWXDeviceWiFi', // 设置设备Wifi
        'onWXDeviceBindStateChange', // 微信客户端设备绑定状态被改变时触发此事件
        'onWXDeviceStateChange', // 监听连接状态，可以监听连接中、连接上、连接断开
        'onReceiveDataFromWXDevice', // 接收到来自设备的数据时触发
        'onScanWXDeviceResult', // 扫描到某个设备时触发
        'onWXDeviceBluetoothStateChange' // 手机蓝牙打开或关闭时触发
      ] // 默认
    },
    wxReady: false, // 微信是否配置ok
    wxIsLoaded: false // 是否加载微信配置
  },
  mutations: {
    SET_WX_CONFIG (state, wxConfig = {}) {
      state.wxConfig = _.assign(state.wxConfig, wxConfig)
    },
    SET_WX_READY (state, wxReady) {
      state.wxReady = wxReady
    },
    SET_WX_IS_READY (state, wxIsLoaded) {
      state.wxIsLoaded = wxIsLoaded
    }
  },
  actions: {
    // 获取微信配置
    getWechatConfig ({ commit, state, dispatch }) {
      if (state.wxIsLoaded) return
      wechatGetConfig({url: location.href.split('#')[0]}).then(response => {
        response = response.data
        if (response.errcode === 0) {
          console.log('before wechatGetConfig , wxConfig=', state.wxConfig)
          commit('SET_WX_CONFIG', response.data)
          console.log('after wechatGetConfig , wxConfig=', state.wxConfig)
          dispatch('setConfig')
        }
      })
    },
    // 设置微信配置
    setWxConfig ({ commit, state, dispatch }, config = {}) {
      commit('SET_WX_CONFIG', config)
      if (!state.wxIsLoaded) {
        dispatch('getWechatConfig')
      } else {
        dispatch('setConfig')
      }
    },
    // wx注入微信配置
    setConfig ({ commit, state, dispatch }) {
      // 检查是否配置
      state.wx.config(state.wxConfig)
      commit('SET_WX_READY', false)
      state.wx.ready(() => {
        commit('SET_WX_READY', true)
        // state.wx.checkJsApi({
        //   jsApiList: [],
        //   success: function (res) {
        //     // 关闭右上角菜单
        //     wx.hideAllNonBaseMenuItem()
        //   }
        // })
      })
    }
  }
}
