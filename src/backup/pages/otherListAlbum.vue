<template>
  <div class="pages listAlbum">

    <div class="listTitle" ref="banner">
      大家都在听
    </div>

    <div v-show="albumData.length" :class="['demo-infinite-container',{empty}]" ref="container">
      <scroller lock-x scrollbar-y use-pullup :pullup-config="pullupConfig" ref="scroller" :height="windowHeight" @on-pullup-loading="calList" v-model="loadingStatus">
        <div class="box2" ref="box">
           <ItemAlbum :albums="albumData" @clickAlbum="toDetailAlbum"></ItemAlbum>
        </div>
      </scroller>
    </div>

    <div class="loading" v-if="loading && albumData.length === 0">
      <Loading :show="loading" loadingText="加载中..."></Loading>
    </div>

  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import {albumsList} from '../api/album'
  import {setTitle} from '../utils/index'
  import ItemAlbum from '../components/albums/ItemAlbum/'
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
        albumData: [],
        loadDisabled: false,
        loading: false,
        page: 1,
        count: 20,
        totalPage: null
      }
    },
    computed: {
      ...mapState({
        clientOnline: state => state.mqtt.clientOnline,
        WeixinReady: state => state.mqtt.WeixinReady,
        portraitScreen: state => state.mqtt.portraitScreen,
        voiceRecored: state => state.mqtt.voiceRecored
      }),
      isWeixinReady () {
        if (!this.isFirstLoad) return
        if (this.WeixinReady && this.page === 1) {
          this.isFirstLoad = false
          this.getScrollerHeight()
          this.calList()
        }
      },
      // 列表数据为空
      empty () {
        return this.albumData.length === 0 && !this.loading
      }
    },
    watch: {
      isWeixinReady (isReady) {},
      portraitScreen (isReady) {
        this.getScrollerHeight()
      }
    },
    methods: {
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
          this.windowHeight = (window.innerHeight - refs.banner.offsetHeight) + 'px'
        }, 500)
      },
      // 计算加载
      calList () {
        // 数据全部加载完成
        if (this.totalPage && (this.page > this.totalPage)) {
          this.tip('没有更多数据哦！')
          this.loadStop()
          return
        }
        if (!this.WeixinReady) return
        if (this.loading) return
        if (this.loadDisabled) {
          this.tip('没有更多数据哦！')
          this.loadStop()
          return
        }
        // 加载数据
        this.loadData()
      },
      // 加载数据
      loadData () {
        let self = this
        this.loading = true
        albumsList({category_id: 6, calc_dimension: 2, page: self.page, count: self.count, type: 'hot'}).then(response => {
          response = response.data
          // 刚刚新增了宝宝语录数据则过滤重复数据
          response.albums.map(item => {
            self.albumData.push(item)
          })
          // 回调
          self.loadDone()
          // 统计信息
          self.totalPage = response.total_page
          // 加载结束
          if (response.total_page === 0 || response.current_page === response.total_page) {
            self.loadDisabled = true
          }
          self.countPage()
        })
      },
      countPage () {
        this.page = Math.ceil(this.albumData.length / this.count) + 1
      },
      loadDone () {
        let box = this.$refs.box
        let scroller = this.$refs.scroller
        let boxOriginHeight = box.offsetHeight // 渲染前的容器高度
        this.loading = false
        this.$nextTick(() => {
          // box容器滚动到指定位置
          let height = this.page === 1 ? 0 : (boxOriginHeight > 100 ? boxOriginHeight - 100 : 0)
          scroller.reset({top: height})
          this.loadStop()
        })
      },
      loadStop () {
        setTimeout(() => {
          this.$refs.scroller.donePullup()
          this.loadingStatus.pulldownStatus = 'default'
        }, 100)
      }
    },
    beforeMount () {
      setTitle('小驰宝宝')
    },
    mounted: function () {
      console.log(Loading)
      console.log(ItemAlbum)
    }
  }

</script>

<style lang='scss' scoped>
  .listAlbum{
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
    .listTitle {
      font-size:1.5rem;
      height:6rem;
      line-height:6rem;
      margin:0 0 .5rem 0;
      text-align:center;
      background: #9ff;
      color: #fff;
    }
    .subTitle{
      padding:0 0 0 .8rem;
    }    

  }

</style>
