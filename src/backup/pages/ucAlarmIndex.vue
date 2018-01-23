<template>
  <div class='pages ucAlarmIndex'>
      
      <div class="list">
          <template v-for="(item, index) in alarmListData">
            <TextSlotBar  :title="item.alarmtime | formatTitle" :subtitle="item | formatSubtitle"  @clickTitle="editAlarm(item)">
              <span slot="right"> <x-switch title="" prevent-default :value="item.state" @on-click="toggleState(item)"></x-switch> </span>
            </TextSlotBar>
          </template>

          <div class="no-data" v-if="alarmListData.length === 0">
            <template v-if="alarmLoading">
              <Loading :show="alarmLoading" loadingText="加载中..." style="margin-top:3rem;"></Loading>
            </template>
            <template v-else>
              <div class="no-data-alarm"><img v-lazy="'static/images/alarm@2x.png'" alt=""></div>
              未设置闹钟
            </template>
          </div>
      </div>

      <div class="create-alarm" @click="createAlarm()">创建闹钟</div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import {mapState, mapActions} from 'vuex'
  import TextSlotBar from '../components/bar/TextSlotBar/'
  import Loading from '../components/Loading/'
  import { XSwitch } from 'vux'
  import {setTitle, timeformat} from '../utils/index'
  import {alarmRuleOption} from '../utils/const'
  import {alarmSave} from '../api/album'
  export default {
    components: {
      XSwitch
    },
    data: function () {
      return {
        isFirstLoad: true, // 判断是否第一次加载数据
        loading: false // 加载数据状态
      }
    },
    computed: {
      ...mapState({
        clientOnline: state => state.mqtt.clientOnline,
        clientBind: state => state.mqtt.clientBind,
        deviceOnline: state => state.mqtt.deviceOnline,
        WeixinReady: state => state.mqtt.WeixinReady,
        alarmListData: state => state.mqtt.alarmListData,
        alarmLoading: state => state.mqtt.alarmLoading
      }),
      isWeixinReady () {
        if (!this.isFirstLoad) return
        if (this.WeixinReady) {
          this.isFirstLoad = false
          this.getAlarmList()
          return
        }
      }
    },
    watch: {
      isWeixinReady (isReady) {}
    },
    filters: {
      formatTitle (time) {
        return timeformat('hh:mm', time)
      },
      formatSubtitle (alarm) {
        // 闹钟 | (2018-01-01起) 周一、周二、周三、周四、周五、周六
        if (!alarm) return
        let dateFormat = ''
        let alarDateStr = timeformat('yyyy-MM-dd', alarm.alarmtime)
        let nowDateStr = timeformat('yyyy-MM-dd')
        let rule = alarmRuleOption[alarm.rule]
        // 主题
        dateFormat += alarm.topic
        // 开始日期
        dateFormat += '|(' + (alarDateStr === nowDateStr ? '今天' : alarDateStr) + '起)'
        // 重复
        if (rule && !_.isObject(rule)) { // 永不 | 每天
          dateFormat += rule
        } else { // 每一天
          alarm.rule.split(',').map((item, index) => {
            let ruleText = alarmRuleOption[item].simple
            dateFormat += (index === 0 ? ruleText : '、' + ruleText.substr(1))
          })
        }
        return dateFormat
      }
    },
    methods: {
      ...mapActions('mqtt', [
        'getAlarmList'
      ]),
      ...mapActions('player', [
        'playerAllHide',
        'playerAllShow'
      ]),
      setErrorImg (e) {
        e.target.src = 'static/images/uc-default-vatar.png'
      },
      // 跳转
      to (router) {
        if (!router) return
        this.$router.push(router)
      },
      // 切换自动播放微信消息
      toggleState (alarm, oldVal) {
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        let newAlarm = _.cloneDeep(alarm)
        newAlarm.state = !newAlarm.state
        alarmSave(newAlarm).then(response => {
          if (response.data.errcode === 0) {
            this.getAlarmList()
          }
        })
      },
      // 创建闹钟
      createAlarm () {
        if (!this.alarmListData) return
        if (this.alarmListData && this.alarmListData.length >= 10) {
          this.tip('最多允许设置10个闹钟')
          return
        }
        this.to({
          'path': '/ucAlarmSave',
          query: {
            action: 'add'
          }
        })
      },
      // 编辑闹钟
      editAlarm (alarm) {
        if (!alarm) return
        this.to({
          'path': '/ucAlarmSave',
          query: {
            action: 'edit',
            id: alarm.id
          }
        })
      }
    },
    beforeMount () {
      setTitle('闹钟设置')
    },
    mounted: function () {
      this.playerAllHide()
      console.log(TextSlotBar)
      console.log(Loading)
    },
    beforeRouteLeave (to, from, next) {
      this.playerAllShow()
      // 导航离开该组件的对应路由时调用 都会触发停止“试听”
      // 可以访问组件实例 `this`
      next()
    }
  }

</script>

<style lang='scss'>
  .ucAlarmIndex{
    z-index: 2;
    position: absolute;
    left: 0;
    bottom:0;      
    height:100%;
    width:100%;
    text-align: center;
    display:flex;
    flex-direction:column;
    background: #fff;
    display: flex;
    flex-direction: column;

    img{
      width:auto;
      max-width:100%;
    }

    .list{
      flex:1;
      background: #fff;
      overflow: scroll;
      &::-webkit-scrollbar {
          display: none;
      }
      -webkit-overflow-scrolling: touch;

      .no-data{
          color: #C2BEC9;
          font-size:1.2rem;
          padding:10rem 0;

          .no-data-alarm{
            width:40%;
            margin:0 auto;
            text-align:center;
          }
      }
    }

    .create-alarm{
      height: 3rem;
      line-height: 3rem;
      background: #b585ff;
      color: #fff;
    }


    .tip-text{
      text-align:left;
      color:#C2BEC9;
      padding:1rem;
    }
  }

</style>
