<template>
  <div class='component NoBind'>
      <div class="no-bind">
        <template v-if="WeixinLoading">
          <Loading :show="WeixinLoading" loadingText="加载中..."></Loading>
        </template>
        <template v-else>
          <div class="icon"><img src="static/images/noBind.png" alt=""></div>
          <div class="text">您还没有绑定任何设备</div>
          <div class="button" @click="to({path:'/config'})">绑定设备</div>
        </template>
      </div>
  </div>
</template>
<script>
  import Loading from '../../Loading/'
  import {mapState} from 'vuex'
  export default {
    name: 'NoBind',
    props: {},
    components: {
    },
    data: function () {
      return {}
    },
    computed: {
      ...mapState({
        WeixinLoading: state => state.mqtt.WeixinLoading
      })
    },
    methods: {
      // 跳转
      to (router) {
        if (!router) return
        this.$router.push(router)
      }
    },
    mounted: function () {
      console.log(Loading)
    }
  }

</script>

<style lang='scss' scoped>
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

</style>
