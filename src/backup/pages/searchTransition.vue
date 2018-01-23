<template>
  <div class="pages searchTransition">
    <div class="header">
      <TransitionSeacrhBar></TransitionSeacrhBar>
    </div>

    <div class="content">
      <TransitionFilterBar title="历史搜索" :titleIcon="keywordIcon" :sorts="keywordList" :sort="keyword" @itemClick="SetKeyword" @iconClick="ClearKeywordList" v-show="hasKeywordList"></TransitionFilterBar>
      <TransitionFilterBar title="热门搜索" :sorts="hotwordList" :sort="keyword" @itemClick="SetKeyword" v-show="hasHotwordList"></TransitionFilterBar>
    </div>

  </div>
</template>
<script>
  import TransitionSeacrhBar from '../components/search/TransitionSeacrhBar/'
  import TransitionFilterBar from '../components/search/TransitionFilterBar/'
  import TracksAlbum from '../components/albums/TracksAlbum/'
  import ItemAlbum from '../components/albums/ItemAlbum/'
  import {mapState, mapActions} from 'vuex'
  import {setTitle} from '../utils/index'
  export default {
    data: function () {
      return {
        scroller: null // 滚动加载dom
      }
    },
    computed: {
      ...mapState({
        WeixinReady: state => state.mqtt.WeixinReady,
        keywordList: state => state.search.keywordList,
        hotwordList: state => state.search.hotwordList,
        loading: state => state.search.loading,
        page: state => state.search.page,
        count: state => state.search.count,
        totalPage: state => state.search.totalPage,
        searchState: state => state.search.searchState,
        keyword: state => state.search.keyword
      }),
      isWeixinReady () {
        if (this.WeixinReady) {
          this.getKeywordList()
          this.getHotwordList()
          return
        }
      },
      hasHotwordList () {
        return this.hotwordList && this.hotwordList.length
      },
      hasKeywordList () {
        return this.keywordList && this.keywordList.length
      },
      keywordIcon () {
        return this.hasKeywordList ? 'static/images/uc-delete@3x.png' : ''
      }
    },
    watch: {
      isWeixinReady (isReady) {}
    },
    methods: {
      ...mapActions('audio', [
        'clearInfo',
        'pauseAudio'
      ]),
      ...mapActions('search', [
        'getKeywordList',
        'getHotwordList',
        'setKeyword',
        'cleanKeywordList'
      ]),
      // 跳转
      to (router) {
        if (!router) return
        this.$router.push(router)
      },
      // 设置关键词
      SetKeyword (keyword) {
        if (!keyword) return
        this.setKeyword(keyword)
        this.to({path: '/search'})
      },
      // 清空搜索历史记录
      ClearKeywordList () {
        this.cleanKeywordList()
      }
    },
    created () {
    },
    beforeMount () {
      setTitle('驰小宝-搜索')
    },
    mounted: function () {
      this.scroller = window
      console.log(TransitionSeacrhBar)
      console.log(TransitionFilterBar)
      console.log(TracksAlbum)
      console.log(ItemAlbum)
    },
    beforeRouteLeave (to, from, next) {
      // 导航离开该组件的对应路由时调用 都会触发停止“试听”
      // 可以访问组件实例 `this`
      this.pauseAudio()
      this.clearInfo()
      next()
    }
  }

</script>

<style scoped lang="scss">
.searchTransition{
  padding: 0 0.5rem;

  .content{
    margin-top: 5rem;
  }


}

</style>
