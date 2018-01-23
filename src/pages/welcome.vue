<template>
  <div class='pages welcome' @click="toIndex">
    <Flexbox orient='vertical' align="center" justify="space-between"  class='welcome-container' >
      <FlexboxItem>
          <p class='welcome-title'>
            <img src="static/images/cloud@2x.png">
          </p>
      </FlexboxItem>
      
      <FlexboxItem class='welcome-des'>
          <p style="height: 5rem;">
            <ImgBox imgUrl="http://www.xfyun.cn/hera/img/speaker-photo/small/xiaoyu.png" imgstyle="width:5rem;height:5rem;padding-bottom:.5rem;background:#fff;"></ImgBox>
          </p>
          <p>梦部落</p>
      </FlexboxItem>

      <FlexboxItem class='welcome-counter'>
        <p>
          <flexbox>
            <flexbox-item >
              <div class="tip tip-left">题目数量</div>
            </flexbox-item>
            <flexbox-item >
              <div class="tip tip-right"><span>{{range}}</span>题</div>
            </flexbox-item>
          </flexbox>

          <flexbox>
            <flexbox-item >
              <div class="tip range">
                <range v-model="range" :min="5" :max="10" ></range>
              </div>
            </flexbox-item>
          </flexbox>
        </p>
      </FlexboxItem>

      <FlexboxItem class='welcome-footer'>
          <p>
            <x-button :gradients="['#c9a9fc', '#c9a9fc']" style="border-radius:1rem;">去出题</x-button>
          </p>
      </FlexboxItem>
    </Flexbox>
  </div>
</template>
<script>
  import {setTitle} from '../utils/index'
  import Flexbox from '../components/flexbox/Flexbox/'
  import FlexboxItem from '../components/flexbox/FlexboxItem/'
  import ImgBox from '../components/ImgBox/'
  import {Range, Grid, GridItem, XButton} from 'vux'
  export default {
    components: {
      XButton,
      Grid,
      GridItem,
      Range
    },
    data: function () {
      return {
        range: 0
      }
    },
    computed: {},
    methods: {
      // 跳转专辑详情
      toIndex () {
        // this.$router.push({
        //   path: '/'
        // })
      }
    },
    beforeMount () {
      setTitle('心有灵犀')
    },
    mounted: function () {
      console.log(Flexbox)
      console.log(FlexboxItem)
      console.log(ImgBox)
    }
  }

</script>

<style lang='scss' scoped>
  .welcome{
    text-align: center;
    height:100%;

    .welcome-container{
      height: 100%;
    }

    .welcome-title{
      text-align: center;
      img{
        max-width:80%;
        padding: 0rem;
      }
    }
    .welcome-counter{
      &>p{
        background:rgba(255,255,255,.25);
        margin: 0 3rem;
        padding: 1rem;
        border-radius: .25rem;
      }
      .tip{
        color:#fff;
      }
      .tip-right{
        text-align:right;
      }
      .range{
        margin:1rem 0;
      }
    }

    .welcome-des{
      color:#fff;
      text-align: center;
      padding:0 4rem;
    }

    .welcome-footer{
      text-align: center;
      padding:0 3rem;

      p{
        margin:0;
      }
      img{
        max-height:100%;
        width:35%;
      }
      a{
        color:#fff;
      }
    }
  }

</style>
