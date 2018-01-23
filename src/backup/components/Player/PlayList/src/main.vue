<template>
  <div class='component play demo-infinite-container' ref="contents">
      <div class="content" ref="list">

      <scroller lock-x scrollbar-y use-pullup :pullup-config="loadingStatus" :height="contentHeight" ref="scroller" @on-pullup-loading="calList"  v-if="playList.totalCount">
        <div class="box2">
            <template v-for="(item, index) in listData">
              <div class='mullist-item' :key="item.musicId">
                <div class='mullist-icon' @click="playingPrevNext({data: item,list: playlist})">
                    <img :src="item.cover_url_middle" style='max-width:100%' @error="setErrorImg">
                </div>
                <div class='mullist-info' @click="playingPrevNext({data: item,list: playlist})">
                    <div class='track_title'><img :src="listPlayingIcon" class="icon" v-if="currentTrack.musicId == item.musicId"> {{item.musicTitle}} </div>
                    <span class='sort-span'>{{item.artistsName}}</span>
                </div>
                <div class='mullist-add' @click="playlistDel(item, index)">
                    <img class="add-icon" src="static/images/delete@2x.png">
                </div>
              </div>
            </template>
        </div>
      </scroller>

      </div>
      <div class="no-data" v-if="playList.totalCount === 0">暂无播放歌单</div>
  </div>
</template>
<script>
  import {Scroller} from 'vux'
  import {listArray, actions} from '../../../../utils/const'
  import {mapActions, mapState} from 'vuex'
  export default {
    name: 'PlayList',
    components: {
      Scroller
    },
    props: {
    },
    data: function () {
      return {
        contentHeight: null,
        loadingStatus: {
          content: '上拉加载更多',
          downContent: '松开进行加载',
          upContent: '上拉加载更多',
          loadingContent: '加载中...'
        },
        loading: false,
        fistLoad: true,
        listData: [],
        page: 1,
        count: 20,
        totalPage: null,
        totalCount: 0,
        playlist: listArray[0] // 列表类型——播放列表
      }
    },
    computed: {
      ...mapState({
        playListData: state => state.mqtt.playListData,
        currentTrack: state => state.mqtt.currentTrack,
        isPlaying: state => state.mqtt.isPlaying,
        playList: state => state.mqtt.playList
      }),
      listPlayingIcon () {
        return this.isPlaying ? 'static/images/wave.gif' : 'static/images/wave.png'
      }
    },
    watch: {
      // 监听播放列表 数据变化
      // playListData (listData) {
      //   if (this.fistLoad) {
      //     this.calList()
      //     this.fistLoad = false
      //   } else {
      //     this.loadData()
      //   }
      // },
      // 监听播放列表 数据变化
      playList (newVal) {
        if (!newVal.status || newVal.status === actions.create) return // 递增数据不处理
        if (this.page === 1) return
        // 重新获取新数据&还原数据状态
        let page = 1
        let count = (this.page - 1) * this.count
        let promise = this.playlistGetData({page, count})
        let self = this
        this.listData = []
        promise.then((data) => {
          let newData = data.data
          if (newData.length === 0) return // 空数据
          newData.map((item, index) => {
            self.listData.push(item)
          })
          // 计算数据
          this.countPage()
        })
      }
    },
    methods: {
      setErrorImg (e) {
        e.target.src = 'static/images/DefaultCover.png'
      },
      ...mapActions('mqtt', [
        'playingPrevNext',
        'playlistDel',
        'playlistGetData'
      ]),
      // 计算加载
      calList (isReload = false) {
        // 数据全部加载完成
        if (this.totalPage && (this.page > this.totalPage)) {
          this.loadStop()
          return
        }
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
            self.listData.push(item)
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
        this.page = Math.ceil(this.listData.length / this.count) + 1
        this.totalPage = Math.ceil(this.playList.totalCount / this.count)
        this.totalCount = this.playList.totalCount
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
    mounted: function () {
      this.contentHeight = this.$refs.contents.offsetHeight + 'px'
      this.calList()
    }
  }
</script>

<style lang='scss' scoped>
.play{
    color:#fff;
    overflow: auto;
    overflow-y: scroll;
    &::-webkit-scrollbar {
        display: none;
    }
    -webkit-overflow-scrolling: touch;
    flex-grow: inherit;

  /*plugins css*/
  .xs-plugin-pullup-container{
    color:#Fff;
  }

  .no-data{
    color:rgba(255,255,255,.6);
    margin: 4rem 0;
    font-size:1.2rem;
    text-align:center;
    display: flex;
    flex-direction: column;
  }
  .mullist-item{
    margin: 0 .5rem;
    display:flex;
    align-items: center;
    color:#fff;
    border-bottom:1px solid rgba(255, 255, 255, 0.12);
    
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
      text-align:left;
      
      .track_title{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right:0rem;
      }
      .sort-span{
        color: rgba(255, 255, 255, 0.5);
        font-size: .7rem;
      }
    }

    .mullist-add{
      width:2.4rem;
      margin:0 .5rem;
      text-align: center;
      color:#AAA6AD;

      .add-icon{
        max-width:100%;
      }
    }
  }
}
</style>
