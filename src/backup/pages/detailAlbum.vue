<template>
  <div class="pages detailAlbum">

    <div class="demo-grid" ref="banner">
      <grid-row gutter >
        <grid-col width="35" tablet="20" desktop="10" class="icon">
          <img :src="albumInfoData.cover_url_middle" style="max-width:100%;">
        </grid-col>
        <grid-col width="50"  tablet="70" desktop="80"  class="album-info">
          <p class="title">{{albumInfoData.album_title}}</p>
          <!--<p class="des">儿童故事 | 3-6岁</p>
          <div class="xingji_group">
            <img src="static/images/StarFill@2x.png">
            <img src="static/images/StarFill@2x.png">
            <img src="static/images/StarFill@2x.png">
            <img src="static/images/StarFill@2x.png">
            <span>7.0</span>
          </div>-->
          <p class="des" v-if="albumInfoData.play_count">播放次数：{{albumInfoData.play_count | formatCount}}</p>
        </grid-col>

        <grid-col width="15"  tablet="10" desktop="10"  class="album-info">
          <div class="like" @click='toggleCollectionAlbum()' v-if="albumInfoData.album_title">
            <img :src='collectionAlbumIcon' style='max-width:100%'>
          </div>
        </grid-col>
      </grid-row>

      <p class="album-intro">
        {{albumInfoData.album_intro}}
      </p>
    </div>
    <div ref="title">
    <grid-row gutter class="album-list-head" align="center">
        <grid-col width="25" tablet="15" desktop="5">
          <span class="count">列表 ({{totalCount}})</span>
        </grid-col>
        <grid-col width="25" tablet="15" desktop="5">
          <span class="add-all" @click="bfAddAllTracks" v-if="tracksData.length && !albumInfoData.isplay">添加全部</span>
          <span class="add-all" @click="delAllTracks" v-if="tracksData.length && albumInfoData.isplay">删除全部</span>
        </grid-col>
    </grid-row>
    </div>
    <!--内容为空-->
    <div class="no-data" v-if="isNoData">
        内容已被删除
    </div >

    <!--网络超时-->
    <div class="timeout" v-if="isTimeout">
        网络有问题，请<span @click="reloadData">重新加载</span>
    </div >

    <div v-show="tracksData.length" :class="['demo-infinite-container',{empty}]" ref="container">
      <scroller lock-x scrollbar-y use-pullup :pullup-config="pullupConfig" ref="scroller" :height="windowHeight" @on-pullup-loading="calList" v-model="loadingStatus">
        <div class="box2" ref="box">
          <div v-for="(item, index) in tracksData" :key="index">
            <TracksAlbum :tracks="item"></TracksAlbum>
          </div>
        </div>
      </scroller>
    </div>

    <div class="loading" v-if="loading && tracksData.length === 0">
      <Loading :show="loading" loadingText="加载中..."></Loading>
    </div>

  </div>
</template>
<script>
  import {albumsBatch, albumsBrowse, playlistCreateAlbum, playlistDelAlbum, collectionCreateAlbum, collectionDelAlbum} from '../api/album'
  import {mapActions, mapState} from 'vuex'
  import {setTitle} from '../utils/index'
  import {coverOption, playListLength} from '../utils/const'
  import TracksAlbum from '../components/albums/TracksAlbum/'
  import Row from '../components/grid/Row/'
  import Col from '../components/grid/Col/'
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
        albumInfoData: {}, // 专辑信息
        tracksData: [], // 专辑单曲
        loadDisabled: false,
        loading: false,
        page: 1,
        count: 20,
        totalPage: null,
        totalCount: 0,
        isNoData: false,
        isTimeout: false,
        TimeoutNo: 0,
        promptOption: {
          inputType: 'checkbox',
          inputText: '不再提醒'
        }
      }
    },
    computed: {
      ...mapState({
        clientOnline: state => state.mqtt.clientOnline,
        WeixinReady: state => state.mqtt.WeixinReady,
        portraitScreen: state => state.mqtt.portraitScreen,
        voiceRecored: state => state.mqtt.voiceRecored,
        clientBind: state => state.mqtt.clientBind,
        playListData: state => state.mqtt.playListData
      }),
      isWeixinReady () {
        if (!this.isFirstLoad) return
        if (this.WeixinReady && this.page === 1) {
          this.isFirstLoad = false
          this.getAlbumInfo()
          this.getScrollerHeight()
          this.calList()
          return
        }
      },
      ids () {
        return this.$route.query.ids
      },
      // 是否专辑收藏图标
      collectionAlbumIcon () {
        return this.albumInfoData.isfav ? 'static/images/albumCollectionunSelected.png' : 'static/images/albumCollectionunUnselected.png'
      },
      // 列表数据为空
      empty () {
        return this.tracksData.length === 0 && !this.loading
      }
    },
    watch: {
      isWeixinReady (isReady) {},
      portraitScreen (isReady) {
        this.getScrollerHeight()
      }
    },
    filters: {
      formatCount (value) {
        if (!value) return
        return value < 10000 ? value : (value / 10000).toFixed(1) + '万+'
      }
    },
    methods: {
      ...mapActions('audio', [
        'pauseAudio',
        'clearInfo'
      ]),
      ...mapActions('mqtt', [
        'getPlaylist'
      ]),
      // 获取滚动加载高度
      getScrollerHeight () {
        let refs = this.$refs
        setTimeout(() => {
          this.windowHeight = (window.innerHeight - refs.banner.offsetHeight - refs.title.offsetHeight) + 'px'
        }, 500)
      },
      // 内容为空
      isHaveData () {
        if (!this.albumInfoData.album_title && this.tracksData.length === 0) {
          this.isNoData = true
          this.loading = false
        }
      },
      // 重新加载数据
      reloadData () {
        this.isTimeout = false
        this.getAlbumInfo()
        this.calList()
      },
      // 网络超时
      timeout () {
        this.TimeoutNo ++
        if (this.TimeoutNo >= 2) {
          this.isTimeout = true
          this.TimeoutNo = 0
          return
        }
      },
      // 专辑详情
      getAlbumInfo () {
        let self = this
        albumsBatch({ids: self.ids}).then(response => {
          if (!response.data || !response.data.length) {
            self.isHaveData()
            return
          }
          self.albumInfoData = response.data[0]
          if (self.albumInfoData && self.albumInfoData.album_title) {
            setTitle('小驰宝宝-' + self.albumInfoData.album_title)
          }
        }).catch(error => {
          self.timeout()
          console.log(error)
        })
      },
      // 重置声音列表
      resetTracks () {
        this.page = 1
        this.totalPage = null
        this.tracksData = []
      },
      // 添加全部歌曲到播放列表
      bfAddAllTracks () {
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        if (!this.clientBind) {
          this.confirm('您还没有绑定设备哦，是否前往绑定？', null, (ok) => {
            if (ok) {
              this.$router.push({path: '/config'})
            }
          })
          return
        }
        if (!this.ids) {
          return
        }
        if (this.totalCount > playListLength) {
          this.tip('专辑列表超过' + playListLength + '首歌')
          return
        }
        let storage = window.localStorage
        // 播放列表超过n(五百）首歌曲
        if ((this.playListData.length + this.totalCount) >= playListLength && !storage.getItem(coverOption.AutoCoverPlaylist)) {
          this.prompt('您播放列表已经超过' + playListLength + '首，添加后系统将为您自动删除最早单曲', '确定添加单曲？', (param) => {
            // ok
            if (param && param.isPrompt) {
              storage.setItem(coverOption.AutoCoverPlaylist, param.input)
              this.AddAllTracks()
            }
          }, this.promptOption)
          return
        }
        this.AddAllTracks()
      },
      // 添加全部歌曲到播放列表
      AddAllTracks () {
        playlistCreateAlbum({album_id: this.ids}).then(response => {
          if (response.data.errcode === 0) {
            this.tip('已全部添加至播放列表')
            this.albumInfoData.isplay = true
            this.resetTracks()
            this.calList()
            this.getPlaylist()
          }
        })
      },
      // 从播放列表删除全部歌曲
      delAllTracks () {
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        if (!this.clientBind) {
          this.confirm('您还没有绑定设备哦，是否前往绑定？', null, (ok) => {
            if (ok) {
              this.$router.push({path: '/config'})
            }
          })
          return
        }
        if (!this.ids) {
          return
        }
        this.confirm('确定删除全部曲目吗？', null, (ok) => {
          if (ok) {
            playlistDelAlbum({album_id: this.ids}).then(response => {
              if (response.data.errcode === 0) {
                this.tip('已全部删除')
                this.albumInfoData.isplay = false
                this.resetTracks()
                this.calList()
                this.getPlaylist()
              }
            })
          }
        })
      },
      // 切换收藏专辑
      toggleCollectionAlbum () {
        if (!this.ids) {
          return
        }
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        if (!this.clientBind) {
          this.confirm('您还没有绑定设备哦，是否前往绑定？', null, (ok) => {
            if (ok) {
              this.$router.push({path: '/config'})
            }
          })
          return
        }
        // 取消收藏
        if (this.albumInfoData.isfav) {
          collectionDelAlbum([this.ids]).then(response => {
            if (response.data.errcode === 0) {
              this.albumInfoData.isfav = false
            }
          })
        // 收藏
        } else {
          collectionCreateAlbum([this.ids]).then(response => {
            if (response.data.errcode === 0) {
              this.albumInfoData.isfav = true
            }
          })
        }
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
        albumsBrowse({album_id: self.ids, page: self.page, count: self.count}).then(response => {
          response = response.data
          if (!response.tracks || response.tracks.length === 0) {
            self.isHaveData()
            return
          }
          response.tracks.map(item => {
            self.tracksData.push(item)
          })
          // 回调
          self.loadDone()
          // 统计信息
          self.totalPage = response.total_page
          self.totalCount = response.total_count || 0
          // 加载结束
          if (response.total_page === 0 || response.current_page === response.total_page) {
            self.loadDisabled = true
          }
          self.countPage()
        }).catch(error => {
          self.timeout()
          self.loading = false
          console.log(error)
        })
      },
      countPage () {
        this.page = Math.ceil(this.tracksData.length / this.count) + 1
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
    created () {
    },
    mounted: function () {
      this.scroller = window
      console.log(this.scroller)
      console.log(TracksAlbum)
      console.log(Row)
      console.log(Col)
      console.log(Loading)
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
  .album-item{
    display:flex;
    align-items: center;
  }
  .album-item .album-icon{
    flex:1;
    padding:.5rem;
  }
  .album-item .album-info{
    flex:6;
    overflow: hidden;
  }
  .album-item .album-info .track_title{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .album-item .album-add{
    flex:1
  }
  .album-subItem{
    display:flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: #FBFBFC;
  }
  .album-subItem > div{
    width:2.3rem;
  }
  
  .demo-grid{
     padding:1rem 1.2rem .8rem;
     background-image: linear-gradient(-45deg, #8F46FF 0%, #B585FF 100%);
  }
  .demo-grid div[class*="grid-col-"] {   
    margin-top:1.5rem; 
    text-align: left;
    color: #000;    
  }
  .icon img{
    border-radius: 0.5rem;
  }
  .album-info{
    text-align:left;    
    display: inline-block;
    vertical-align: top;
  }
  .album-info p{
    margin-top:0;
    margin-bottom:0;
  }
  .album-info .title{
    font-size: 1.1rem;
    color: #FFFFFF;
    letter-spacing: -0.039rem;
    line-height: 1.4rem;
    margin: 0.1rem 0 0.4rem;
  }
  .album-info .des {
    opacity: 0.6;
    font-size: .8rem;
    color: #FFFFFF;
  }
  .album-info .like {
    margin-top: -.4rem;
  }
  .xingji_group {
    height: 1.8rem;
    line-height: 1.8rem;
    display: flex;
    align-items: center;
  }

  .xingji_group img {
      width: 1.3rem;
      height: 1.3rem;
  }
  .xingji_group span {
    height: 1.8rem;
    line-height: 1.8rem;
    color: rgba(255,255,255,.6);
    font-size: .9rem;
    float:right;
    display:block;
    margin-top:0.2rem;
    margin-left:0.4rem;
  }
  .album-intro {    
      font-size: .8rem;
      color: rgba(255,255,255,.8);
      letter-spacing: -0.028rem;
      height: 3.1rem;
      line-height: 1.5rem;
      max-lines: 2;
      -webkit-line-clamp: 2;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: .5rem 0 0 0;
      text-align: left;
  }
  .demo-infinite-container{
    /*overflow: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;*/
  }
  .album-list-head{
    line-height:2.5rem;
    background:#fbfbfc;
    color: #8A848F;

    .add-all{
      color: #B585FF;
    }
  }

  /* no-data */
  .no-data,
  .timeout{
    padding:4rem 0 0 0;
    color: #8A848F;
    text-align:center;
    font-size:1rem;
    span{
      color:#8F46FF
    }
  } 
</style>
