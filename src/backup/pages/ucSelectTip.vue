<template>
  <div class='pages ucSelectTip'>

      <div class="classify">
          <TextSlotBar rightIcon="static/images/rightIcon@2x.png" title="语音消息" @clickRight="to({path:'/ucVolumeTip'})" @clickTitle="to({path:'/ucVolumeTip'})">
            <span slot="right" @click="to({path:'/ucVolumeTip'})">{{volumeTipOption[volumeTip].name}}</span>
          </TextSlotBar>

          <TextSlotBar rightIcon="static/images/rightIcon@2x.png" title="低电量" @clickRight="to({path:'/ucPowerTip'})" @clickTitle="to({path:'/ucPowerTip'})">
            <span slot="right" @click="to({path:'/ucPowerTip'})">{{powerTipOption[powerTip].name}}</span>
          </TextSlotBar>
      </div>

  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import {setTitle} from '../utils/index'
  import {volumeTipOption, powerTipOption} from '../utils/const'
  import TextSlotBar from '../components/bar/TextSlotBar/'
  import NoBind from '../components/NoBind/'
  export default {
    data: function () {
      return {
        volumeTipOption,
        powerTipOption
      }
    },
    computed: {
      ...mapState({
        clientOnline: state => state.mqtt.clientOnline,
        clientBind: state => state.mqtt.clientBind,
        deviceStatus: state => state.mqtt.deviceStatus,
        deviceOnline: state => state.mqtt.deviceOnline,
        isKeyLock: state => state.mqtt.isKeyLock,
        earlamp: state => state.mqtt.earlamp,
        volumeTip: state => state.mqtt.volumeTip,
        powerTip: state => state.mqtt.powerTip
      })
    },
    filters: {
    },
    methods: {
      ...mapActions('mqtt', [
        'clearnToySetting',
        'toggleKeyLock',
        'setEarlamp',
        'setVolume'
      ]),
      setErrorImg (e) {
        e.target.src = 'static/images/uc-default-vatar.png'
      },
      // 跳转
      to (router) {
        if (!router) return
        this.$router.push(router)
      }
    },
    beforeMount () {
      setTitle('声音设置')
    },
    mounted: function () {
      console.log(TextSlotBar)
      console.log(NoBind)
    },
    beforeRouteEnter (to, from, next) {
      // 在渲染该组件的对应路由被 confirm 前调用
      // 不！能！获取组件实例 `this`
      // 因为当守卫执行前，组件实例还没被创建
      // next(vm => {
      //   if (from.path === '/ucPowerTip' || from.path === '/ucVolumeTip') return
      //   // 通过 `vm` 访问组件实例
      //   if (!vm.clientOnline) {
      //     vm.tip('请检查网络是否连接')
      //     return
      //   }
      //   if (!vm.clientBind) {
      //     vm.tip('您还没有绑定设备哦')
      //     return
      //   }
      //   if (vm.deviceStatus) {
      //     vm.tip('故事机正在升级')
      //     return
      //   }
      //   if (!vm.deviceOnline) {
      //     vm.tip('设备不在线')
      //     return
      //   }
      // })
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
