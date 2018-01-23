import {searchTracks, searchAlbums, searchHistoryList, searchHotList, searchHistoryClean} from '../../api/album'
import {searchSorts, searchAges} from '../../utils/const'
export default {
  namespaced: true,
  state: {
    kind: 'tracks', // 专辑albums；单曲tracks默认；
    keyword: '', // 搜索关键词
    keywordList: [], // 搜索历史记录
    hotwordList: [], // 热门历史记录
    sorts: searchSorts, // 搜索分类
    ages: searchAges, // 搜索年龄
    tracksData: [], // 单曲搜索数据
    albumsData: [], // 专辑搜索数据
    loading: false, // 是否滚动加载
    page: 1, //  默认滚动加载页码
    count: 20, //  默认滚动加载页数
    totalPage: null, // 总页数
    searchState: 'beforeSearch', // 搜索状态=> 'beforeSearch':搜索前,'searching':'正在搜索中','searchNoData':'搜索没有数据'
    totalCount: 0 // 搜索结果总数
  },
  mutations: {
    SET_KEYWORD (state, keyword) {
      state.keyword = keyword
    },
    CLEAN_KEYWORD (state) {
      state.keyword = ''
    },
    SET_KEYWORD_LIST (state, keywordList = []) {
      if (!keywordList) {
        return
      }
      state.keywordList = keywordList
    },
    ADD_KEYWORD_LIST (state, keyword) {
      if (!keyword || state.keywordList.includes(keyword)) {
        return
      }
      let keywordList = state.keywordList
      keywordList.unshift(keyword)
      keywordList = keywordList.slice(0, 8)
    },
    CLEAN_KEYWORD_LIST (state) {
      state.keywordList = []
    },
    SET_HOTWORD_LIST (state, hotwordList = []) {
      if (!hotwordList) {
        return
      }
      state.hotwordList = hotwordList
    },
    TOGGLE_SORT_CHECKED (state, sort) {
      let oldSort = state.sorts[sort.index]
      oldSort.checked = !oldSort.checked
    },
    CLEAR_SORTS (state, sort) {
      state.sorts.map(sort => {
        sort.checked = false
      })
    },
    CLEAR_SORT (state, sort) {
      let oldSort = state.sorts[sort.index]
      oldSort.checked = !oldSort.checked
    },
    TOGGLE_AGE_CHECKED (state, age) {
      let oldage = state.ages[age.index]
      oldage.checked = !oldage.checked
    },
    CLEAR_AGES (state) {
      state.ages.map(age => {
        age.checked = false
      })
    },
    CLEAR_AGE (state, age) {
      let oldage = state.ages[age.index]
      oldage.checked = !oldage.checked
    },
    SELECT_KIND (state, kind) {
      state.kind = kind
    },
    // 附加搜索单曲数据
    ADD_TRACKS_DATA (state, data) {
      if (!data || data.total_count === 0) {
        return
      }
      data.tracks.map(item => {
        state.tracksData.push(item)
      })
      state.totalPage = data.total_page
      state.totalCount = data.total_count || 0
      // state.page++
      state.page = Math.ceil(state.tracksData.length / state.count) + 1
      state.loading = false
    },
    // 清空搜索专辑数据
    CLEAN_TRACKS_DATA (state) {
      state.tracksData = []
    },
    // 附加搜索单曲数据
    ADD_ALBUMS_DATA (state, data) {
      if (!data || data.total_count === 0) {
        return
      }
      data.albums.map(item => {
        state.albumsData.push(item)
      })
      state.totalPage = data.total_page
      state.totalCount = data.total_count || 0
      state.page++
      state.loading = false
    },
    // 清空搜索专辑数据
    CLEAN_ALBUMS_DATA (state) {
      state.albumsData = []
    },
    // 切换加载提示 默认false
    TOGGLE_LOADING (state, isLoading = false) {
      state.loading = isLoading
    },
    // 重置
    RESET_BREACK_PAGE (state) {
      state.page = 1 //  默认滚动加载页码
      state.totalPage = null // 总页数
    },
    // 设置搜索状态
    SET_SEARCH_STATE (state, searchState) {
      state.searchState = searchState
    },
    // 设置加载状态提示
    SET_LOADING (state, loading) {
      state.loading = loading
    },
    // 搜索单曲
    SEARCH_TRACKS (state, loading) {
      state.loading = loading
    },
    // 搜索专辑
    SEARCH_ALBUMS (state, loading) {
      state.loading = loading
    },
    // 设置搜索内容总数
    SET_TOTAL_COUNT (state, totalCount = 0) {
      state.totalCount = totalCount
    }
  },
  actions: {
    // 设置搜索内容 或 清除
    setKeyword ({commit}, keyword) {
      keyword ? commit('SET_KEYWORD', keyword) : commit('CLEAN_KEYWORD')
    },
    // 设置搜索历史记录 或 清除
    addKeywordList ({commit}, keyword) {
      if (keyword) {
        commit('SET_KEYWORD', keyword)
        commit('ADD_KEYWORD_LIST', keyword)
      }
      // : commit('CLEAN_KEYWORD_LIST')
    },
    // 切换分类选中状态
    toggleSortChecked ({commit}, sort) {
      commit('TOGGLE_SORT_CHECKED', sort)
    },
    // 清除分类
    clearSorts ({commit}) {
      commit('CLEAR_SORTS')
    },
    // 清除当前选中分类
    clearSort ({commit, dispatch}, sort) {
      commit('CLEAR_SORT', sort)
      dispatch('search')
    },
    // 切换年龄选中状态
    toggleAgeChecked ({commit}, age) {
      commit('TOGGLE_AGE_CHECKED', age)
    },
    // 清除年龄
    clearAges ({commit, dispatch}) {
      commit('CLEAR_AGES')
      // dispatch('search')
    },
    // 清除当前选中年龄
    clearAge ({commit, dispatch}, age) {
      commit('CLEAR_AGE', age)
      dispatch('search')
    },
    // 设置专辑或单曲搜索选项
    selectKind ({commit, dispatch}, kind) {
      commit('SELECT_KIND', kind)
      dispatch('search')
    },
    // 搜索
    search ({commit, state, dispatch}, type) {
      console.log('action -> search')
      // 滚动加载数据
      if (type === 'appendData') {
      // 默认搜索并清空数据
      } else {
        commit('CLEAN_TRACKS_DATA')
        commit('CLEAN_ALBUMS_DATA')
        commit('RESET_BREACK_PAGE')
      }
      if (state.totalPage && (state.page > state.totalPage)) {
        return
      }
      // 正在加载..
      if (state.loading) {
        return
      }
      // 即将发送搜索数据
      let postData = {
        category_id: 6,
        q: state.keyword,
        page: state.page,
        count: state.count
      }
      // 关键词 拼接 分类
      state.sorts.filter(item => {
        if (item.checked) {
          postData.q += ' ' + item.keyword
        }
      })
      // 关键词 拼接 年龄
      state.ages.filter(item => {
        if (item.checked) {
          postData.q += ' ' + item.title
        }
      })
      // 搜索单曲
      commit('SET_LOADING', true)
      commit('SET_SEARCH_STATE', 'searching')
      dispatch('addKeywordList', state.keyword)
      dispatch('setTotalCount', 0) // 统计归零
      if (state.kind === 'tracks') {
        searchTracks(postData).then(response => {
          commit('ADD_TRACKS_DATA', response.data)
          commit('SET_LOADING', false)
          let searchState = (state.tracksData.length === 0 && response.data.tracks.length === 0) ? 'searchNoData' : 'searchWithData'
          commit('SET_SEARCH_STATE', searchState)
        }).catch(error => {
          console.log(error)
          commit('SET_LOADING', false)
          commit('SET_SEARCH_STATE', 'searchNoData')
        })
      // 搜索专辑
      } else if (state.kind === 'albums') {
        searchAlbums(postData).then(response => {
          commit('ADD_ALBUMS_DATA', response.data)
          commit('SET_LOADING', false)
          let searchState = (state.albumsData.length === 0 && response.data.albums.length === 0) ? 'searchNoData' : 'searchWithData'
          commit('SET_SEARCH_STATE', searchState)
        }).catch(error => {
          console.log(error)
          commit('SET_LOADING', false)
          commit('SET_SEARCH_STATE', 'searchNoData')
        })
      }
    },
    // 搜索
    searchSort ({commit, state, dispatch}, sort) {
      // 清除关键词
      commit('CLEAN_KEYWORD')
      dispatch('clearSorts')
      dispatch('clearAges')
      if (!sort.item.checked) {
        commit('TOGGLE_SORT_CHECKED', sort)
        dispatch('search')
      }
    },
    // 设置搜索内容总数
    setTotalCount ({commit, state, dispatch}, count) {
      commit('SET_TOTAL_COUNT', count)
    },
    // 获取搜索历史记录
    getKeywordList ({commit, dispatch}) {
      searchHistoryList().then(response => {
        response = response.data
        if (response.errcode === 0) {
          commit('SET_KEYWORD_LIST', response.data)
        }
      })
    },
    // 清空搜索历史记录
    cleanKeywordList ({commit, dispatch}) {
      searchHistoryClean().then(response => {
        response = response.data
        if (response.errcode === 0) {
          commit('SET_KEYWORD_LIST')
        }
      })
    },
    // 获取热门记录
    getHotwordList ({commit, dispatch}) {
      searchHotList().then(response => {
        response = response.data
        if (response.errcode === 0) {
          commit('SET_HOTWORD_LIST', response.data)
        }
      })
    }
  }
}
