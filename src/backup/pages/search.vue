<template>
  <div class="pages search">

    <div class="banner" ref="banner">
      <SearchBar></SearchBar>
    </div>

    <div ref="filter">
      <SearchFilterBar></SearchFilterBar>
    </div>

    <div class="result" ref="result" v-show="totalCount">
      {{searchResult}}
    </div>

    <div v-show="tracksData.length || albumsData.length" :class="['demo-infinite-container',{empty}]" ref="container">
      <scroller lock-x scrollbar-y use-pullup :pullup-config="pullupConfig" ref="scroller" :height="windowHeight" @on-pullup-loading="calList" v-model="loadingStatus">
        <div class="box2" ref="box">
            
          <div class="tracks" v-if="tracksData.length > 0" v-for="(item, index) in tracksData" :key="index">
            <TracksAlbum :tracks="item"></TracksAlbum>
          </div>

          <div class="album"  v-if="albumsData.length > 0">
            <ItemAlbum :albums="albumsData" @clickAlbum="toDetailAlbum"></ItemAlbum>
          </div>

        </div>
      </scroller>
    </div>

    <div class="loading" v-if="loading && (!tracksData.length && !albumsData.length)">
      <Loading :show="loading" loadingText="加载中..."></Loading>
    </div>

    <div class="no-data" v-show="!tracksData.length && !albumsData.length & !loading">
      <div class="icon">
        <img v-lazy="'static/images/emptybox@2x.png'"/>
      </div>
      <div class="text" v-show="searchState === 'beforeSearch'">请输入搜索关键字</div>
      <!--<div class="text" v-show="searchState === 'searching'">正在搜索中...</div>-->
      <div class="text" v-show="searchState === 'searchNoData'">没有找到匹配的内容</div>
    </div>

  </div>
</template>
<script>
  import SearchBar from '../components/search/SearchBar'
  import SearchFilterBar from '../components/search/SearchFilterBar/'
  import TracksAlbum from '../components/albums/TracksAlbum/'
  import ItemAlbum from '../components/albums/ItemAlbum/'
  import {mapActions, mapState} from 'vuex'
  import {setTitle} from '../utils/index'
  import Loading from '../components/Loading/'
  import {Scroller} from 'vux'
  export default {
    components: {
      Scroller
    },
    data: function () {
      return {
        windowHeight: '', // scroller 高度
        loadingStatus: {
          pullupStatus: 'default'
        },
        pullupConfig: {
          content: '上拉刷新',
          downContent: '上拉刷新',
          upContent: '释放刷新',
          loadingContent: '加载中'
        },
        isFirstLoad: true, // 判断是否第一次加载数据
        scroller: null,
        trackListData: [] // 单曲列表全部数据
      }
    },
    computed: {
      ...mapState({
        tracksData: state => state.search.tracksData,
        albumsData: state => state.search.albumsData,
        loading: state => state.search.loading,
        page: state => state.search.page,
        count: state => state.search.count,
        totalPage: state => state.search.totalPage,
        searchState: state => state.search.searchState,
        keyword: state => state.search.keyword,
        kind: state => state.search.kind,
        totalCount: state => state.search.totalCount,
        WeixinReady: state => state.mqtt.WeixinReady,
        portraitScreen: state => state.mqtt.portraitScreen
      }),
      searchResult () {
        return '搜索结果:  ' + this.totalCount + (this.kind === 'tracks' ? '首歌曲' : '张专辑')
      },
      isWeixinReady () {
        if (!this.isFirstLoad) return
        if (this.WeixinReady && this.page === 1) {
          this.isFirstLoad = false
          this.getScrollerHeight()
          if (this.keyword) this.search()
        }
      },
      // 列表数据为空
      empty () {
        return (this.tracksData.length === 0 || this.albumsData.length === 0) && !this.loading
      }
    },
    watch: {
      isWeixinReady (isReady) {},
      portraitScreen (isReady) {
        this.getScrollerHeight()
      },
      searchState (state) {
        switch (state) {
          // 搜索有数据
          case 'searchWithData':
            this.loadDone()
            break
          // 搜索无数据
          case 'searchNoData':
            this.loadDone()
            break
          default:
            break
        }
      }
    },
    methods: {
      ...mapActions('audio', [
        'clearInfo',
        'pauseAudio'
      ]),
      ...mapActions('search', [
        'search'
      ]),
      // 跳转专辑详情页
      toDetailAlbum (album) {
        this.$router.push({
          path: '/detailAlbum',
          query: {
            ids: album.id
          }
        })
      },
      // 获取滚动加载高度
      getScrollerHeight () {
        let refs = this.$refs
        setTimeout(() => {
          this.windowHeight = (window.innerHeight - refs.banner.offsetHeight - refs.result.offsetHeight) + 'px'
        }, 500)
      },
      // 计算加载
      calList () {
        // 数据全部加载完成
        if (this.totalPage && (this.page > this.totalPage)) {
          this.loadStop()
          return
        }
        if (this.loading) return
        // 加载数据
        this.search('appendData')
      },
      loadDone () {
        let box = this.$refs.box
        let scroller = this.$refs.scroller
        let boxOriginHeight = box.offsetHeight // 渲染前的容器高度
        this.$nextTick(() => {
          // box容器滚动到指定位置
          let height = this.page === 1 ? 0 : (boxOriginHeight > 100 ? boxOriginHeight - 100 : 0)
          scroller.reset({top: height})
          this.loadStop()
        })
      },
      loadStop () {
        setTimeout(() => {
          let scroller = this.$refs.scroller
          scroller.donePullup()
          this.loadingStatus.pullupStatus = 'default'
        }, 100)
      }
    },
    beforeMount () {
      setTitle('驰小宝-搜索')
    },
    mounted: function () {
      console.log(SearchBar)
      console.log(SearchFilterBar)
      console.log(TracksAlbum)
      console.log(ItemAlbum)
      console.log(Loading)
    }
  }

</script>

<style lang='scss' scoped>
  .search{
    &.active{
      z-index: 2;
      padding-bottom: 0rem;
    }
    position: fixed;
    left: 0;
    bottom:0;      
    height:100%;
    width:100%;
    text-align: center;
    display:flex;
    flex-direction:column;
    background: #fff;
    
    /*公共*/
    img{
      width:auto;
      max-width:100%;
    }
    .text-violet{
      color:#AF7BFF;
    }
    .text-gray{
      color:#8A848F;
    }

    .loading{
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: center;
    }

    /*搜索结果*/ 
    .result{
      padding-top:.5rem;
      padding-left:.5rem;
      color:#D3CEDA;
      text-align:left;
    }

    .demo-infinite-container{
      height: 100%;
      overflow: auto;
      flex: 1;
      &::-webkit-scrollbar {
          display: none;
      }
      -webkit-overflow-scrolling: touch;
      -webkit-overflow-scrolling: touch;
      &.empty{
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      
    }
    .no-data{
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .icon{
        width:50%;
        margin:0rem auto 1rem;

        img{
          max-width:100%;
        }
      }
      .text{
        color:#A79EB6;
        font-size:1rem;
      }
    }
  }

</style>
