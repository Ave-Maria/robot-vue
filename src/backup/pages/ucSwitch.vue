<template>
  <div class='pages ucSelectTip'>

      <div class="classify">
          <TextSlotBar title="童锁开关">
            <span slot="right"><x-switch title="" prevent-default :value="lock" @on-click="ToggleLock"></x-switch></span>
          </TextSlotBar>

          <TextSlotBar title="屏幕开关">
            <span slot="right"><x-switch title="" prevent-default :value="screen" @on-click="ToggleScreen"></x-switch></span>
          </TextSlotBar>
      </div>

  </div>
</template>
<script>
  import { XSwitch } from 'vux'
  import {mapState, mapActions} from 'vuex'
  import {setTitle} from '../utils/index'
  import TextSlotBar from '../components/bar/TextSlotBar/'
  export default {
    components: {
      XSwitch
    },
    data: function () {
      return {
      }
    },
    computed: {
      ...mapState({
        clientOnline: state => state.mqtt.clientOnline,
        clientBind: state => state.mqtt.clientBind,
        deviceStatus: state => state.mqtt.deviceStatus,
        deviceOnline: state => state.mqtt.deviceOnline,
        lock: state => state.mqtt.lock,
        screen: state => state.mqtt.screen
      })
    },
    filters: {
    },
    methods: {
      ...mapActions('mqtt', [
        'toggleLock',
        'toggleScreen'
        // ,
        // 'getScreen'
      ]),
      // 切换童锁开关
      ToggleLock (newVal, oldVal) {
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        if (!this.clientBind) {
          this.tip('您还没有绑定设备哦')
          return
        }
        if (this.deviceStatus) {
          this.tip('故事机正在升级')
          return
        }
        if (!this.deviceOnline) {
          this.tip('设备不在线')
          return
        }
        // 童锁开
        if (newVal) {
          this.confirm('开启童锁后，故事机上的按键功能将失效。你确定要这样做吗?', null, (ok) => {
            if (ok) {
              this.toggleLock(true)
            }
          })
          return
        }
        // 童锁关
        this.toggleLock(false)
      },
      // 切换屏幕开关
      ToggleScreen (newVal, oldVal) {
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        if (!this.clientBind) {
          this.tip('您还没有绑定设备哦')
          return
        }
        if (this.deviceStatus) {
          this.tip('故事机正在升级')
          return
        }
        if (!this.deviceOnline) {
          this.tip('设备不在线')
          return
        }
        // 屏幕关
        if (!newVal) {
          this.confirm('关闭后将看不到故事机上的屏幕显示。', null, (ok) => {
            if (ok) {
              this.toggleScreen(false)
            }
          })
          return
        }
        // 屏幕开
        this.toggleScreen(true)
      }
    },
    beforeMount () {
      setTitle('开关控制')
    },
    mounted: function () {
      console.log(TextSlotBar)
      // this.getScreen()
    },
    beforeRouteEnter (to, from, next) {
      next()
    }
  }

</script>

<style lang='scss'>
  .ucVolumeTip{
    height:100%;
    width:100%;
    color: #FBFBFC;
    background: #F2F2F4;
    text-align: center;

    img{
      width:auto;
      max-width:100%;
    }

    .classify{
      background: #fff;
    }
  }

</style>
