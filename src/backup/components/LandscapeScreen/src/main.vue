<template>
  <transition name='fade'>
  <div class='component LandscapeScreen' @touchmove.prevent>
      <div class="content">
        请保持移动设备竖屏浏览哦！
      </div>
  </div>
  </transition>
</template>
<script>

  export default {
    name: 'LandscapeScreen',
    props: {
    },
    data: function () {
      return {
      }
    },
    computed: {
    },
    methods: {
    },
    mounted: function () {
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
    .LandscapeScreen{
      position: fixed;
      left: 0;
      top: 0;
      z-index: 20481238 !important;
      height: 100%;
      width: 100%;
      color: #FFF;
      font-size:1.1rem;
      background-color:rgba(51, 51, 51, 0.85);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

</style>
