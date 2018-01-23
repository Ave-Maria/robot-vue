<template>
  <div class='components VoiceRecord'>
    <div class='record-time'>
      {{createdTime}}
    </div>

    <div class='record-input record-content'>
      <div class="record-text">
        <div class="triangle triangle-right"></div>
        <div class="text">{{input}}</div>
      </div>

      <div class="record-icon ">
        <ImgBox :imgUrl="inputImgUrl" imgstyle="width:3rem;height:3rem;" style="height:3rem;"></ImgBox>
      </div>
    </div>

    <div class='record-output record-content'>
      <div class="record-icon ">
        <ImgBox :imgUrl="outputImgUrl" imgstyle="width:3rem;height:3rem;" style="height:3rem;"></ImgBox>
      </div>

      <div class="record-text ">
        <div class="triangle triangle-left"></div>
        <div class="text">{{output}}</div>
      </div>
    </div>
    
    <divider class="white-line"/>
  </div>
</template>
<script>
  import ImgBox from '../../ImgBox/'
  import Divider from '../../Divider/'
  export default {
    name: 'VoiceRecord',
    props: {
      createdTime: {
        type: String,
        default: 0
      },
      input: {
        type: String,
        default: ''
      },
      output: {
        type: String,
        default: ''
      },
      inputImgUrl: {
        type: String,
        default: ''
      },
      outputImgUrl: {
        type: String,
        default: ''
      }
    },
    data: function () {
      return {
      }
    },
    methods: {
      setErrorImg (e) {
        e.target.src = 'static/images/uc-default-vatar.png'
      }
    },
    computed: {

    },
    filters: {
    },
    mounted: function () {
      console.log(ImgBox)
      console.log(Divider)
    }
  }

</script>
<style lang="scss">
  .VoiceRecord{
    clear: both;
    padding:1rem 1rem 0 1rem;

    &>div{
      margin-bottom:1rem;
    }
    .white-line{
      background-color:#E0E0E0;
    }
    /*时间*/
    .record-time{
      font-size:.8rem;
      color: #A9A5AD;
    }

    /*公共css*/
    .record-content{
      clear:both;
      display: flex;

      .record-icon {
        width: 3rem;
      }
      .record-text{
        flex: 1;
        position: relative;

        .text{
          display: inline-block;
          padding: .75rem;
          border-radius:.5rem;
        }
      }
      /*用户*/
      &.record-input{
        .record-text{
          margin-left:4rem;
          margin-right:.5rem;
          text-align: right;
          color:#fff;          
          .text{
            background: #77BDFF;
          }
          .triangle {
            position: absolute;
            right: -.45rem;
            top: .75rem;
            width: 0;
            height: 0;
            border-top: .25rem solid transparent;
            border-left: .5rem solid #77BDFF;
            border-bottom: .25rem solid transparent;
          }
        }
      }
      /*机器*/
      &.record-output{
        .record-text{
          margin-right:4rem;
          margin-left:.5rem;
          text-align: left;
        }
        .text{
          background: #EEEEEE;
        }
        .triangle {
          position: absolute;
          left: -.5rem;
          top: .75rem;
          width: 0;
          height: 0;
          border-top: .25rem solid transparent;
          border-right: .5rem solid #EEEEEE;
          border-bottom: .25rem solid transparent;
        }
      }
    }
  }
</style>
