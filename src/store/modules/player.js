export default {
  namespaced: true,
  state: {
    openPlayer: false, // 打开弹窗播放器
    openAllPlayer: true, // 打开整个播放器
    openHalfPlayer: false, // 打开logo播放器
    pageIndex: 0 // 显示页面信息 默认第一页
  },
  mutations: {
    PLAYER_OPEN (state) {
      state.openPlayer = true
    },
    PLAYER_CLOSE (state) {
      state.openPlayer = false
    },
    PLAYER_ALL_SHOW (state) {
      state.openAllPlayer = true
    },
    PLAYER_ALL_HIDE (state) {
      state.openAllPlayer = false
    },
    PLAYER_HALF_SHOW (state) {
      state.openHalfPlayer = true
    },
    PLAYER_HALF_HIDE (state) {
      state.openHalfPlayer = false
    },
    SET_PAGE_INDEX (state, pageIndex) {
      state.pageIndex = pageIndex
    }
  },
  actions: {
    setPageIndex ({ commit, state, dispatch }, pageInfo = {}) {
      commit('SET_PAGE_INDEX', pageInfo.pageIndex)
    },
    playerOpen ({ commit, state, dispatch }, pageInfo = {}) {
      dispatch('setPageIndex', pageInfo)
      commit('PLAYER_OPEN')
    },
    playerClose ({ commit, state, dispatch }) {
      commit('PLAYER_CLOSE')
    },
    playerAllShow ({ commit, state, dispatch }, pageInfo = {}) {
      commit('PLAYER_ALL_SHOW')
    },
    playerAllHide ({ commit, state, dispatch }) {
      commit('PLAYER_ALL_HIDE')
    },
    playerHalfShow ({ commit, state, dispatch }) {
      commit('PLAYER_HALF_SHOW')
    },
    playerHalfHide ({ commit, state, dispatch }) {
      commit('PLAYER_HALF_HIDE')
    }
  }
}
