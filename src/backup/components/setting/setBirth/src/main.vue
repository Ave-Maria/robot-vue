<template>
  <transition name='fade'>
  <div style="background:#000;">
       <datetime
        year-row="{value}年"
        month-row="{value}月"
        day-row="{value}日" @on-change="change"></datetime>
  </div>

  </transition>
</template>
<script>
  import Datetime from 'vux/src/components/datetime/'
  export default {
    name: 'SetBirth',
    components: {
      Datetime
    },
    props: {
      open: {
        type: Boolean,
        default: false
      },
      birth: {
        type: Number
      }
    },
    data: function () {
      return {
      }
    },
    computed: {
    },
    methods: {
      // 关闭组件
      closeSetting (data) {
        this.$emit('close', data)
      },
      change (val) {
        console.log('change', val)
      },
      showPlugin () {
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD HH',
          value: '2017-05-20 18',
          onConfirm (val) {
            console.log('plugin confirm', val)
          },
          onShow () {
            console.log('plugin show')
          },
          onHide () {
            console.log('plugin hide')
          }
        })
      }
    },
    mounted: function () {
      // this.showPlugin()
    }
  }

</script>

<style lang='less' scoped>

    @import '~vux/src/styles/weui/weui.less';

    /* 渐隐*/
    .fade-enter{
      opacity: 0;
      height:0;
    }
    .fade-enter-active{
      transition: opacity .8s, height .8s
    }
    .SetBirth{
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

        img{
          max-width:80%;
        }
      }
      .time{
        width: 70%;
        background:#fff;
        margin: 3rem auto;
        height:10rem;
      }
    }

</style>
