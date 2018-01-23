<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import {GetQueryString, catchError} from './utils/index'
  export default {
    name: 'app',
    data () {
      return {
      }
    },
    methods: {
      ...mapActions([
        'getWeixinConfig'
      ])
    },
    computed: {
      ...mapState({
        // currentTrack: state => state.mqtt.currentTrack,
        // portraitScreen: state => state.mqtt.portraitScreen
      })
    },
    beforeCreate () {
      // let code = GetQueryString('code')
      // 非微信环境或微信授权回调链接没有code,直接跳转
      // if (!code) errorLogin()
      return
    },
    created () {
      // <<<<正式环境关闭
      let code = GetQueryString('code')
      let direction = GetQueryString('direction')
      // // 获取微信用户配置
      // this.getWeixinConfig()
      // <<<<正式环境关闭
      if (code) this.getWeixinConfig(code)
      // >>>>
      // 跳转到指定页面
      if (direction) {
        this.$router.replace({path: '/' + direction})
        return
      }
    },
    mounted () {
      catchError()
    }
  }

</script>

<style lang="scss">
  html,body{
    height:100%;
  }
  body{
    padding-bottom:5rem;
    height:100%;
    background: #b686ff;
    #app {
      font-family: 'Microsoft YaHei', 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
      color: #75707B;
      color: rgb(111,111,111);      
      height:100%;
    }

    /*swiper plugins*/
    .swiper-pagination-bullet, .swiper-pagination-bullet-active{
      background: #fff!important;
      width: 6px!important;
      height: 6px!important;
    }
    .mu-focus-ripple-wrapper{
      display:none!important;
    }

    /*vux UI*/
    .dp-header .dp-item.dp-right{
      color:#B585FF;
    }

    .weui-switch:checked{
      border-color: #B585FF;
      background-color:#B585FF;
    }
    
    .vux-range-input-box{
      margin: 0!important;

      .range-min,
      .range-max{
        display: none;
      }

      .range-handle{
        width: 16px;
        height: 16px;
        /*background-color: #7e57c2;*/
        top: -8px!important;
      }
      .range-quantity{
        background-color: #7e57c2;
      }
    }
  }

</style>
