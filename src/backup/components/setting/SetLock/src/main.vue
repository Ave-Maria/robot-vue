<template>
  <transition name='fade'>
  <div class='component SetLock' v-if="open" @click="closeSetting()">
      <div class="icon"></div>
      <div class="content">
        <div class="text">
          童锁设置<br/>
          <div class="sub-text">开启童锁后,小驰上的按键功能将失效</div>
        </div>
        <template v-for="option in lockOption">
        <div :class="['option',{active:(option.num === lock)}]" @click.stop="checkSelect(option.num)">
          {{option.name}}
        </div>
        </template>
      </div>
  </div>
  </transition>
</template>
<script>
  // import {mapState} from 'vuex'
  export default {
    name: 'SetLock',
    props: {
      open: {
        type: Boolean,
        default: false
      },
      lock: {
        type: Boolean
      },
      lockOption: {
        type: Object,
        default: {}
      }
    },
    data: function () {
      return {
      }
    },
    computed: {
      // ...mapState({
      //   clientOnline: state => state.mqtt.clientOnline,
      //   clientBind: state => state.mqtt.clientBind,
      //   deviceStatus: state => state.mqtt.deviceStatus,
      //   deviceOnline: state => state.mqtt.deviceOnline
      // })
    },
    methods: {
      setErrorImg (e) {
        e.target.src = 'static/images/uc-default-all-vatar@3x.png'
      },
      checkSelect (option) {
        // if (!this.clientOnline) {
        //   this.tip('请检查网络是否连接')
        //   return
        // }
        // if (!this.clientBind) {
        //   this.tip('您还没有绑定设备哦')
        //   return
        // }
        // if (this.deviceStatus) {
        //   this.tip('故事机正在升级')
        //   return
        // }
        // if (!this.deviceOnline) {
        //   this.tip('设备不在线')
        //   return
        // }
        this.closeSetting(option)
      },
      // 关闭组件
      closeSetting (data) {
        this.$emit('close', data)
      }
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
    .sub-text{
      font-weight: normal;
      font-size: .7rem;
      padding-top: .4rem;
    }
    .SetLock{
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
      .content {
        text-align: center;
        background: #fff;

        .option{
          line-height:3.5rem;
          border-bottom:1px solid rgba(215, 213, 219, .5);
          margin: 0 .5rem;
        }
        .active{
          color:#B585FF;
        }
        .text{
          font-weight:bold;
          padding: 1rem;
          color:#fff;
          background: #B585FF;
        }
      }
    }

</style>
