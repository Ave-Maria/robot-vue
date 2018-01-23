export default {
  namespaced: true,
  state: {
    playState: -1, // 播放状态 0=>播放 1=>暂停 -1=>重置
    src: null, // 当前单曲src
    nativeAudio: null, // h5音频播放器
    playingTracksId: null, // 正在播放的单曲ID
    currentTracksId: null, // 正在操作的单曲ID（切换下拉事件）
    currentTime: 0, // 当前播放进度时间
    interval: null // 当前播放进度时间——循环定时器
  },
  mutations: {
    AUDIO_PLAY (state) {
      state.playState = 0
    },
    AUDIO_PAUSE (state) {
      state.playState = 1
    },
    AUDIO_RESET_PLAYSTATE (state) {
      state.playState = -1
    },
    SET_AUDIO_INFO (state, data) {
      state.src = data.play_url_32 || data.play_url_64
      state.playState = 0
      state.playingTracksId = data.id
    },
    UPDATE_AUDIO (state, nativeAudio) {
      state.nativeAudio = nativeAudio
    },
    UPDATE_CURRENT_TRACKS_ID (state, currentTracksId) {
      state.currentTracksId = currentTracksId
    },
    UPDATE_PLAYING_TRACKS_ID (state, playingTracksId) {
      state.playingTracksId = playingTracksId
    },
    SET_CURRENT_TIME (state, currentTime) {
      state.currentTime = currentTime
    },
    SET_INTERVAL (state, interval) {
      state.interval = interval
    },
    CLEAR_INTERVAL (state) {
      state.interval = null
    },
    CLEAR_INFO (state) {
      clearInterval(state.interval)
      state.playState = -1
      state.src = null
      state.playingTracksId = null
      state.currentTracksId = null
      state.currentTime = 0
      state.interval = null
    }
  },
  actions: {
    playPauseAudio ({ commit, state, dispatch }, audioInfo) {
      switch (state.playState) { // 当前播放状态 0=>播放; 1=>暂停; -1=>重置;
        case -1:
          dispatch('setAudioInfo', audioInfo)
          dispatch('playListener')
          dispatch('playAudio')
          break
        case 0:
          dispatch('ClearInterval')
          if (state.src === audioInfo.play_url_32) {
            dispatch('pauseAudio')
          } else {
            dispatch('setAudioInfo', audioInfo)
            dispatch('playAudio')
          }
          break
        case 1:
          if (state.src === audioInfo.play_url_32) {
            dispatch('playAudio')
          } else {
            dispatch('setAudioInfo', audioInfo)
            dispatch('setCurrentTime', 0)
            dispatch('changeAudioCurrTime', 0)
            dispatch('playAudio')
          }
          break
      }
    },
    showPlayPause ({commit, state}, currentTracksId) {
      if (!currentTracksId) {
        commit('UPDATE_CURRENT_TRACKS_ID', null)
        return
      }
      if (!state.currentTracksId) {
        commit('UPDATE_CURRENT_TRACKS_ID', currentTracksId)
        return
      }
      state.currentTracksId === currentTracksId ? commit('UPDATE_CURRENT_TRACKS_ID', null) : commit('UPDATE_CURRENT_TRACKS_ID', currentTracksId)
    },
    setAudioInfo ({ commit }, data) {
      commit('SET_AUDIO_INFO', data)
    },
    playAudio ({ commit, state }) {
      setTimeout(() => {
        state.nativeAudio.play()
        commit('AUDIO_PLAY')
      }, 100)
    },
    pauseAudio ({ commit, state }) {
      state.nativeAudio.pause()
      commit('AUDIO_PAUSE')
    },
    updateAudio ({ commit }, nativeAudio) {
      commit('UPDATE_AUDIO', nativeAudio)
    },
    replayAudio ({ commit, dispatch }) {
      dispatch('changeAudioCurrTime', 0)
      dispatch('playAudio')
    },
    stopAudio ({ commit, dispatch }) {
      dispatch('changeAudioCurrTime', 0)
      dispatch('pauseAudio')
    },
    changeAudioCurrTime ({ commit, dispatch, state }, seconds) {
      state.nativeAudio.currentTime = seconds
    },
    resetPlayState ({ commit }) {
      commit('AUDIO_RESET_PLAYSTATE')
    },
    // 设置当前播放进度时间
    playListener ({commit, state, dispatch}) {
      // state.nativeAudio.addEventListener('loadedmetadata', () => {
      //   console.log('playListener loadedmetadata')
      // })
      state.nativeAudio.addEventListener('play', () => {
        dispatch('SetInterval')
      })
    },
    // 设置当前播放进度
    setCurrentTime ({commit, state, dispatch}, currentTime) {
      commit('SET_CURRENT_TIME', currentTime)
      // dispatch('changeAudioCurrTime', currentTime)
    },
    // 设置循环定时器
    SetInterval ({commit, state, dispatch}) {
      console.log('Set Interval')
      dispatch('ClearInterval')
      let interval = setInterval(() => {
        dispatch('setCurrentTime', state.nativeAudio.currentTime)
        if (state.nativeAudio.ended) {
          dispatch('setCurrentTime', 0)
          dispatch('pauseAudio')
          dispatch('ClearInterval')
        }
        // console.log('setInterval ', interval, state.nativeAudio.currentTime)
      }, 1000)
      commit('SET_INTERVAL', interval)
      dispatch('setCurrentTime', state.nativeAudio.currentTime)
    },
    // 清除循环定时器
    ClearInterval ({commit, state, dispatch}) {
      clearInterval(state.interval)
      commit('CLEAR_INTERVAL')
    },
    // 通过URL生成播放歌曲
    playPauseAudioCreate ({commit, state, dispatch}, url) {
      if (!url) return
      let track = {
        play_url_32: url,
        id: new Date().getTime()
      }
      dispatch('playPauseAudio', track)
    },
    // 通过xmly单曲生成播放歌曲
    togglePlayPauseAudio ({commit, state, dispatch}, track) {
      if (!track || (!track.play_url_32 && !track.play_url_64)) return
      dispatch('playPauseAudio', track)
    },
    // 清除播放歌曲ID
    clearInfo ({commit, state, dispatch}) {
      commit('CLEAR_INFO')
    }
  }
}
