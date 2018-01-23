<template>
  <div :class="['pages','ucCollection',{active:isEditList}]">

    <div class="header" ref="header">
      <div class="left active">单曲收藏</div>
      <div class="line"></div>
      <div class="right" @click="routerTo({path:'/ucCollectionAlbum'})">专辑收藏</div>
    </div>

    <div class="action normal" v-show="!isEditList && listDataNum" ref="action">
      <div class="left text-gray"><span>列表({{listDataNum || 0}})</span></div>
      <div class="middle"></div>
      <div class="right text-violet" @click="toggleEdit(true)" v-show="listDataNum">编辑</div>
    </div>
    <div class="action edit" v-show="isEditList && listDataNum">
      <!--<div class="left text-violet" @click="selectAll()"><span>{{selectAllText}}</span></div>
      <div class="middle text-gray">已选({{selectAllNum || 0}})</div>
      <div class="right text-violet" @click="toggleEdit(false)">完成</div>-->
      <div class="left"><span>已选({{selectAllNum || 0}})</span></div>
      <div class="middle text-gray"></div>
      <div class="right text-violet" @click="toggleEdit(false)">完成</div>
    </div>

    <div :class="['demo-infinite-container',{empty:(trackListData.length === 0 && !loading)}]" ref="container">
      
      <scroller v-show="trackListData.length" lock-x scrollbar-y use-pullup :pullup-config="pullupConfig" ref="scroller" :height="windowHeight" @on-pullup-loading="calList" v-model="loadingStatus">
        <div class="box2" ref="box">
          <template v-for="(item, index) in trackListData">
            <CollectionTrack :tracks="item" :editModel="isEditList" v-model="currentTracksId"  @delCollection="delCollection(item)" @togglecheck="toggleTrackcheck(item)"  :key="item.musicId">
              <Checkbox slot="right" :show="isEditList" :value="item.ischeck"></Checkbox>
            </CollectionTrack>
        </template>
        </div>
      </scroller>

      <div class="loading" v-if="loading">
        <Loading :show="loading" loadingText="加载中..."></Loading>
      </div>

      <div class="no-data" v-if="trackListData.length === 0 && !loading">
        <div>
          <img v-lazy="'static/images/noData.png'">
        </div>
        <div>
          暂无单曲收藏，
          <span class="text-violet"  @click="routerTo({path: '/'})">马上去听</span>        
        </div>
      </div>
    </div>

    <div class="footer" v-show="isEditList" ref="footer">
      <div class="left text-gray" @click="topSelectedTrack()">
        <img src="static/images/uc-top@2x.png">
        置顶
      </div>
      <div class="line"></div>
      <div class="right text-gray" @click="delSelectedTrack()">
        <img src="static/images/uc-delete@2x.png">
        删除
      </div>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import {mapActions, mapState} from 'vuex'
  import {collectionDel, collectionTop} from '../api/album'
  import {parseTrack, formatTrack, setTitle} from '../utils/index'
  import TextBar from '../components/bar/TextBar/'
  import CollectionAlbum from '../components/albums/CollectionAlbum/'
  import CollectionTrack from '../components/albums/CollectionTrack/'
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
        loading: false, // 加载数据状态
        isEditLazy: false, // 防止用户狂点击
        isEditList: false, // 编辑列表状态
        isSelectAll: false, // 是否全选
        trackListData: [], // 单曲列表
        currentTracksId: null, // 显示最近显示单曲索引
        scroller: null,
        page: 1,
        count: 40,
        totalPage: null,
        totalCount: 0
      }
    },
    computed: {
      ...mapState({
        clientOnline: state => state.mqtt.clientOnline,
        WeixinReady: state => state.mqtt.WeixinReady,
        collectionListData: state => state.mqtt.collectionListData,
        portraitScreen: state => state.mqtt.portraitScreen
      }),
      isWeixinReady () {
        if (this.WeixinReady && this.page === 1) {
          this.calList()
          this.getScrollerHeight()
          return
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
          return this.collectionListData.length
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
        return this.collectionListData.length
      },
      // 检查loading
      compLoading () {
        return this.collectionListData && this.collectionListData.length > 0 && this.collectionListData.length !== this.trackListData.length
      }
    },
    watch: {
      isWeixinReady (isReady) {},
      portraitScreen (isReady) {
        this.getScrollerHeight()
      },
      // 监听播放列表 数据变化
      collectionListData () {
        // 列表数据 索引数组
        let trackListDataIndex = {}
        this.trackListData.map(item => {
          trackListDataIndex[item.id] = {
            index: item.id,
            ischeck: item.ischeck
          }
        })
        // 新数据
        this.trackListData = []
        let newTrackListData = this.collectionListData.slice(0, (this.page - 1) * this.count)
        newTrackListData.map((item, index) => {
          item = parseTrack(item)
          item.ischeck = Boolean(trackListDataIndex[item.id] && trackListDataIndex[item.id].ischeck)
          this.trackListData.push(item)
        })
        // 计算数据
        this.countPage()
      }
    },
    methods: {
      setErrorImg (e) {
        e.target.src = 'static/images/DefaultCover.png'
      },
      // 跳转
      routerTo (router) {
        this.$router.replace(router)
      },
      ...mapActions('mqtt', [
        'cleanCollectionList',
        'collectionDel',
        'delfromCollectionListData',
        'getCurrentTrackIsfav'
      ]),
      // 获取滚动加载高度
      getScrollerHeight () {
        let refs = this.$refs
        setTimeout(() => {
          this.windowHeight = (window.innerHeight - refs.header.offsetHeight * 2 - refs.footer.offsetHeight) + 'px'
        }, 500)
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
        let listData = this.trackListData
        listData.map(item => {
          item.ischeck = this.isSelectAll
        })
      },
      // 删除收藏单曲
      delCollection (tracks) {
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        let trackData = formatTrack(tracks)
        this.confirm('确定要删除收藏歌曲？', null, (ok) => {
          if (ok) {
            this.collectionDel(trackData[0])
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
          this.confirm('确定要清空收藏列表？', null, (ok) => {
            if (ok) {
              this.cleanCollectionList()
              // 重置
              this.cancelSelectAll()
              this.toggleEdit(false)
              this.trackListData = []
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
        this.confirm('确定要删除' + (delTrackArr.length) + '收藏吗？', null, (ok) => {
          if (ok) {
            collectionDel(delTrackArr).then(response => {
              if (response.data.errcode === 0) {
                // 删除播放列表数据
                delTrackArr.map(item => {
                  self.delfromCollectionListData(item)
                })
                self.getCurrentTrackIsfav()
                // 本地操作
                this.cancelSelectAll()
                this.toggleEdit(false)
                let newTrackArr = this.trackListData.filter(item => {
                  return !_.includes(delTrackIndexArr, item.id)
                })
                this.trackListData = newTrackArr
              }
            })
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
        collectionTop(topTrackArr).then(response => {
          if (response.data.errcode === 0) {
            this.cancelSelectAll()
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
      // 点击单曲选中框
      toggleTrackcheck (track) {
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
        // 没有播放列表数据
        if (!this.collectionListData || this.collectionListData.length === 0) return
        // 加载数据
        this.loadData()
      },
      // 加载数据
      loadData () {
        this.loading = true
        let self = this
        let startIndex = this.trackListData.length
        let newData = this.collectionListData.slice(startIndex, startIndex + this.count)
        newData.map(item => {
          item = parseTrack(item)
          item.ischeck = this.isSelectAll // 默认不被选中
          self.trackListData.push(item)
        })
        this.$nextTick(() => {
          this.loadDone()
          this.countPage()
        })
      },
      // 统计分页数据
      countPage () {
        this.totalPage = Math.ceil(this.collectionListData.length / this.count)
        this.totalCount = this.collectionListData.length || 0
        this.page = Math.ceil(this.trackListData.length / this.count) + 1
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
      }
    },
    beforeMount () {
      setTitle('驰小宝故事机-宝宝收藏')
    },
    mounted: function () {
      // this.scroller = this.$refs.container
      console.log(TextBar)
      console.log(CollectionAlbum)
      console.log(CollectionTrack)
      console.log(Loading)
      console.log(Checkbox)
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
          max-width: 20%;
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
      position: relative;
      top: -1px;
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
      flex:1;
      overflow: scroll;
        &::-webkit-scrollbar {
            display: none;
        }
        -webkit-overflow-scrolling: touch;

      .list{
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
    }

    .demo-infinite-container{
      overflow: auto;
      height: 100%;
      &::-webkit-scrollbar {
          display: none;
      }
      -webkit-overflow-scrolling: touch;
      &.empty{
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .no-data{
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
 
  }

</style>
