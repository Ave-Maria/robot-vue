<template>
  <div class='pages ucAlarmSave'>
      <div class="content">
        <div class="list">
            <datetime-view v-model="alarmTime" ref="datetime" format="HH:mm"></datetime-view>
        </div>
        
        <div class="classify">
            <TextSlotBar  title="主题" >
              <span slot="right">{{topic}}</span>
            </TextSlotBar>
            
            <TextSlotBar  title="开始时间" rightIcon="static/images/rightIcon@2x.png" @clickTitle="showAlarmDate = true" @clickRight="showAlarmDate = true">
              <span slot="right" @click="showAlarmDate = true">{{alarmDateText}}</span>
            </TextSlotBar>

            <TextSlotBar  title="重复" rightIcon="static/images/rightIcon@2x.png"  @clickRight="openSetting('rule')"  @clickTitle="openSetting('rule')">
              <span slot="right" @click="openSetting('rule')">{{ruleText}}</span>
            </TextSlotBar>

            <TextSlotBar  title="铃声" @clickRight="">
              <span slot="right" @click="">{{ring}}</span>
            </TextSlotBar>

            <div class="alarm-del-button" v-if="isEdit" @click="deleteAlarm()">删除闹钟</div>
        </div>

        <div class="setting">

            <SetRule :open="open" :rule="rule" @close="closeSetRule" v-if="setType === 'rule'"></SetRule>

            <div style="display:none;">
              <datetime :value="alarmDate" :show.sync="showAlarmDate" year-row="{value}年" month-row="{value}月" day-row="{value}日" :start-date="startAlarmDate" @on-change="closeAlarmDate"></datetime>
            </div>
        </div>
      </div>
      
      
      <div class="alarm-button" @click="saveAlarm()">{{isEdit?'保存':'创建'}}</div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import {mapState, mapActions} from 'vuex'
  import {alarmSave, alarmDel} from '../api/album'
  import {setTitle, timeformat} from '../utils/index'
  import {alarmRuleOption} from '../utils/const'
  import Datetime from 'vux/src/components/datetime/'
  import DatetimeView from 'vux/src/components/datetime-view/'
  import TextSlotBar from '../components/bar/TextSlotBar/'
  import SetRule from '../components/alarm/SetRule/'
  export default {
    components: {
      Datetime,
      DatetimeView
    },
    data: function () {
      return {
        open: false,
        setType: '',
        showAlarmDate: false,
        actionState: '',
        id: null, // 默认id
        topic: '闹钟', // 默认主题
        ring: '默认铃声', // 默认铃声
        alarmtime: (new Date().getTime() + 10 * 60 * 1000), // 默认时间加十分钟
        rule: 'NULL', // 默认重复
        state: true // 默认状态
      }
    },
    computed: {
      ...mapState({
        clientOnline: state => state.mqtt.clientOnline,
        clientBind: state => state.mqtt.clientBind,
        deviceOnline: state => state.mqtt.deviceOnline,
        WeixinReady: state => state.mqtt.WeixinReady,
        alarmListData: state => state.mqtt.alarmListData
      }),
      // 编辑 | 添加
      isEdit () {
        return this.$route.query.action && this.$route.query.action === 'edit'
      },
      // 时间
      alarmTime: {
        get: function () {
          return timeformat('h:m', this.alarmtime)
        },
        set: function (value) {
          // let alarmDate = timeformat('yyyy-MM-dd', this.alarmtime)
          if (!value) return
          let dateSplit = value.split(':')
          let newAlarmDate = new Date(this.alarmtime)
          newAlarmDate.setHours(dateSplit[0])
          newAlarmDate.setMinutes(dateSplit[1])
          this.alarmtime = newAlarmDate.getTime()
        }
      },
      // 日期
      alarmDate () {
        return timeformat('yyyy-MM-dd', this.alarmtime)
      },
      // 日期显示文字
      alarmDateText () {
        let alarDateStr = timeformat('yyyy-MM-dd', this.alarmtime)
        let nowDateStr = timeformat('yyyy-MM-dd')
        return alarDateStr === nowDateStr ? '今天' : alarDateStr
      },
      // 选择开始日期
      startAlarmDate () {
        let now = new Date()
        return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
      },
      // 重复显示文字
      ruleText () {
        let dateFormat = ''
        let rule = alarmRuleOption[this.rule]
        if (rule && !_.isObject(rule)) { // 永不 | 每天
          dateFormat += rule
        } else { // 每一天
          this.rule.split(',').map((item, index) => {
            dateFormat += (index === 0 ? alarmRuleOption[item].simple : '、' + alarmRuleOption[item].simple.substr(1))
          })
        }
        return dateFormat
      }
    },
    filters: {
      sexFormat: (sex) => {
        return sex === 0 ? '公主' : '王子'
      },
      birthFormat: (birth) => {
        if (!birth) return
        let d = new Date(birth * 1)
        let dateStr = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日'
        return dateStr
      }
    },
    methods: {
      ...mapActions('setting', [
        'setAvatar',
        'setName',
        'setSex',
        'setBirth'
      ]),
      // 跳转
      to (router) {
        if (!router) return
        this.$router.replace(router)
      },
      // 开启设置
      openSetting (type) {
        if (!type) return
        this.setType = type
        this.open = true
      },
      close () {
        this.setType = ''
        this.open = false
      },
      // 选择日期后 设置闹钟时间
      closeAlarmDate (alarmDate) {
        if (!alarmDate) return
        let dateArr = alarmDate.split('-')
        let timeArr = this.alarmTime.split(':')
        let newAlarmDate = new Date(...dateArr, ...timeArr)
        this.alarmtime = newAlarmDate.setMonth(newAlarmDate.getMonth() - 1)
      },
      // 设置重复
      closeSetRule (ruleData) {
        console.log('ruleData', ruleData)
        this.rule = ruleData
      },
      // 创建post data
      creatPostData () {
        return {
          id: this.id,
          topic: this.topic,
          ring: this.ring,
          alarmtime: this.alarmtime,
          rule: this.rule,
          state: this.state
        }
      },
      // 保存闹钟
      alarmSave () {
        let post = this.creatPostData()
        alarmSave(post).then(response => {
          if (response.data.errcode === 0) {
            this.actionState = 'finish'
            this.to({path: '/ucAlarmIndex'})
          } else if (response.data.errcode === 1) {
            this.tip('您已经存在相同的闹钟')
            return
          }
        })
      },
      // 创建/保存闹钟
      saveAlarm () {
        let time = new Date().getTime()
        let post = this.creatPostData()
        let postAlarmDate = timeformat('yyyy-MM-dd hh:mm', post.alarmtime)
        let inAlarmListData = this.alarmListData.filter(item => {
          let alarmDate = timeformat('yyyy-MM-dd hh:mm', item.alarmtime)
          // 编辑时排除自个闹钟
          if (this.isEdit) {
            return alarmDate === postAlarmDate && post.rule === item.rule && item.id !== post.id
          } else {
            return alarmDate === postAlarmDate && post.rule === item.rule
          }
        })
        // 判断闹钟有效性
        if (time > post.alarmtime && post.rule === 'NULL') {
          this.tip('不能设置过去的闹钟')
          return
        }
        // 判断是否存在相同闹钟
        if (inAlarmListData.length) {
          this.tip('您已经存在相同的闹钟')
          return
        }
        this.alarmSave()
      },
      // 删除闹钟
      deleteAlarm () {
        if (!this.id) return
        this.confirm('确定删除闹钟吗?', null, (ok) => {
          if (ok) {
            alarmDel([this.id]).then(response => {
              if (response.data.errcode === 0) {
                this.actionState = 'finish'
                this.to({path: '/ucAlarmIndex'})
              }
            })
          }
        })
      }
    },
    beforeMount () {
      // 设置页面标题
      setTitle(this.isEdit ? '修改闹钟' : '创建闹钟')
      // 设置action state
      this.actionState = this.isEdit ? 'edit' : 'add'
      // 查找编辑数据
      if (this.isEdit) {
        let curAlarm = this.alarmListData.filter(item => item.id === this.$route.query.id)
        if (curAlarm.length === 0) {
          this.to({path: '/ucAlarmIndex'})
          return
        }
        // 初始化数据
        let alarm = curAlarm[0]
        this.id = alarm.id
        this.topic = alarm.topic
        this.ring = alarm.ring
        this.alarmtime = alarm.alarmtime
        this.rule = alarm.rule
        this.state = alarm.state
      }
    },
    mounted: function () {
      console.log(TextSlotBar)
      console.log(SetRule)
    },
    beforeRouteLeave (to, from, next) {
      // 导航离开该组件的对应路由时调用 都会触发停止“试听”
      // 可以访问组件实例 `this`
      // next()
      if (this.setType && this.setType === 'rule') { // 弹窗选择重复，返回键避免退出
        this.open = false
        this.setType = ''
        next(false)
      } else if (this.actionState === 'add') { // 创建中途退出
        this.confirm('确定取消创建?', null, (ok) => {
          next(ok)
        })
        next(false)
      } else if (this.actionState === 'edit') { // 修改中途退出
        let self = this
        let curAlarm = this.alarmListData.filter(item => item.id === this.$route.query.id)
        let alarm = curAlarm[0]
        let isEdit = false // 是否改动过
        Object.keys(alarm).map((text) => {
          console.log(text, self[text], alarm[text])
          if (self[text] !== alarm[text]) {
            isEdit = true
            return
          }
        })
        // 已经改动
        if (isEdit) {
          this.confirm('确定放弃修改吗?', null, (ok) => {
            next(ok)
          })
          next(false)
        } else {
          next()
        }
      } else { // 正常退出
        next()
      }
    }
  }

</script>

<style lang='scss' scoped>
  .ucAlarmSave{
    z-index: 2;
    position: fixed;
    left: 0;
    bottom:0;      
    height:100%;
    width:100%;
    text-align: center;
    display:flex;
    flex-direction:column;
    background: #fff;
    overflow: scroll;
    &::-webkit-scrollbar {
        display: none;
    }
    -webkit-overflow-scrolling: touch;

    img{
      width:auto;
      max-width:100%;
    }

  
    .content{
      flex:1;
    }
    
    .list{
      background: #fff;
      margin-bottom:.5rem;
    }
    .classify{
      background: #fff;
    }

    .alarm-button{
      line-height: 3rem;
      background: #b585ff;
      color: #fff;
    }
    .alarm-del-button{
      /*margin-bottom:3rem;
      padding: 0 0 1rem 0;*/
      line-height: 3rem;
      color: #f00;
    }
  }

</style>
