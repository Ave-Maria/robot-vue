<template>
  <div :class="['pages','ucCollection',{active:isEditList}]">

    <div class="header" ref="header">
      <div class="left" @click="routerTo({path:'/ucCollectionTrack'})">单曲收藏</div>
      <div class="line"></div>
      <div class="right active">专辑收藏</div>
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
      <div class="left "><span>已选({{selectAllNum || 0}})</span></div>
      <div class="middle text-gray"></div>
      <div class="right text-violet" @click="toggleEdit(false)">完成</div>
    </div>

    <div :class="['demo-infinite-container',{empty:(albumListAllData.length === 0 && !loading)}]" ref="container">
      <scroller v-show="albumListData.length" lock-x scrollbar-y use-pullup :pullup-config="pullupConfig" ref="scroller" :height="windowHeight" @on-pullup-loading="calList" v-model="loadingStatus">
        <div class="box2" ref="box">
          <template v-for="(item, index) in albumListData">
            <CollectionAlbum :album="item" :editModel="isEditList" @togglecheck="toggleAlbumcheck(item)"  :key="item.albumId">
              <Checkbox slot="right" :show="isEditList" :value="item.ischeck"></Checkbox>
            </CollectionAlbum>
          </template>
        </div>
      </scroller>
      
      <div class="loading" v-if="loading">
        <Loading :show="loading" loadingText="加载中..."></Loading>
      </div>

      <div class="no-data" v-if="albumListAllData.length === 0 && !loading">
          <div>
            <img v-lazy="'static/images/noData.png'">
          </div>
          <div>
            暂无专辑收藏，
            <span class="text-violet"  @click="routerTo({path: '/'})">马上去听</span>        
          </div>
      </div>
    </div>


    <div class="footer" v-show="isEditList" ref="footer">
      <div class="left text-gray" @click="topSelectedAlbum()">
        <img src="static/images/uc-top@2x.png">
        置顶
      </div>
      <div class="line"></div>
      <div class="right text-gray" @click="delSelectedAlbum()">
        <img src="static/images/uc-delete@2x.png">
        删除
      </div>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import {mapState} from 'vuex'
  import {collectionListAlbum, collectionDelAlbum, collectionTopAlbum, collectionCleanAlbum} from '../api/album'
  import {setTitle} from '../utils/index'
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
        albumListAllData: [], // 专辑列表所有数据
        albumListData: [], // 专辑列表
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
        portraitScreen: state => state.mqtt.portraitScreen
      }),
      isWeixinReady () {
        if (this.WeixinReady && this.page === 1) {
          this.getAlbumList()
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
          return this.albumListAllData.length
        }
        // 单选
        let listData = this.albumListData
        let filterlistData = listData.filter(item => {
          return item.ischeck
        })
        return filterlistData.length
      },
      // 列表数量
      listDataNum () {
        return this.albumListAllData.length
      },
      // 检查loading
      compLoading () {
        return this.albumListAllData && this.albumListAllData.length > 0 && this.albumListAllData.length !== this.albumListData.length
      }
    },
    watch: {
      isWeixinReady (isReady) {},
      portraitScreen (isReady) {
        this.getScrollerHeight()
      },
      albumListAllData () {
        if (this.page === 1) return
        // 列表数据 索引数组
        let trackListDataIndex = {}
        this.albumListData.map(item => {
          trackListDataIndex[item.albumId] = {
            index: item.albumId,
            ischeck: item.ischeck
          }
        })
        // 新数据
        this.albumListData = []
        let newTrackListData = this.albumListAllData.slice(0, (this.page - 1) * this.count)
        newTrackListData.map((item, index) => {
          item.ischeck = Boolean(trackListDataIndex[item.albumId] && trackListDataIndex[item.albumId].ischeck)
          this.albumListData.push(item)
        })
        // 计算数据
        this.countPage()
      }
    },
    methods: {
      // 跳转
      routerTo (router) {
        this.$router.replace(router)
      },
      // 获取滚动加载高度
      getScrollerHeight () {
        let refs = this.$refs
        setTimeout(() => {
          this.windowHeight = (window.innerHeight - refs.header.offsetHeight * 2 - refs.footer.offsetHeight) + 'px'
        }, 500)
      },
      // 获取专辑收藏列表
      getAlbumList () {
        this.loading = true
        collectionListAlbum().then(response => {
          this.albumListAllData = []
          response.data.map(item => {
            item.ischeck = false // 默认不被选中
            this.albumListAllData.push(item)
          })
          this.loading = false
          this.calList()
        }).catch(error => {
          console.log(error)
          this.loading = false
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
        let listData = this.albumListData
        listData.map(item => {
          item.ischeck = this.isSelectAll
        })
      },
      // 删除专辑
      delSelectedAlbum () {
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        let filterAlbumArr = this.albumListData.filter(item => {
          return item.ischeck
        })
        if (filterAlbumArr.length === 0) {
          this.tip('请先选择专辑')
          return
        }
        // 全选 -> 删除
        if (this.isSelectAll && filterAlbumArr.length === this.albumListData.length) {
          this.confirm('确定要清空专辑列表？', null, (ok) => {
            if (ok) {
              collectionCleanAlbum().then(response => {
                response = response.data
                if (response.errcode === 0) {
                  // 重置
                  this.cancelSelectAll()
                  this.toggleEdit(false)
                  this.albumListData = this.albumListAllData = []
                }
              })
            }
          })
          return
        }
        // 选择 -> 删除
        let delAlbumArr = filterAlbumArr.map(item => {
          return item.albumId
        })
        this.confirm('确定要删除' + (delAlbumArr.length) + '收藏吗？', null, (ok) => {
          if (ok) {
            collectionDelAlbum(delAlbumArr).then(response => {
              if (response.data.errcode === 0) {
                this.cancelSelectAll()
                this.toggleEdit(false)
                let newAlbumArr = this.albumListAllData.filter(item => {
                  return !_.includes(delAlbumArr, item.albumId)
                })
                this.albumListAllData = newAlbumArr
              }
            })
          }
        })
      },
      // 置顶专辑
      topSelectedAlbum () {
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        let filterAlbumArr = this.albumListData.filter(item => {
          return item.ischeck
        })
        if (filterAlbumArr.length === 0) {
          this.tip('请先选择专辑')
          return
        }
        let topAlbumIndexArr = filterAlbumArr.map(item => {
          return item.albumId
        })
        collectionTopAlbum(topAlbumIndexArr).then(response => {
          if (response.data.errcode === 0) {
            this.cancelSelectAll()
            let otherAlbumArr = this.albumListAllData.filter(item => {
              return !_.includes(topAlbumIndexArr, item.albumId)
            })
            this.albumListAllData = filterAlbumArr.map(item => {
              item.ischeck = false
              return item
            }).concat(otherAlbumArr)
            this.loadData()
          }
        })
      },
      // 点击单曲选中框
      toggleTrackcheck (track) {
        track.ischeck = !track.ischeck
      },
      // 点击专辑选中框
      toggleAlbumcheck (track) {
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
        if (!this.albumListAllData || this.albumListAllData.length === 0) return
        // 加载数据
        this.loadData()
      },
      // 加载数据
      loadData () {
        let self = this
        let startIndex = this.albumListData.length
        let newData = this.albumListAllData.slice(startIndex, startIndex + this.count)
        newData.map(item => {
          item.ischeck = this.isSelectAll // 默认不被选中
          self.albumListData.push(item)
        })
        this.$nextTick(() => {
          this.loadDone()
          this.countPage()
        })
      },
      // 统计分页数据
      countPage () {
        this.totalPage = Math.ceil(this.albumListAllData.length / this.count)
        this.totalCount = this.albumListAllData.length || 0
        this.page = Math.ceil(this.albumListData.length / this.count) + 1
      },
      loadDone () {
        let self = this
        let scroller = this.$refs.scroller
        scroller.reset()
        self.loadStop()
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
      this.scroller = this.$refs.container
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
