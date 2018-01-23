<template>
  <div class='pages welcome' @click="toIndex">
    <Flexbox orient='vertical' align="center" justify="space-between"  class='welcome-container' >
      <FlexboxItem>
          <div class='welcome-title'>
            <img src="static/images/cloud@2x.png">
          </div>
      </FlexboxItem>
      
      <FlexboxItem class='welcome-des'>
          <h2>玩具综合智能云服务</h2>
          <p>配网，设备管理，语音留言，儿童内容推送，应有尽有，让你乐在其中。</p>
      </FlexboxItem>

      <FlexboxItem class='welcome-footer'>
          <div class="">
              <img src="static/images/aispeechLogo@2x.png">
              <p>思必驰信息科技有限公司</p>
              <a href="http://www.aispeech.com">www.aispeech.com</a>
          </div>
      </FlexboxItem>
    </Flexbox>
  </div>
</template>
<script>
  import {setTitle} from '../utils/index'
  import Flexbox from '../components/flexbox/Flexbox/'
  import FlexboxItem from '../components/flexbox/FlexboxItem/'
  export default {
    data: function () {
      return {}
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
      setTitle('主页')
    },
    mounted: function () {
      console.log(Flexbox)
      console.log(FlexboxItem)
    }
  }

</script>

<style lang='scss' scoped>
  body{
    height:100%;
  }

  .welcome{
    color: #FBFBFC;
    background: #AF7BFF;
    text-align: center;
    height:100%;
    position: absolute;
    z-index: 2;
    overflow:hidden;

    .welcome-container{
      height: 100%;
    }

    .welcome-title{
      img{
        max-width:100%;
        padding: 1rem;
      }
    }

    .welcome-des{
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
