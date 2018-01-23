import _ from 'lodash'
import {EventMethods} from '../../components/Modal/EventBus'
import {
  userSettingGet,
  userSettingUpdate,
  userSettingClean
} from '../../api/album'
export default {
  namespaced: true,
  state: {
    avatar: '', // 头像url
    name: '小驰宝宝', // 名字，默认为小驰宝宝
    sex: 1, // 1为男，0为女，默认为1
    birth: null, // 生日，时间戳格式
    sexOption: [ // 性别选项
      {
        value: 1,
        name: '王子'
      },
      {
        value: 0,
        name: '公主'
      }
    ],
    nameLength: 16 // 中文8个字 = 英文16个字 = 16个字符
  },
  mutations: {
    SET_AVATAR (state, avatar) {
      state.avatar = avatar
    },
    SET_NAME (state, name) {
      state.name = name
    },
    SET_SEX (state, sex) {
      state.sex = sex
    },
    SET_BIRTH (state, birth) {
      state.birth = birth
    },
    USER_SETTING_CLEAN (state) {
      state.avatar = ''
      state.name = '小驰宝宝'
      state.sex = 1
      state.birth = null
    }
  },
  actions: {
    setAvatar ({ commit, state, dispatch }, avatar) {
      if (!avatar) return
      dispatch('userSettingUpdate', {avatar})
    },
    setName ({ commit, state, dispatch }, name) {
      if (!name) return
      dispatch('userSettingUpdate', {name})
    },
    setSex ({ commit, state, dispatch }, sex) {
      if (sex === undefined || sex === null) return
      dispatch('userSettingUpdate', {sex})
    },
    setBirth ({ commit, state, dispatch }, birth) {
      if (!birth) return
      dispatch('userSettingUpdate', {birth})
    },
    // 统一设置
    commonSetting ({ commit, state, dispatch }, setting) {
      if (setting.avatar) commit('SET_AVATAR', setting.avatar)
      if (setting.name) commit('SET_NAME', setting.name)
      if (setting.sex !== undefined || setting.sex !== null) commit('SET_SEX', setting.sex)
      if (setting.birth) commit('SET_BIRTH', setting.birth)
    },
    // 获取用户数据
    userSettingGet ({ commit, state, dispatch }) {
      userSettingGet().then(response => {
        if (!response.data) return
        dispatch('commonSetting', response.data)
      })
    },
    // 保存用户数据
    userSettingUpdate ({ commit, state, dispatch }, newSetting) {
      if (!newSetting) return
      let oldSetting = {
        avatar: state.avatar,
        name: state.name,
        sex: state.sex,
        birth: state.birth
      }
      let postSettinng = _.assign(oldSetting, newSetting)
      userSettingUpdate(postSettinng).then(response => {
        if (response.data.errcode === 0) {
          dispatch('commonSetting', postSettinng)
        } else {
          EventMethods.tip('设置失败,请重试！')
        }
      })
    },
    // 清空用户数据
    userSettingClean ({ commit, state, dispatch }) {
      userSettingClean().then(response => {
        if (response.data.errcode === 0) {
          commit('USER_SETTING_CLEAN')
        }
      })
    }
  }
}
