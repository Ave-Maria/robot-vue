<template>
  <div class='pages ucSwitchDevice'>
      <template v-if="clientBind">
          <div class="content" v-if="!loading">
            <div class="classify">
              <div class="item" v-for="item in devices">
                <TextSlotBar @clickLeft="selectDevice(item)" @clickTitle="selectDevice(item)" :leftIcon="item | deviceIcon" rightIcon="" :title="item | deviceText">
                  <span slot="right" @click="delDevice(item)">删除</span>
                </TextSlotBar>
              </div>
            </div>
          </div>
          
          <div class="loading" v-else>
            <Loading :show="loading" loadingText="加载中..."></Loading>
          </div>
      </template>
      <template v-else>
        <NoBind></NoBind>
      </template>
  </div>
</template>
<script>
  import {deviceBindList, deviceBindSetDefault, deviceBindDelete} from '../api/album'
  import {mapState, mapActions} from 'vuex'
  import {setTitle} from '../utils/index'
  import TextSlotBar from '../components/bar/TextSlotBar/'
  import NoBind from '../components/NoBind/'
  import Loading from '../components/Loading/'
  export default {
    data: function () {
      return {
        isSetDevices: false, // 是否切换设备
        loading: true, // 数据加载中
        devices: [] // 设备列表
      }
    },
    computed: {
      ...mapState({
        WeixinReady: state => state.mqtt.WeixinReady,
        clientBind: state => state.mqtt.clientBind
      }),
      isWeixinReady () {
        if (this.WeixinReady) {
          this.deviceBindListGet()
          return
        }
      }
    },
    watch: {
      isWeixinReady (isReady) {}
    },
    filters: {
      deviceIcon: device => {
        return device.default ? 'static/images/voiletCheck.png' : 'static/images/point.png'
      },
      deviceText: device => {
        return '设备号:' + device.deviceId.toString().substr(-4)
      }
    },
    methods: {
      ...mapActions('mqtt', [
        'intWeixinConfig',
        'noClientBind'
      ]),
      ...mapActions('player', [
        'playerAllHide',
        'playerAllShow'
      ]),
      // 获取设备列表
      deviceBindListGet (animate = true) {
        if (animate) this.loading = true
        let self = this
        deviceBindList().then(response => {
          response = response.data
          if (response.errcode !== 0) return
          self.devices = response.data
          // 解绑最后一个设备
          if (response.data && response.data.length === 0) self.noClientBind()
          if (animate) this.loading = false
        }).catch(error => {
          console.log(error)
          if (animate) this.loading = false
        })
      },
      // 切换设备
      selectDevice (device) {
        let self = this
        let id = device.id
        let currId = null
        let devicesArr = []
        // 获取新deviceID && 新devices数组
        devicesArr = self.devices.map(item => {
          // 判断是否同一个device
          if (item.default) {
            currId = item.id
          }
          // 新device数组
          return {
            id: item.id,
            deviceId: item.deviceId,
            default: item.id === id
          }
        })
        // 禁止同一个device切换设备
        if (id === currId) return
        // 切换设备
        self.devices = devicesArr
        self.bindDevice(id)
      },
      // 后台绑定设备
      bindDevice (id) {
        if (!id) return
        let self = this
        // 切换设备
        deviceBindSetDefault({id}).then(response => {
          response = response.data
          if (response.errcode === 0) {
            // 记录切换操作，离开页面刷新整体数据
            self.isSetDevices = true
          }
        })
      },
      // 删除设备
      delDevice (device) {
        if (!device) return
        let self = this
        let tip = '您是否确定要解除绑定设备' + device.deviceId.toString().substr(-4) + '？   解除绑定后您将不会收到此设备发送的消息，您也不能对此设备发送消息'
        let title = '解绑设备'
        this.confirm(tip, title, (ok) => {
          if (!ok) return
          deviceBindDelete(device).then(response => {
            response = response.data
            if (response.errcode !== 0) return
            let devicesLenth = self.devices.length
            // 解绑最后一个设备
            if (devicesLenth === 1) {
              self.noClientBind()
              return
            }
            /* 重新获取数据 */
            self.deviceBindListGet(false)
            // 记录切换操作，离开页面刷新整体数据
            if (device.default) self.isSetDevices = true
          })
        })
      }
    },
    beforeMount () {
      setTitle('切换设备')
    },
    mounted: function () {
      this.playerAllHide()
      console.log(TextSlotBar)
      console.log(Loading)
      console.log(NoBind)
    },
    beforeRouteLeave (to, from, next) {
      // 导航离开该组件的对应路由时调用 都会触发停止“试听”
      // 可以访问组件实例 `this`
      // 没有设备时候 不允许后退,只能前往配网页面
      if (!this.clientBind) {
        next(to.path === '/config')
      // 记录切换设备操作，离开页面刷新整体数据
      } else if (this.isSetDevices) {
        this.devices.map((item, index) => {
          if (item.default) window.deviceid = item.deviceId
        })
        this.intWeixinConfig(window.deviceid)
        this.playerAllShow()
        next()
      } else {
        this.playerAllShow()
        next()
      }
    }
  }

</script>

<style lang='scss' scoped>
  .ucSwitchDevice{
    height:100%;
    width:100%;
    color: #FBFBFC;
    background: #F2F2F4;
    text-align: center;

    .text-violet{
      color: #AF7BFF;
    }

    img{
      width:auto;
      max-width:100%;
    }
    .line{
      height: .5rem;
      background:#F2F2F4;
    }
    .title{
      font-size: .8rem;
      padding:1rem 0;
      color:#C8C8C8;
      background:#fff;
    }

    .list{
      overflow:hidden;
      background: #fff;
      border-bottom: 1px solid #F1F1F1;
      padding-bottom: 1rem;

      .item {
          width: 25%;
          float: left;
          margin: .5rem 4.16%;

          .nickname{
            color: #75707B;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: -.5rem;
          }
      }
    }
    .loading{
      margin-top:2rem;
      background:#fff;
      color:#C8C8C8;
    }
    .classify{
      background: #fff;
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
