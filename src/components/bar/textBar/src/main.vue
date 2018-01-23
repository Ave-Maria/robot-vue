<template>
  <div class='component TextBar'>

      <div class="list-item">
          <div class="left-icon" v-if="leftIcon" ><img :src="leftIcon"></div>
          <div class="title" @click="clickTitle()">
          {{title}} 
          <span class="subtitle" v-if="subtitle">{{subtitle}}</span>
          </div>
          <div class="right-icon"  v-if="rightIcon" @click="clickRight()"><img :src="rightIcon"></div>
      </div>

  </div>
</template>
<script>
  export default {
    name: 'TextBar',
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
      .title{
        flex:1;
        text-align:left;
        font-size:1rem;
        padding: 0 .5rem;

        .subtitle{
          float:right;
          font-size:.8rem;
          color:#C2BEC9;
        }
      }
    }

</style>
