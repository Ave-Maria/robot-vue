<template>
  <div class='pages error'>
      <transition name="fade">
          <div class="error config1">
            <div class="desc">
              <img src="static/images/error@2x.png">
            </div>
            <div class="title">404资源不存在</div>
          </div>
      </transition>
  </div>
</template>
<script>
  import {setTitle} from '../utils/index'
  export default {
    data: function () {
      return {
      }
    },
    computed: {},
    methods: {
    },
    beforeMount () {
      setTitle('404资源不存在')
    },
    created () {},
    mounted: function () {},
    beforeRouteLeave (to, from, next) {
      // 导航离开该组件的对应路由时调用 都会触发停止“试听”
      // 可以访问组件实例 `this`
      next()
    }
  }

</script>

<style lang='scss' scoped>
  .error{
    width:100%;
    height:100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    overflow:hidden;
    background:rgba(240,240,240,1);
    text-align:center;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .desc{      
      img{
        max-width:100%;
      }
    }
    .title{
      margin:1rem 0;
      color:#888;
    }
    .sure{
      margin:1rem 0;
    }
    .button{
      padding:0 1rem;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    opacity: 0
  }

</style>
