<template>
  <transition name='fade'>
  <div class='component SetSex' v-if="open" @click="closeSetting()">
      <div class="icon"></div>
      <div class="content">
        <template v-for="option in sexOption">
        <div :class="['option',{active:(option.value === sex)}]" @click="closeSetting(option)">
          {{option.name}}
        </div>
        </template>
        <div class="button" @click="closeSetting()">取消</div>
      </div>
  </div>

  </transition>
</template>
<script>
  export default {
    name: 'SetSex',
    props: {
      open: {
        type: Boolean,
        default: false
      },
      sex: {
        type: Number
      },
      sexOption: {
        type: Array,
        default: []
      }
    },
    data: function () {
      return {
      }
    },
    computed: {
    },
    methods: {
      setErrorImg (e) {
        e.target.src = 'static/images/uc-default-all-vatar@3x.png'
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
    .SetSex{
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
        background: #fff;

        .option{
          line-height:3.5rem;
          border-bottom:1px solid rgba(215, 213, 219, .5);
          margin: 0 .5rem;
        }
        .active{
          color:#B585FF;
        }
        .button{
          width: 70%;
          padding: .5rem .7rem;
          border: 0;
          border-radius: 1rem;
          background: #B585FF;
          color: #fff;
          margin: 2rem auto 3rem;
        }
      }
    }

</style>
