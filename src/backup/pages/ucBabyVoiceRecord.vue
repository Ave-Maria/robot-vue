<template>
  <div class="pages ucBabyVoiceRecord active">

    <div class="demo-infinite-container" ref="container">

    <scroller v-show="voiceListData.length" lock-x scrollbar-y use-pulldown :pulldown-config="pulldownConfig" ref="scroller" :height="windowHeight" @on-pulldown-loading="calList" @on-scroll="onScroll" v-model="loadingStatus">
      <div class="box2" ref="box">
        <template v-for="(item, index) in voiceListData" >
          <VoiceRecord :key="item.id" :createdTime="item.createdTime | formatTime" :input="item.input" :output="item.output" :inputImgUrl="inputImgUrl" :outputImgUrl="outputImgUrl"></VoiceRecord>
        </template>
      </div>
    </scroller>

      <div class="loading" v-if="loading">
        <Loading :show="loading" loadingText="加载中..."></Loading>
      </div>

      <div class="no-data" v-if="voiceListData.length === 0 && !loading">
        <div>
          <img v-lazy="'static/images/noData.png'">
        </div>
        <div>暂无宝宝语录</div>
      </div>

      <div class="newData" v-if="tipsNum">
          <div class="text" @click="checkTips()">
            <div class="icon"><img src="static/images/scroller@2x.png"></div>
            <div><span>{{tipsNum}}</span>条新消息</div>
            <div class="line"></div>
          </div>

          <div class="close icon" @click="closeTips()"><img src="static/images/ucDelete@2x.png"></div>
      </div>
    </div>
  </div>
</template>
<script>
  // import _ from 'lodash'
  import {mapState} from 'vuex'
  import {voiceRecordList} from '../api/album'
  import {setTitle, timeformat} from '../utils/index'
  import Loading from '../components/Loading/'
  import VoiceRecord from '../components/VoiceRecord/'
  import {Scroller} from 'vux'
  import _ from 'lodash'
  export default {
    components: {
      Scroller
    },
    data: function () {
      return {
        pulldownConfig: {
          content: '下拉刷新',
          downContent: '下拉刷新',
          upContent: '释放刷新',
          loadingContent: '加载中'
        },
        windowHeight: '', // scroller 高度
        loading: false, // 加载数据状态
        loadingStatus: {
          pulldownStatus: 'default'
        },
        isNewvoice: false, // 是否有新数据
        inputImgUrl: 'static/images/uc-default-vatar.png', // 输入（用户）头像
        outputImgUrl: 'static/images/uc-default-vatar.png', // 输出(宝宝）头像
        voiceListData: [], // 专辑列表
        scroller: null,
        page: 1,
        count: 20,
        totalPage: null,
        totalCount: 0,
        loadDisabled: false, // 禁止加载
        tipsNum: 0 // 提示的新增数据
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
        if (this.WeixinReady && this.page === 1) {
          this.calList()
          return
        }
      }
    },
    watch: {
      isWeixinReady (isReady) {},
      portraitScreen (isReady) {
        setTimeout(() => {
          this.windowHeight = this.getWindowHeight()
        }, 500)
      },
      voiceRecored (voiceRecored) {
        // 有新宝宝语录数据加入
        if (voiceRecored && voiceRecored.input && voiceRecored.output) {
          this.addTips()
          this.voiceListData.push(voiceRecored)
          this.isNewvoice = true
          this.countPage()
        }
      }
    },
    filters: {
      formatTime (time) {
        if (!time) return
        let nowDate = timeformat('yyyy年MM月dd日')
        let timeDate = timeformat('yyyy年MM月dd日', time)
        return nowDate === timeDate ? ('当天 ' + timeformat('hh:mm:ss', time)) : timeformat('yyyy年MM月dd日 hh:mm:ss', time)
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
      getWindowHeight () {
        return window.innerHeight + 'px'
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
        voiceRecordList({page: this.page, count: this.count}).then(response => {
          response = response.data
          if (response.errcode !== 0) return
          let records = response.data.records
          let voiceListDataIndex = [] // 已有语录数据索引
          // 刚刚新增了宝宝语录数据则过滤重复数据
          if (self.isNewvoice) {
            voiceListDataIndex = self.voiceListData.map(item => {
              return item.createdTime
            })
            self.isNewvoice = false
          }
          // 过滤新加载的数据
          records.map(item => {
            if (_.includes(voiceListDataIndex, item.createdTime)) return
            self.voiceListData.unshift(item)
          })
          // input 头像
          if (response.data.userHeadImgUrl) self.inputImgUrl = response.data.userHeadImgUrl
          // 回调
          self.loadDone()
          // 统计信息
          self.totalPage = response.data.totalPage
          self.totalCount = response.data.totalCount
          // 加载结束
          if (response.data.totalPage === 0 || response.data.currentPage === response.data.totalPage) {
            self.loadDisabled = true
          }
          self.countPage()
        })
      },
      countPage () {
        this.page = Math.ceil(this.voiceListData.length / this.count) + 1
      },
      loadDone () {
        let boxOriginPage = this.page
        let box = this.$refs.box
        let scroller = this.$refs.scroller
        let boxOriginHeight = box.offsetHeight // 渲染前的容器高度
        this.loading = false
        this.loadStop()
        this.$nextTick(() => {
          // box容器滚动到指定位置
          let height = boxOriginPage === 1 ? box.offsetHeight : (box.offsetHeight - boxOriginHeight - 100)
          scroller.reset({top: height})
        })
      },
      loadStop () {
        setTimeout(() => {
          this.$refs.scroller.donePulldown()
          this.loadingStatus.pulldownStatus = 'default'
        }, 100)
      },
      addTips () {
        let box = this.$refs.box
        if (box.offsetHeight >= window.innerHeight) {
          this.tipsNum++
        }
      },
      closeTips () {
        this.tipsNum = 0
      },
      checkTips () {
        let scroller = this.$refs.scroller
        let box = this.$refs.box
        // box容器滚动到指定位置
        if (scroller) {
          scroller.reset({top: box.offsetHeight - window.innerHeight})
          this.closeTips()
        }
      },
      onScroll (pos) {
        let box = this.$refs.box
        if (this.tipsNum && (box.offsetHeight - pos.top - window.innerHeight < 100)) {
          this.closeTips()
        }
      }
    },
    beforeMount () {
      setTitle('宝宝语录')
    },
    mounted: function () {
      console.log(VoiceRecord)
      console.log(Loading)
    }
  }

</script>

<style lang='scss' scoped>
  .ucBabyVoiceRecord{
    &.active{
      z-index: 2;
      padding-bottom: 0rem;
    }
    position: fixed;
    left: 0;
    bottom:0;      
    height:100%;
    width:100%;
    padding-bottom: 3rem;
    text-align: center;
    display:flex;
    flex-direction:column;
    background: rgb(245,245,245);

    
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
    /*加载*/
    .loading{
      width:100%;
      height:100%;
      display:flex;
      align-items: center;
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
          margin-bottom: -0.7rem;
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
    .newData{
      position: fixed;
      right: .5rem;
      bottom: .5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 12rem;
      padding: .25rem 0;
      color:#08A8E6;
      background: #fff;
      border: 1px solid rgb(252,252,252);

      .text{
        flex:1;
        display: flex;
        align-items: center;

        .icon{
          float:left;
        }
        .line{
          float:right;
          width:1px;
          height:1rem;
          background: #EEE;
          margin-left: .5rem;
        }
      }

      .icon{
        display: flex;
        justify-content: center;
        align-items: center;
        width:2rem;

        img{
          max-width:100%;
        }
      }

    }
  }

</style>
