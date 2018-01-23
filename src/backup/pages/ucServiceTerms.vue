<template>
  <div class='pages ucServiceTerms'>

      <div class="list" v-html="serviceTerms"></div>

      <div class="no-data" v-show="noData || !serviceTerms">
        <div class="icon">
          <img v-lazy="'static/images/emptybox@2x.png'" />
        </div>
        <div class="text">未找到相关服务条款</div>
      </div>

      <Loading :show="loading" loadingText="加载中..." style="margin-top:3rem;"></Loading>
  </div>
</template>
<script>
  import '../style/quill.core.css'
  import {mapState, mapActions} from 'vuex'
  import {setTitle} from '../utils/index'
  import Loading from '../components/Loading/'
  export default {
    data: function () {
      return {
      }
    },
    computed: {
      ...mapState({
        WeixinReady: state => state.mqtt.WeixinReady,
        noData: state => state.mqtt.noData,
        loading: state => state.mqtt.loading,
        serviceTerms: state => state.about.serviceTerms
      }),
      isWeixinReady () {
        if (this.WeixinReady) {
          this.getAbout()
          return
        }
      }
    },
    watch: {
      isWeixinReady (isReady) {}
    },
    methods: {
      ...mapActions('about', [
        'getAbout'
      ]),
      ...mapActions('player', [
        'playerAllHide'
      ])
    },
    beforeMount () {
      setTitle('驰小宝故事机—服务条款')
    },
    mounted: function () {
      this.playerAllHide()
      console.log(Loading)
    }
  }

</script>

<style lang='scss'>

  .ucServiceTerms{
    height:100%;
    width:100%;
    background: #fff;
    text-align: center;

    img{
      width:auto;
      max-width:100%;
    }

    .list{
      margin-bottom:.5rem;
    }

    .no-data{
      text-align:center;

      .icon{
        width:50%;
        margin:2rem auto 1rem;

        img{
          max-width:100%;
        }
      }
      .text{
        color:#A79EB6;
        font-size:1rem;
      }
    }
  }

</style>
