<template>
  <div :class="['pages','ucList',{active:isEditList}]">

    <div class="banner" ref="banner">
     <BannerSlider :banners="banners" @onAutoplay='onAutoplay()'></BannerSlider>
    </div>

    <div ref="action">
      <div class="action normal" v-show="!isEditList && listDataNum">
        <div class="left text-gray"><span>列表({{listDataNum || 0}})</span></div>
        <div class="middle"></div>
        <div class="right text-violet" @click="toggleEdit(true)" v-if="listDataNum">编辑</div>
      </div>
      <div class="action edit" v-show="isEditList && listDataNum">
        <!--<div class="left text-violet" @click="selectAll()"><span>{{selectAllText}}</span></div>
        <div class="middle text-gray">已选({{selectAllNum || 0}})</div>
        <div class="right text-violet" @click="toggleEdit(false)">完成</div>-->
        <div class="left text-gray">已选({{selectAllNum || 0}})</div>
        <div class="middle"></div>
        <div class="right text-violet" @click="toggleEdit(false)">完成</div>
      </div>
    </div>

    <div v-show="playList.totalCount" :class="['demo-infinite-container',{empty:(trackListData.length === 0 && !loading)}]" ref="container">
      <scroller v-show="trackListData.length" lock-x scrollbar-y use-pullup :pullup-config="pullupConfig" ref="scroller" :height="windowHeight" @on-pullup-loading="calList" v-model="loadingStatus">
        <div class="box2" ref="box">
          
          <div v-for="(item, index) in trackListData" :key="item.musicId">
            <ListTrack :tracks="item" :editModel="isEditList" v-model="currentTracksId"  @delPlay="delPlay(item)" @togglecheck="item.ischeck = !item.ischeck">
              <Checkbox slot="right" :show="isEditList" :value="item.ischeck"></Checkbox>
            </ListTrack>
          </div>

        </div>
      </scroller>
    </div>

    <div class="loading" v-if="loading && trackListData.length === 0">
      <Loading :show="loading" loadingText="加载中..."></Loading>
    </div>

    <div class="no-data" v-show="playList.totalCount === 0">
      <div>
        <img v-lazy="'static/images/noData.png'">
      </div>
      <div>
        暂无数据，
        <span class="text-violet"  @click="routerTo({path: '/'})">马上去听</span>        
      </div>
    </div>

    <div class="footer" v-show="isEditList" ref="footer">
      <div class="left text-gray" @click="topSelectedTrack()">
        <img src="static/images/uc-top.png">
        置顶
      </div>
      <div class="line"></div>
      <div class="right text-gray" @click="colSelectedTrack()">
        <img src="static/images/uc-select.png" style="max-width:28%;">
        收藏
      </div>
      <div class="line"></div>
      <div class="right text-gray" @click="delSelectedTrack()">
        <img src="static/images/uc-delete.png">
        删除
      </div>
    </div>

  </div>
</template>
<script>
  import _ from 'lodash'
  import {mapActions, mapState} from 'vuex'
  import {playlistTop, collectionCreate, carousel} from '../api/album'
  import {parseTrack, formatTrack, setTitle} from '../utils/index'
  import {actions} from '../utils/const'
  import BannerSlider from '../components/BannerSlider'
  import ListTrack from '../components/albums/ListTrack/'
  import Loading from '../components/Loading/'
  import Checkbox from '../components/input/Checkbox/'
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
        isEditLazy: false, // 防止用户狂点击
        isEditList: false, // 编辑列表状态
        isSelectAll: false, // 是否全选
        banners: [], // 轮播图
        currentTracksId: null, // 显示最近显示单曲索引
        loading: false,
        scroller: null,
        fistLoad: true,
        trackListData: [], // 单曲列表全部数据
        page: 1,
        count: 20,
        totalPage: null,
        totalCount: 0
      }
    },
    computed: {
      ...mapState({
        clientOnline: state => state.mqtt.clientOnline,
        WeixinReady: state => state.mqtt.WeixinReady,
        portraitScreen: state => state.mqtt.portraitScreen,
        playList: state => state.mqtt.playList
      }),
      isWeixinReady () {
        if (this.WeixinReady && this.page === 1) {
          this.calList()
          this.getCarousel()
          this.getScrollerHeight()
        }
      },
      // 全选 文字提醒
      selectAllText () {
        return this.isSelectAll ? '取消' : '全选'
      },
      // 全选数量
      selectAllNum () {
        // 全选
        if (this.isSelectAll) {
          return this.listDataNum()
        }
        // 单选
        let listData = this.trackListData
        let filterlistData = listData.filter(item => {
          return item.ischeck
        })
        return filterlistData.length
      },
      // 列表数量
      listDataNum () {
        return this.playList.totalCount
      }
    },
    watch: {
      isWeixinReady (isReady) {},
      portraitScreen (isReady) {
        this.getScrollerHeight()
      },
      // 监听播放列表 数据变化
      playList (newVal) {
        if (!newVal.status || newVal.status === actions.create) return // 递增数据不处理
        if (this.page === 1) return
        // 原来列表数据=>索引对象&记录数据状态
        let trackListDataIndex = {}
        this.trackListData.map(item => {
          trackListDataIndex[item.id] = {
            index: item.id,
            ischeck: item.ischeck
          }
        })
        // 重新获取新数据&还原数据状态
        let page = 1
        let count = (this.page - 1) * this.count
        let promise = this.playlistGetData({page, count})
        let self = this
        this.trackListData = []
        promise.then((data) => {
          let newData = data.data
          if (newData.length === 0) return // 空数据
          newData.map((item, index) => {
            let originItem = trackListDataIndex[item.id]
            item = parseTrack(item)
            item.ischeck = Boolean(originItem && originItem.ischeck)
            self.trackListData.push(item)
          })
          // 计算数据
          this.countPage()
        })
      }
    },
    methods: {
      ...mapActions('mqtt', [
        'addtoCollctionListData',
        'cleanPlaylist',
        'pausePlaying',
        'playlistDel',
        'playlistDelTodo',
        'playlistAddtoCollctionlist',
        'playlistGetData'
      ]),
      // 获取滚动加载高度
      getScrollerHeight () {
        let refs = this.$refs
        setTimeout(() => {
          this.windowHeight = (window.innerHeight - refs.banner.offsetHeight - refs.action.offsetHeight - refs.footer.offsetHeight) + 'px'
        }, 500)
      },
      setErrorImg (e) {
        e.target.src = 'static/images/DefaultCover.png'
      },
      // 跳转
      routerTo (router) {
        this.$router.push(router)
      },
      // 轮播图
      getCarousel () {
        let self = this
        carousel({page: 'playlist'}).then(response => {
          self.banners = response.data
        })
      },
      // 切换编辑状态
      toggleEdit (isEdit) {
        if (this.isEditLazy) return
        this.isEditList = isEdit
        this.getScrollerHeight()
        // 防止用户狂点击
        this.isEditLazy = true
        setTimeout(() => {
          this.isEditLazy = false
        }, 500)
      },
      cancelSelectAll () {
        this.isSelectAll = false
      },
      // 全选
      selectAll () {
        this.isSelectAll = !this.isSelectAll
        this.trackListData.map(item => {
          item.ischeck = this.isSelectAll
        })
      },
      // 删除播放单曲
      delPlay (tracks) {
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        let trackData = formatTrack(tracks)
        this.confirm('确定要删除播放歌曲？', null, (ok) => {
          if (ok) {
            this.playlistDel(trackData[0])
          }
        })
      },
      // 删除单曲
      delSelectedTrack () {
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        // 判断选择条数
        let filterTrackArr = this.trackListData.filter(item => {
          return item.ischeck
        })
        if (filterTrackArr.length === 0) {
          this.tip('请先选择单曲')
          return
        }
        // 全选 -> 删除
        if (this.isSelectAll && filterTrackArr.length === this.trackListData.length) {
          this.confirm('确定要清空播放列表？', null, (ok) => {
            if (ok) {
              this.cleanPlaylist()
              this.pausePlaying()
              // 重置
              this.cancelSelectAll()
              this.toggleEdit(false)
              // this.trackListData = []
            }
          })
          return
        }
        // 选择 -> 删除
        // 获取删除数据数组
        let self = this
        let delTrackIndexArr = [] // 删除数组的索引集合
        let delTrackArr = filterTrackArr.map(item => {
          delTrackIndexArr.push(item.id)
          return formatTrack(item)[0]
        })
        this.confirm('确定要删除' + (delTrackArr.length) + '首歌曲吗？', null, (ok) => {
          if (ok) {
            self.playlistDel(delTrackArr)
          }
        })
      },
      // 置顶单曲
      topSelectedTrack () {
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        // 判断选择条数
        let filterTrackArr = this.trackListData.filter(item => {
          return item.ischeck
        })
        if (filterTrackArr.length === 0) {
          this.tip('请先选择单曲')
          return
        }
        // 获取置顶数据数组
        let topTrackIndexArr = [] // 置顶数组的索引集合
        let topTrackArr = filterTrackArr.map(item => {
          topTrackIndexArr.push(item.id)
          return formatTrack(item)[0]
        })
        playlistTop(topTrackArr).then(response => {
          if (response.data.errcode === 0) {
            this.cancelSelectAll()
            // this.toggleEdit(false)
            let newTrackArr = this.trackListData.filter(item => {
              return !_.includes(topTrackIndexArr, item.id)
            })
            // 过滤
            this.trackListData = topTrackArr.map(item => {
              item = parseTrack(item)
              item.ischeck = this.isSelectAll
              return item
            }).concat(newTrackArr)
          }
        })
      },
      // 收藏单曲
      colSelectedTrack () {
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        // 判断选择条数
        let filterTrackArr = this.trackListData.filter(item => {
          return item.ischeck
        })
        if (filterTrackArr.length === 0) {
          this.tip('请先选择单曲')
          return
        }
        // 全选 -> 收藏
        if (this.isSelectAll && filterTrackArr.length === this.trackListData.length) {
          this.playlistAddtoCollctionlist()
          // 重置
          this.cancelSelectAll()
          this.toggleEdit(false)
          return
        }
        // 选择 -> 收藏
        // 获取置顶数据数组
        let colTrackIndexArr = [] // 置顶数组的索引集合
        let colTrackArr = filterTrackArr.map(item => {
          colTrackIndexArr.push(item.id)
          return formatTrack(item)[0]
        })
        collectionCreate(colTrackArr).then(response => {
          if (response.data.errcode === 0) {
            this.cancelSelectAll()
            this.toggleEdit(false)
            this.trackListData.map(item => {
              // 添加到收藏列表
              if (_.includes(colTrackIndexArr, item.id)) {
                let trackData = formatTrack(item)
                this.addtoCollctionListData(trackData[0])
              }
            })
            this.tip('已收藏')
          }
        })
      },
      // 切换单曲选择
      togglecheck (track) {
        track.ischeck = !track.ischeck
      },
      // 计算加载
      calList () {
        // 数据全部加载完成
        if (this.totalPage && (this.page > this.totalPage)) {
          this.loadStop()
          return
        }
        if (!this.WeixinReady) return
        if (this.loading) return
        this.loadData()
      },
      // 加载数据
      loadData () {
        let self = this
        let promise = this.playlistGetData({page: this.page, count: this.count})
        this.loading = true
        promise.then((data) => {
          let newData = data.data
          if (newData.length === 0) return // 空数据
          // 新增数据
          newData.map((item, index) => {
            item = parseTrack(item)
            item.ischeck = self.isSelectAll // 默认不被编辑选中
            self.trackListData.push(item)
          })
          // 更新组件状态&分页
          self.$nextTick(() => {
            this.loadDone()
            this.countPage()
          })
        })
      },
      // 统计分页数据
      countPage () {
        this.page = Math.ceil(this.trackListData.length / this.count) + 1
        this.totalPage = Math.ceil(this.playList.totalCount / this.count)
        this.totalCount = this.playList.totalCount || 0
      },
      loadDone () {
        let scroller = this.$refs.scroller
        this.loading = false
        this.$nextTick(() => {
          scroller.reset()
          this.loadStop()
        })
      },
      loadStop () {
        setTimeout(() => {
          let scroller = this.$refs.scroller
          if (this.totalPage && (this.page > this.totalPage)) {
            scroller.disablePullup()
            return
          }
          scroller.donePullup()
          this.loadingStatus.pullupStatus = 'default'
        }, 100)
      },
      onAutoplay () {
        this.getScrollerHeight()
      }
    },
    beforeMount () {
      setTitle('播放列表')
    },
    mounted: function () {
      this.scroller = this.$refs.container
      console.log(BannerSlider)
      console.log(ListTrack)
      console.log(Loading)
      console.log(Checkbox)
    }
  }

</script>

<style lang='scss' scoped>
  .ucList{
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

    /*顶部，底部导航*/ 
    .header,.footer{
      height:2.8rem;
      line-height:2.8rem;
      display: flex;
      align-items: center;
      font-size:1rem;
      flex-shrink: 0;

      .left,.right{
        flex:1;
        height:100%;
        border-bottom:1px solid #F1F1F1;

        img{
          margin-bottom: -0.8rem;
          max-width: 40%;
          width: 2.3rem;
        }
      }
      .active{
        border-bottom:3px solid #AF7BFF;
        color:#AF7BFF;
      }
      .line{
        height:1.2rem;
        width:2px;
        background:#F1F1F1;
      }
    }
    .footer{
      height:3.5rem;
      line-height:3.5rem;
      border-top:1px solid #F1F1F1;
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
    }

    /*内容*/ 
    .container{
      overflow: auto;
      overflow-y: hidden;
      /*flex: 1;*/

        .no-data{
          margin: 4rem 0;
          font-size:1rem;
          text-align:center;
        }

        .mullist-item{
          width:100%;
          display:flex;
          align-items: center;
          
          
          .mullist-icon{
            flex:1;
            padding:.5rem;

            img{
              width:90%;
              border-radius: 50%;
            }
          }

          .mullist-info{
            flex:6;
            overflow: hidden;
            
            .track_title{
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              padding-right:0rem;
            }
            .sort-span{
              
              font-size: .7rem;
            }
          }

          .mullist-add{
            flex:1;
            text-align: center;
            color:#AAA6AD;

            .add-icon{
              max-width:100%;
            }
          }
        }
      
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
      }
  }

</style>
