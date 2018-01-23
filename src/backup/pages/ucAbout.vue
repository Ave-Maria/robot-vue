<template>
  <div class='pages ucAbout'>
      <div class="header">
        <div class="left"></div>
        <div class="vatar">
          <img src="static/images/logo.jpg">
        </div>
        <div class="right"></div>
      </div>

      <div class="list">
          
          <TextSlotBar title="软件版本" rightIcon="static/images/rightIcon@2x.png"  @clickTitle="to({path: '/ucUpgrade'})" @clickRight="to({path: '/ucUpgrade'})">
              <sup slot="subtitle" style="color:#F00;" v-if="isNewVersion">new</sup>
              <span slot="right">{{version}}</span>
          </TextSlotBar>
            
          <TextBar v-if="!noData && instructions" rightIcon="static/images/rightIcon@2x.png" title="使用说明" @clickTitle="to({path: '/ucInstructions'})" @clickRight="to({path: '/ucInstructions'})"></TextBar>
          <TextBar v-if="!noData && serviceTerms" rightIcon="static/images/rightIcon@2x.png" title="服务条款" @clickTitle="to({path: '/ucServiceTerms'})" @clickRight="to({path: '/ucServiceTerms'})"></TextBar>
          <TextBar v-if="!noData && faq" rightIcon="static/images/rightIcon@2x.png" title="常见问题" @clickTitle="to({path: '/ucFaq'})" @clickRight="to({path: '/ucFaq'})"></TextBar>
          <TextBar v-if="!noData && phone_number" title="客服电话" :subtitle="phone_number"></TextBar>
      </div>
  </div>
</template>
<script>
  import TextSlotBar from '../components/bar/TextSlotBar/'
  import TextBar from '../components/bar/TextBar/'
  import {mapState, mapActions} from 'vuex'
  import {setTitle} from '../utils/index'
  export default {
    data: function () {
      return {
      }
    },
    computed: {
      ...mapState({
        WeixinReady: state => state.mqtt.WeixinReady,
        phone_number: state => state.about.phone_number,
        version: state => state.about.version,
        new_version: state => state.about.new_version,
        instructions: state => state.about.instructions,
        serviceTerms: state => state.about.serviceTerms,
        faq: state => state.about.faq,
        noData: state => state.about.noData
      }),
      isWeixinReady () {
        if (this.WeixinReady) {
          this.getAbout()
          return
        }
      },
      isNewVersion () {
        return this.new_version && this.new_version.number && this.new_version.number !== this.version
      }
    },
    watch: {
      isWeixinReady (isReady) {}
    },
    methods: {
      ...mapActions('about', [
        'getAbout'
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
      setTitle('驰小宝故事机—关于')
    },
    mounted: function () {
      console.log(TextBar)
      console.log(TextSlotBar)
    }
  }

</script>

<style lang='scss' scoped>
    .ucAbout{
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
