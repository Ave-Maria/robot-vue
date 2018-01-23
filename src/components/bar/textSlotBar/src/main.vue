<template>
  <div class='component textbar'>

      <div class="list-item">
          <!--图标-->
          <div class="left-icon" v-if="leftIcon" ><img :src="leftIcon"></div>
          <!--信息-->
          <div class="content">
            <span class="slotleft" v-if="this.$slots.left"><slot name="left"></slot></span>
            <span class="title" @click="clickTitle()">
              {{title}}
              <div class="subtitle" v-if="subtitle">{{subtitle}}</div>
              <slot name="subtitle"></slot>
            </span>
            <span class="slotright" v-if="this.$slots.right"><slot name="right"></slot></span>
          </div>
          <!--图标-->
          <div class="right-icon"  v-if="rightIcon" @click="clickRight()"><img :src="rightIcon"></div>
      </div>

  </div>
</template>
<script>
  export default {
    name: 'TextSlotBar',
    props: {
      leftIcon: '',
      title: '',
      subtitle: '',
      rightIcon: ''
    },
    data: function () {
      return {}
    },
    computed: {},
    methods: {
      clickTitle () {
        this.$emit('clickTitle')
      },
      clickRight () {
        this.$emit('clickRight')
      }
    },
    mounted: function () {
    }
  }
</script>

<style lang='scss' scoped>
    img{
      width:auto;
      max-width:100%;
    }
    .list-item{
      display: flex;
      align-items: center;
      min-height:4rem;
      margin:0 .5rem;
      color:#75707B;
      border-bottom:1px solid #F1F1F1;

      .left-icon,.right-icon{
        width:2.3rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .content{
        flex:1;
        align-items: center;
        text-align:left;
        font-size:1rem;
        padding: 0 .5rem;
        display: flex;

        .title{
          flex:1;
          padding-left:.2rem;
          padding-right: .2rem;
        }
        .subtitle{
          color:#C2BEC9;
          font-size:.7rem;
        }
        .slotleft{
          width: 4rem;
          height: 4rem;
          display: flex;
        }
        .slotright{
          /*flex:1;*/
          font-size:.8rem;
          color:#C2BEC9;
          text-align: right;

          input{
            text-align:right;
            color:#C2BEC9;
          }
        }
      }
    }

</style>
