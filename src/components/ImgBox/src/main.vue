<template>
  <div class='component ImgBox'>

    <div class="wrap">
      <div class="box">
          <div class="child">
              <img :src="imgUrl" @error="setErrorImg" :style="imgstyle" :class="[{gray: offLine}]">
          </div>
      </div>
    </div>

  </div>
</template>
<script>
  export default {
    name: 'ImgBox',
    props: {
      imgUrl: {
        type: String,
        default: ''
      },
      imgstyle: {
        type: String,
        default: ''
      },
      offLine: {
        type: Boolean,
        default: false
      }
    },
    data: function () {
      return {}
    },
    computed: {},
    methods: {
      setErrorImg (e) {
        e.target.src = 'static/images/uc-default-vatar.png'
      },
      computeHeight () {}
    },
    mounted: function () {
    }
  }

</script>

<style lang='scss' scoped>
  .wrap{
    width:100%;

    .box{
      padding-top:100%;
      overflow:hidden;
      /*display: flex;
      flex-direction: column;*/
      
      .child{
        margin-top:-100%;
        /*flex: 1;
        display: flex;
        flex-direction: column;*/

        img{
          border-radius: 100%;

          &.gray { 
              -webkit-filter: grayscale(100%);
              -moz-filter: grayscale(100%);
              -ms-filter: grayscale(100%);
              -o-filter: grayscale(100%);
              
              filter: grayscale(100%);
            
              filter: gray;
          }
        }
      }
    }
  }

</style>
