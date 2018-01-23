import {userSettingAbout} from '../../api/album'
export default {
  namespaced: true,
  state: {
    noData: false,
    loading: false, // 加载数据状态
    phone_number: '', // 客服电话
    serviceTerms: '', // 服务条款
    instructions: '', // 使用说明
    faq: '', // 使用说明
    version: '', // 版本号
    publishId: null,
    new_version: {
      number: null,
      detail: null,
      date: null,
      url: null
    } // 新版本
  },
  mutations: {
    SET_NODATA (state, noData) {
      state.noData = noData
    },
    SET_LOADING (state, loading) {
      state.loading = loading
    },
    SET_ABOUT (state, data) {
      state.phone_number = data.phone_number
      state.serviceTerms = data.serviceTerms
      state.instructions = data.instructions
      state.faq = data.faq
      state.version = data.version
      state.publishId = data.publish_id
      state.new_version = data.new_version ? data.new_version : {number: null, detail: null, date: null, url: null}
    }
  },
  actions: {
    getAbout ({commit, state, dispatch}, reload = false) {
      if (state.version && !reload) return
      commit('SET_LOADING', true)
      userSettingAbout().then(response => {
        response = response.data
        if (response.errcode === 0) {
          commit('SET_ABOUT', response.data)
          commit('SET_NODATA', false)
          commit('SET_LOADING', false)
        }
      }).catch(error => {
        console.log(error)
        commit('SET_LOADING', false)
        commit('SET_NODATA', true)
      })
    }
  }
}
