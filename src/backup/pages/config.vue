<template>
  <div class='pages config'>
      <Flexbox orient='vertical' v-if='!loading'>
        <FlexboxItem>
         <transition name="fade">
            <div class="config config3">

              <table class="configTable">
                <tr>
                  <td colspan="2">长按识别二维码</td>
                </tr>
                <tr>
                  <td>1.</td>
                  <td>若机器未联网，则根据步骤选择“配置设备上网”</td>
                </tr>
                
                <tr>
                  <td>2.</td>
                  <td>若机器已联网，则直接选择“设备已联网，跳过此步”进行与设备的绑定</td>
                </tr>
                
                <tr>
                  <td colspan="2">
                    <img :src="wechatQRCode" v-if="wechatQRCode" class="QRCode">
                  </td>
                </tr>

                <tr>
                  <td colspan="2">
                    <table class="subTable">
                      <tr>
                        <td style="width:2.2rem;">提示:</td>
                        <td>
                            <div>1.扫描机器底部二维码可跳过此前步骤</div>
                            <div>2.机器和移动设备绑定时，需要保证在同一个网络</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </div>
        </transition>
        </FlexboxItem>
      </Flexbox>
      <div class="loading" v-else>
        <Loading :show="loading" loadingText="加载中..."></Loading>
      </div>
  </div>
</template>
<script>
  import {setTitle} from '../utils/index'
  import {parseURI, configQrcode} from '../api/album'
  import Loading from '../components/Loading/'
  import Flexbox from '../components/flexbox/Flexbox/'
  import FlexboxItem from '../components/flexbox/FlexboxItem/'
  export default {
    data: function () {
      return {
        loading: true,
        wechatQRCode: null
      }
    },
    computed: {},
    methods: {
      getConfigQrcode () {
        let self = this
        let uri = parseURI()
        let wechatId = uri.params.wechat_id
        configQrcode({'wechat_id': wechatId}).then(response => {
          response = response.data
          if (response.errcode === 0) {
            self.wechatQRCode = response.data.url
            self.loading = false
          }
        })
      }
    },
    beforeMount () {
      setTitle('配置网络')
    },
    created () {},
    mounted: function () {
      this.getConfigQrcode()
      console.log(Loading)
      console.log(Flexbox)
      console.log(FlexboxItem)
    },
    beforeRouteLeave (to, from, next) {
      // 导航离开该组件的对应路由时调用 都会触发停止“试听”
      // 可以访问组件实例 `this`
      if (this.step === 3) {
        this.step2 = false
        this.step = 2
        next(false)
      } else if (this.step === 2) {
        this.step1 = false
        this.step = 1
        next(false)
      // 正常退出
      } else {
        next()
      }
    }
  }

</script>

<style lang='scss' scoped>
  .config{
    width:100%;
    height:100%;
    position: absolute;
    z-index: 2;
    overflow:hidden;
    background:#fff;
    text-align:center;

    .configTable{
      width:100%;
      padding:.5rem;
      text-align:left;
      vertical-align: top;

      td {
        vertical-align: top;
      }

      .QRCode{
        max-width: 100%;
        width: 100%;
      }

      .subTable{
        vertical-align: top;
      }
    }

    .loading{
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: center;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    opacity: 0
  }
</style>
