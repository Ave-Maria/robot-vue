import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import search from './modules/search'
import audio from './modules/audio'
import player from './modules/player'
import mqtt from './modules/mqtt'
import setting from './modules/setting'
import jssdk from './modules/jssdk'
import about from './modules/about'

Vue.use(Vuex)

const appStore = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production', // 在非生产环境下，使用严格模式
  modules: {
    search,
    audio,
    player,
    mqtt,
    setting,
    jssdk,
    about
  },
  getters: {
    ...getters
  },
  actions: {
    ...actions
  }
})

export default appStore
