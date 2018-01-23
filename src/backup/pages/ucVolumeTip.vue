<template>
  <div class='pages ucVolumeTip'>
     
        <!--<div class="list">
            <TextSlotBar  title="自动播放微信消息">
              <span slot="right">
                <x-switch title="" prevent-default :value="volumeTipAutoPlay" @on-click="togglePlay"></x-switch>
              </span>
            </TextSlotBar>
        </div>-->
        <div class="tip-text">微信消息提示</div>
        <div class="classify">
            <template v-for="option in volumeTipOption">
              <TextSlotBar :title="option.name" :rightIcon="(option.num === volumeTip ? 'static/images/voiletCheck.png' : '')" @clickTitle="selectVolumeTip(option)"  @clickRight="selectVolumeTip(option)"></TextSlotBar>
            </template>
        </div>

  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import TextSlotBar from '../components/bar/TextSlotBar/'
  import NoBind from '../components/NoBind/'
  import Loading from '../components/Loading/'
  import SetAvatar from '../components/setting/SetAvatar/'
  import { XSwitch } from 'vux'
  import {setTitle} from '../utils/index'
  import {volumeTipOption} from '../utils/const'
  export default {
    components: {
      XSwitch
    },
    data: function () {
      return {
        loading: true, // 加载中
        volumeTipOption
      }
    },
    computed: {
      ...mapState({
        WeixinReady: state => state.mqtt.WeixinReady,
        deviceStatus: state => state.mqtt.deviceStatus,
        clientOnline: state => state.mqtt.clientOnline,
        clientBind: state => state.mqtt.clientBind,
        deviceOnline: state => state.mqtt.deviceOnline,
        volumeTipAutoPlay: state => state.mqtt.volumeTipAutoPlay,
        volumeTip: state => state.mqtt.volumeTip
      }),
      isWeixinReady () {
        if (this.WeixinReady) {
          this.chatPromptGet()
          return
        }
      }
    },
    watch: {
      isWeixinReady (isReady) {}
    },
    filters: {
    },
    methods: {
      ...mapActions('audio', [
        'playPauseAudioCreate',
        'pauseAudio',
        'clearInfo'
      ]),
      ...mapActions('setting', [

      ]),
      ...mapActions('mqtt', [
        'chatPromptGet',
        'setvolumeTipAutoPlay',
        'setvolumeTip'
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
        if (this.deviceStatus) {
          this.tip('故事机正在升级')
          return
        }
        if (!this.deviceOnline) {
          this.tip('设备不在线')
          return
        }
        // 自动播放开
        if (newVal) {
          this.confirm('打开自动播放开关后,故事机收到微信语音消息后,将立刻自动播放', null, (ok) => {
            if (ok) {
              this.setvolumeTipAutoPlay(true)
            }
          })
          return
        }
        // 自动播放关
        this.setvolumeTipAutoPlay(false)
      },
      // 选择提示消息
      selectVolumeTip (option) {
        this.playPauseAudioCreate(option.url)
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
        if (!option || !option.num) return
        this.setvolumeTip(option.num)
      }
    },
    beforeMount () {
      setTitle('语音消息')
    },
    mounted: function () {
      console.log(TextSlotBar)
      console.log(NoBind)
      console.log(SetAvatar)
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
    .loading{
      margin-top:2rem;
      background:#fff;
      color:#C8C8C8;
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
