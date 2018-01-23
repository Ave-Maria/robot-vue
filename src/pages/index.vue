<template>
  <div class='pages ucIndex'>
    <template v-if="clientBind">
      <div class="header">
          <div class="left"> &nbsp;</div>
          <div class="avatar" @click="to({path:'/ucSetting'})">
              <ImgBox :imgUrl="avatar" imgstyle="width:7rem;height:7rem;" :offLine="!deviceOnline"></ImgBox>
              <div class="name">{{settingName}}</div>
          </div>
          <div class="right" @click="to({path:'/ucSetting'})"><img src="static/images/uc-settings@2x.png"></div>
      </div>

      <div class="list">
          <TextBar leftIcon="static/images/uc-select@2x.png" rightIcon="static/images/rightIcon@2x.png" title="宝宝收藏" @clickRight="to({path: '/ucCollectionTrack'})" @clickTitle="to({path: '/ucCollectionTrack'})"></TextBar>
          <TextBar leftIcon="static/images/uc-history@2x.png" rightIcon="static/images/rightIcon@2x.png" title="播放历史" @clickRight="to({path: '/ucHistory'})" @clickTitle="to({path: '/ucHistory'})"></TextBar>
      </div>
      
      <div class="list">
          <TextBar leftIcon="static/images/uc-happy-song@2x.png" rightIcon="static/images/rightIcon@2x.png" title="播放列表" :subtitle="playList.totalCount + '首'" @clickRight="playList.totalCount && to({path: '/ucList'})" @clickTitle="playList.totalCount && to({path: '/ucList'})"></TextBar>
      </div>
 
      <div class="list">
          <TextBar leftIcon="static/images/uc-literature@2x.png" rightIcon="static/images/rightIcon@2x.png" title="宝宝语录" @clickRight="to({path: '/ucBabyVoiceRecord'})" @clickTitle="to({path: '/ucBabyVoiceRecord'})"></TextBar>
      </div>

      <div class="classify">
          <TextBar leftIcon="static/images/uc-fairy-tales@2x.png" rightIcon="static/images/rightIcon@2x.png" title="儿童内容" @clickRight="to({path: '/'})" @clickTitle="to({path: '/'})"></TextBar>
      </div>
    </template>
    <template v-else>
      <NoBind></NoBind>
    </template>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import {setTitle} from '../utils/index'
  import TextBar from '../components/bar/TextBar/'
  import NoBind from '../components/NoBind/'
  import ImgBox from '../components/ImgBox/'
  export default {
    data: function () {
      return {
        isFirstLoad: true // 判断是否第一次加载数据
      }
    },
    computed: {
      ...mapState({
        avatar: state => state.setting.avatar,
        name: state => state.setting.name,
        WeixinReady: state => state.mqtt.WeixinReady
      }),
      isWeixinReady () {
        if (this.WeixinReady && this.isFirstLoad) {
          this.isFirstLoad = false
          this.userSettingGet()
          return
        }
      },
      settingName () {
        return this.deviceOnline ? this.name : this.name + '(设备不在线)'
      }
    },
    watch: {
      isWeixinReady (isReady) {}
    },
    methods: {
      setErrorImg (e) {
        e.target.src = 'static/images/uc-default-vatar.png'
      },
      // 跳转
      to (router) {
        if (!router) return
        this.$router.push(router)
      },
      ...mapActions('setting', [
        'userSettingGet'
      ])
    },
    beforeMount () {
      setTitle('驰小宝故事机')
    },
    mounted: function () {
      console.log(TextBar)
      console.log(NoBind)
      console.log(ImgBox)
    }
  }

</script>

<style lang='scss' scoped>
    .ucIndex{
    height:100%;
    width:100%;
    color: #FBFBFC;
    background: #F2F2F4;
    text-align: center;

    img{
      width:auto;
      max-width:100%;
      width: 3rem;
    }

    .header{
      min-height:11rem;
      padding:.5rem 0rem;
      background: linear-gradient(#8e46ff, #b483ff);
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left,.right{
        width:3rem;
      }
      .avatar{
        display: flex;
        flex-direction: column;
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
        align-self: flex-start;
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
