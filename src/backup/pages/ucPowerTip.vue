<template>
  <div class='pages ucPowerTip'>
      
      <div class="list">
          <TextSlotBar  title="耳灯闪烁">
            <span slot="right">
              <x-switch title="" prevent-default :value="powerTipAutoPlay" @on-click="togglePlay"></x-switch>
              </span>
          </TextSlotBar>
      </div>

      <div class="tip-text">低电量提示声音</div>
      <div class="classify">
          <template v-for="option in powerTipOption">
            <TextSlotBar :title="option.name" :rightIcon="(option.num === powerTip ? 'static/images/voiletCheck.png' : '')" @clickTitle="selectPowerTip(option)"  @clickRight="selectPowerTip(option)"></TextSlotBar>
          </template>
      </div>

  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import TextSlotBar from '../components/bar/TextSlotBar/'
  import NoBind from '../components/NoBind/'
  import SetAvatar from '../components/setting/SetAvatar/'
  import { XSwitch } from 'vux'
  import {setTitle} from '../utils/index'
  import {powerTipOption} from '../utils/const'
  import {getLowBatteryPrompt, updateLowBatteryPrompt} from '../api/album'
  export default {
    components: {
      XSwitch
    },
    data: function () {
      return {
        powerTip: 1, // 语音消息 默认
        powerTipOption
      }
    },
    computed: {
      ...mapState({
        clientOnline: state => state.mqtt.clientOnline,
        clientBind: state => state.mqtt.clientBind,
        deviceOnline: state => state.mqtt.deviceOnline,
        deviceStatus: state => state.mqtt.deviceStatus,
        powerTipAutoPlay: state => state.mqtt.powerTipAutoPlay
      })
    },
    filters: {
    },
    methods: {
      ...mapActions('audio', [
        'clearInfo',
        'playPauseAudioCreate',
        'pauseAudio'
      ]),
      ...mapActions('setting', [

      ]),
      ...mapActions('mqtt', [
        'setpowerTipAutoPlay',
        'setpowerTip'
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
      togglePlay (newVal, oldVal) {
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        if (!this.clientBind) {
          this.tip('您还没有绑定设备哦')
          return
        }
        // if (!this.deviceOnline) {
        //   this.tip('设备不在线')
        //   return
        // }
        // 自动播放开
        if (!newVal) {
          this.confirm('关闭耳灯提示后,小驰低电量将不会闪烁耳灯', null, (ok) => {
            if (ok) {
              this.setpowerTipAutoPlay(false)
            }
          })
          return
        }
        this.setpowerTipAutoPlay(true)
      },
      // 选择提示消息
      selectPowerTip (option) {
        this.playPauseAudioCreate(option.url)
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        if (!this.clientBind) {
          this.tip('您还没有绑定设备哦')
          return
        }
        if (!this.deviceOnline) {
          this.tip('设备不在线')
          return
        }
        if (!option || !option.num) return
        updateLowBatteryPrompt({index: option.num}).then(response => {
          if (response.data.errcode === 0) {
            this.powerTip = option.num
          }
        })
      },
      // 获取低电量提示音
      getPowerTip () {
        let self = this
        getLowBatteryPrompt().then(response => {
          if (response.data.errcode === 0) {
            self.powerTip = response.data.data.index
          }
        })
      }
    },
    beforeMount () {
      setTitle('低电量提醒')
    },
    mounted: function () {
      this.getPowerTip()
      // if (!this.clientOnline) {
      //   this.tip('请检查网络是否连接')
      //   return
      // }
      // if (!this.clientBind) {
      //   this.tip('您还没有绑定设备哦')
      //   return
      // }
      // if (this.deviceStatus) {
      //   this.tip('故事机正在升级')
      //   return
      // }
      // if (!this.deviceOnline) {
      //   this.tip('设备不在线')
      //   return
      // }
      console.log(TextSlotBar)
      console.log(NoBind)
      console.log(SetAvatar)
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

<style lang='scss'>
  .ucPowerTip{
    height:100%;
    width:100%;
    color: #FBFBFC;
    background: #F2F2F4;
    text-align: center;

    img{
      width:auto;
      max-width:100%;
    }

    .header{
      height:11rem;
      padding:1rem;
      background: linear-gradient(#8e46ff, #b483ff);
      display: flex;
      align-items: center;

      .left,.vatar,.right{
        flex:1;
        height:100%;
      }
      .vatar{
        padding:0 1rem;

        .name{
          font-size:1rem;
        }
      }
      .right{
        text-align: right;
      }
    }

    .list{
      background: #fff;
      margin-bottom:.5rem;
    }
    .classify{
      background: #fff;
    }
    .tip-text{
      text-align:left;
      color:#C2BEC9;
      padding:1rem;
    }

    .no-bind{
      position: fixed;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      color: #75707B;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .text{
        line-height:5rem;
        color: rgba(117, 111, 123, 0.5);
      }
      .button{
        width: 70%;
        padding: .5rem .7rem;
        margin: 1rem 0;
        border: 0;
        border-radius: 1rem;
        background: #B585FF;
        color: #fff;
        margin: 0 auto;
      }
    }
  }

</style>
