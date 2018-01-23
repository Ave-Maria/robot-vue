<template>
  <div class='pages ucUpgrade'>
      <div class="header">
        <div class="left"></div>
        <div class="vatar">
          <img src="static/images/logo.jpg">
        </div>
        <div class="right"></div>
      </div>

      <div class="list">
          <TextSlotBar title="当前版本">
            <span slot="right">{{version}}</span>
          </TextSlotBar>
          <TextSlotBar v-if="!islastVersion" :title="'发现新版本' + new_version.number" :subtitle="new_version.detail">
            <span slot="right">{{timeformat('YYYY-MM-dd', new_version.date)}}</span>
          </TextSlotBar>
      </div>

      <div class="controler-button">
          <button class="button-item" @click.prevent="versionUpgrade()">{{diffversion}}</button>      
      </div>

      <div class="upgrading" v-if="upgrading">
          <div class="upgrading-dialog">
            <div class="upgrading-icon"><img v-lazy="'static/images/upgrade.gif'" /></div>
            <div class="upgrading-text">设备升级中...</div>
          </div>
      </div>
      
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import {setTitle, timeformat} from '../utils/index'
  import {upgradeVersion} from '../api/album'
  import TextSlotBar from '../components/bar/TextSlotBar/'
  export default {
    data: function () {
      return {
        upgrading: false
      }
    },
    computed: {
      ...mapState({
        WeixinReady: state => state.mqtt.WeixinReady,
        phone_number: state => state.about.phone_number,
        version: state => state.about.version,
        publishId: state => state.about.publishId,
        new_version: state => state.about.new_version,
        clientOnline: state => state.mqtt.clientOnline,
        clientBind: state => state.mqtt.clientBind,
        deviceOnline: state => state.mqtt.deviceOnline,
        deviceStatus: state => state.mqtt.deviceStatus,
        deviceStatusText: state => state.mqtt.deviceStatusText
      }),
      isWeixinReady () {
        if (this.WeixinReady) {
          this.getAbout()
          return
        }
      },
      islastVersion () {
        return this.version === this.new_version.number || !this.new_version.number
      },
      diffversion () {
        return this.islastVersion ? '已经是最新版本' : '下载并安装'
      }
    },
    watch: {
      isWeixinReady (isReady) {},
      deviceStatusText (text) {
        switch (text) {
          // 故事机开始升级
          case 'browser_upgrade':
            this.upgrading = true
            break
          // 故事机升级成功
          case 'browser_upgrade_success':
            this.upgrading = false
            this.getAbout(true)
            break
          // 故事机升级失败
          case 'browser_upgrade_fail':
            this.upgrading = false
            this.confirm('升级失败,请重新尝试', null, (ok) => {
              if (!ok) return
              this.confirmUpgrade()
            }, {okBtn: '重试'})
            break
          // 故事机升级失败
          case 'browser_online':
            this.upgrading = false
            this.tip('故事机升级成功')
            this.getAbout(true)
            break
          default:
            break
        }
      }
    },
    methods: {
      ...mapActions('about', [
        'getAbout'
      ]),
      timeformat,
      setErrorImg (e) {
        e.target.src = 'static/images/uc-default-vatar.png'
      },
      // 跳转
      to (router) {
        if (!router) return
        this.$router.push(router)
      },
      // 检查版本更新
      versionUpgrade () {
        if (this.islastVersion) {
          return
        }
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

        this.confirm('请确保小驰宝宝在您身边,防止关机？', null, (ok) => {
          if (!ok) return
          this.confirmUpgrade()
        }, {okBtn: '开始升级'})
      },
      confirmUpgrade () {
        upgradeVersion({publish_id: this.publishId, version: this.new_version.number, url: this.new_version.url}).then(response => {
          response = response.data
          if (response.errcode === 0) {
            this.upgrading = true
          }
        }).catch(error => {
          console.log(error)
          this.tip('网络异常,请稍后重试')
        })
      }
    },
    beforeMount () {
      setTitle('驰小宝故事机—关于')
    },
    mounted: function () {
      console.log(TextSlotBar)
    },
    beforeRouteLeave (to, from, next) {
      // 导航离开该组件的对应路由时调用 都会触发停止“试听”
      // 可以访问组件实例 `this`
      next(!this.upgrading)
    }
  }

</script>

<style lang='scss' scoped>
    .ucUpgrade{
    height:100%;
    width:100%;
    color: #FBFBFC;
    background: #fff;
    text-align: center;

    img{
      width:auto;
      max-width:100%;
    }

    .header{
      min-height:11rem;
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
        display: flex;
        align-items: center;

        .name{
          font-size:1rem;
        }
        img{
          border-radius: 100%;
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
    .controler-button{
        margin: 0 2.5rem;
        height:5rem;
        display:flex;
        align-items: center;
        justify-content: center;
        .button-item{
          flex:1;
          height:2.3rem;
          margin: 1rem;
          font-size: 1rem;
          color:#fff;
          background:#B585FF;
          border:0;
          border-radius: 2rem;
        }
        .cancel{
          background:#C2BEC9;
        }
    }

    .upgrading{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      bottom: 0;
      z-index: 2;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: translate3d(0, 0, 0);
      background-color: rgba(51, 51, 51, 0.85);

      .upgrading-dialog{
        background-color: #fff;
        width: 80%;
        height: auto;
        padding: 20px;
        border-radius: 4px;
        box-sizing: border-box;
        color: #75707B;
        overflow: hidden;
      }

    }
  }

</style>
