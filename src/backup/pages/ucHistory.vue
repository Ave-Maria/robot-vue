<template>
  <div class="pages ucCollection">
    <div class="banner" ref="banner">
      <BannerSlider :banners="banners" @onAutoplay='onAutoplay()'></BannerSlider>
    </div>
    <div ref="action">
      <div class="action normal" v-if="historyListData && historyListData.length" >
        <div class="left text-gray"><span>最近播放的50首</span></div>
        <div class="middle"></div>
        <div class="right text-violet" @click="cleanHistory()">清空</div>
      </div>
    </div>

    <!--<div :class="['container',{empty: historyListData.length === 0}]">
        <div class="list trackList " v-if="historyListData.length">
          <template v-for="(item, index) in historyListData">
            <CollectionTrack :tracks="item" v-model="currentTracksId"  @delCollection="delHistory(item)">
            </CollectionTrack>
          </template>

          <template v-if="loading">
            <Loading :show="loading" loadingText="加载中..." style="margin-top:3rem;"></Loading>
          </template>
        </div>

        <template v-if="!loading">
          <div class="no-data" v-if="historyListData.length === 0">
            <div>
              <img v-lazy="'static/images/noData.png'">
            </div>
            <div>
              暂无播放历史，
              <span class="text-violet"  @click="routerTo({path: '/'})">马上去听</span>        
            </div>
          </div>
        </template>
    </div>-->
    <div :class="['demo-infinite-container']" v-show="historyListData.length !== 0 && !loading" ref="container">
      <scroller v-show="historyListData.length" lock-x scrollbar-y use-pullup :pullup-config="pullupConfig" ref="scroller" :height="windowHeight" v-model="loadingStatus">
        <div class="box2" ref="box">

          <div class="list trackList " v-if="historyListData.length">
            <template v-for="(item, index) in historyListData">
              <CollectionTrack :tracks="item" v-model="currentTracksId"  @delCollection="delHistory(item)">
              </CollectionTrack>
            </template>
          </div>
        </div>
      </scroller>
    </div>

    <div class="loading">
        <template v-if="loading">
          <Loading :show="loading" loadingText="加载中..." style="margin-top:3rem;"></Loading>
        </template>

        <div class="no-data" v-if="historyListData.length === 0 && !loading">
          <div>
            <img v-lazy="'static/images/noData.png'">
          </div>
          <div>
            暂无播放历史，
            <span class="text-violet"  @click="routerTo({path: '/'})">马上去听</span>        
          </div>
        </div>
    </div>

    
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import {historyList, historyDel, historyClean, carousel} from '../api/album'
  import {parseTrack, formatTrack, setTitle} from '../utils/index'
  import BannerSlider from '../components/BannerSlider'
  import CollectionTrack from '../components/albums/CollectionTrack/'
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
        loading: false, // 加载数据状态
        banners: [], // 轮播图
        historyListData: [], // 播放历史列表
        currentTracksId: null, // 显示最近显示单曲索引
        isFirstLoad: true // 判断是否第一次加载数据
      }
    },
    computed: {
      ...mapState({
        clientOnline: state => state.mqtt.clientOnline,
        WeixinReady: state => state.mqtt.WeixinReady
      }),
      isWeixinReady () {
        if (this.WeixinReady && this.isFirstLoad) {
          this.getHistoryList()
          this.isFirstLoad = false
          return
        }
      }
    },
    watch: {
      isWeixinReady (isReady) {}
    },
    methods: {
      // 获取滚动加载高度
      getScrollerHeight () {
        let refs = this.$refs
        setTimeout(() => {
          this.windowHeight = (window.innerHeight - refs.banner.offsetHeight - refs.action.offsetHeight) + 'px'
        }, 500)
      },
      // 跳转
      routerTo (router) {
        this.$router.push(router)
      },
      // 轮播图
      getCarousel () {
        let self = this
        carousel({page: 'history'}).then(response => {
          self.banners = response.data
        })
      },
      // 获取历史列表
      getHistoryList () {
        this.loading = true
        historyList().then(response => {
          response.data.map(item => {
            item = JSON.parse(item)
            item = parseTrack(item)
            this.historyListData.push(item)
          })
          this.loadDone()
        }).catch(error => {
          console.log(error)
          this.loading = false
        })
      },
      // 删除历史单曲
      delHistory (tracks) {
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        let trackData = formatTrack(tracks)
        this.confirm('确定要删除历史歌曲？', null, (ok) => {
          if (ok) {
            historyDel(trackData).then(response => {
              if (response.data.errcode === 0) {
                this.historyListData.map((item, index) => {
                  if (item.id === trackData[0].musicId) {
                    this.historyListData.splice(index, 1)
                  }
                })
              }
            })
          }
        })
      },
      // 清空历史单曲
      cleanHistory  () {
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        let self = this
        this.confirm('确定要清空历史？', null, (ok) => {
          if (ok) {
            historyClean().then(response => {
              if (response.data.errcode === 0) {
                self.historyListData = []
                self.getScrollerHeight()
              }
            })
          }
        })
      },
      onAutoplay () {
        this.getScrollerHeight()
      },
      loadDone () {
        let scroller = this.$refs.scroller
        this.loading = false
        this.$nextTick(() => {
          scroller.reset()
          scroller.disablePullup()
        })
      }
    },
    created () {
      this.getCarousel()
    },
    beforeMount () {
      setTitle('驰小宝故事机-播放历史')
    },
    mounted: function () {
      console.log(BannerSlider)
      console.log(CollectionTrack)
      console.log(Loading)
    }
  }

</script>

<style lang='scss' scoped>
  .ucCollection{
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
      height: inherit;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    /*操作部分*/ 
    .action{
      height:2.8rem;
      line-height:2.8rem;
      display: flex;
      align-items: center;
      background:#FBFBFC;
      flex-shrink: 0;
      
      >div{
        flex:1;
      }

      .left{
        text-align: left;
        padding-left: 1rem;
      }
      .right{
        text-align: right;
        padding-right: 1rem;
      }
    }

    /*内容*/ 
    .container{
      flex:1;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      &::-webkit-scrollbar {
          display: none;
      }
      &.empty{
        flex:1;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .list{
        height: 100%;

        .no-data{
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      }
    }

  }

</style>
