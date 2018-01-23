<template>
  <transition name='fade'>
      <div class='component setShare' @click="closeSetting()">

            <div class="title">
                <div class="tip">
                  <div class="triangle-up"></div>
                  点击这里分享给家人
                </div>
            </div>
          
          <div class="icon">
            <ImgBox :imgUrl="qrCodeUrl" imgstyle="width:12rem;height:12rem;border-radius:0;" @click.native="closeSetting()"></ImgBox>
            <div>扫描二维码加入驰小宝家庭圈</div>
          </div>

      </div>
  </transition>
</template>
<script>
  import {encodeURI} from '../../../../api/album'
  import {mapActions, mapState} from 'vuex'
  import ImgBox from '../../../ImgBox/'
  export default {
    name: 'setShare',
    props: {
      qrCodeUrl: {
        type: String,
        default: ''
      },
      myNickname: {
        type: String,
        default: ''
      }
    },
    data: function () {
      return {
        accept: 'image/png,image/jpg,image/jpeg',
        imgList: []
      }
    },
    computed: {
      ...mapState({
        wx: state => state.jssdk.wx,
        wxReady: state => state.jssdk.wxReady,
        WeixinReady: state => state.mqtt.WeixinReady
      }),
      isWeixinReady () {
        if (this.WeixinReady) {
          this.setWxConfig()
        }
      },
      isWxReady () {
        if (this.wxReady) {
          let self = this
          // this.wx.onMenuShareTimeline({
          //   title: document.title, // 分享标题
          //   link: encodeURI({direction: 'ucShare'}), // 分享链接
          //   imgUrl: this.qrCodeUrl, // 分享图标
          //   success: function () {
          //     // 用户确认分享后执行的回调函数
          //     self.tip('已分享到朋友圈')
          //   },
          //   cancel: function () {
          //     // 用户取消分享后执行的回调函数
          //     self.tip('已取消分享')
          //   }
          // })
          this.wx.hideMenuItems({
            menuList: ['menuItem:share:timeline', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:favorite', 'menuItem:share:facebook', 'menuItem:share:QZone', 'menuItem:openWithQQBrowser', 'menuItem:openWithSafari'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
          })
          this.wx.onMenuShareAppMessage({
            title: '智能故事机-来自' + self.myNickname + '的分享', // 分享标题
            desc: '微信连接，随时随地亲情互动，语音群聊，微信自定义播放，一键关注，秒...', // 分享描述
            link: encodeURI({direction: 'ucShare'}), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: self.qrCodeUrl, // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
              // 用户确认分享后执行的回调函数
            },
            cancel: function () {
              // 用户取消分享后执行的回调函数
            }
          })
        }
      }
    },
    watch: {
      isWeixinReady (isReady) {},
      isWxReady (isReady) {}
    },
    methods: {
      ...mapActions('jssdk', [
        'setWxConfig'
      ]),
      setErrorImg (e) {
        e.target.src = 'static/images/uc-default-all-vatar@3x.png'
      },
      // 关闭组件
      closeSetting (data) {
        this.$emit('close', data)
      }
    },
    mounted: function () {
      console.log(this.$ref)
      console.log(ImgBox)
    }
  }

</script>

<style lang='scss' scoped>
    /* 渐隐*/
    .fade-enter{
      opacity: 0;
      height:0;
    }
    .fade-enter-active{
      transition: opacity .8s, height .8s
    }
    .setShare{
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1;
      height: 100%;
      width: 100%;
      color: #75707B;
      background-color: rgba(51, 51, 51, 0.85);
      display: flex;
      flex-direction: column;
      justify-content: center;

      .icon{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color:#fff;

        img{
          max-width:80%;
          border-radius: 100%;
        }
      }
      .title{
          position: relative;

          .tip{
            width: auto;
            position: absolute;
            right: .5rem;
            top: .5rem;
            color: #9A9A9A;
            background: #fff;
            padding: .5rem;
            border-radius: .5rem;
          }
          .triangle-up {
            position: absolute;
            right: 1rem;
            top: -.5rem;
            width: 0;
            height: 0;
            border-left: .25rem solid transparent;
            border-right: .25rem solid transparent;
            border-bottom: .5rem solid #fff;
        }
      }
    }

</style>
