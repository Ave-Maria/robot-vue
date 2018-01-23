export default {
  namespaced: true,
  state: {
    isOpenInput: false // input框获取焦点
  },
  mutations: {
    OPEN_INPUT (state) {
      state.isOpenInput = true
    },
    CLOSE_INPUT (state) {
      state.isOpenInput = false
    }
  },
  actions: {
    openInput ({ commit, state, dispatch }) {
      commit('OPEN_INPUT')
    },
    closeInput ({ commit, state, dispatch }) {
      commit('CLOSE_INPUT')
    }
  }
}
