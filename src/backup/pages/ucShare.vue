<template>
  <div class='pages ucShare'>
      <div class="content" v-if="!loading">
          <div class="header">
              <div class="avatar">
                  <ImgBox :imgUrl="headImgUrl" imgstyle="width:7rem;height:7rem;" style="height:7rem;"></ImgBox>
                  <div class="name">{{nickname}}</div>
                  <div class="name">邀请您加入<span>{{wechatName}}</span>家庭群聊</div>
              </div>
          </div>

          <div class="classify" >
              <ImgBox :imgUrl="qrCodeUrl" imgstyle="width:12rem;height:12rem;border-radius:0;" style="height:12rem;"></ImgBox>
              <div>长按识别二维码关注公众号即可绑定设备</div>
          </div>
      </div>
      
      <div class="loading" v-else>
        <Loading :show="loading" loadingText="加载中..."></Loading>
      </div>
  </div>
</template>
<script>
  import {setTitle} from '../utils/index'
  import {share, parseURI} from '../api/album'
  import TextBar from '../components/bar/TextBar/'
  import ImgBox from '../components/ImgBox/'
  import Loading from '../components/Loading/'
  export default {
    data: function () {
      return {
        loading: true,
        qrCodeUrl: '',
        wechatName: '',
        nickname: '',
        headImgUrl: ''
      }
    },
    computed: {
    },
    methods: {
      setErrorImg (e) {
        e.target.src = 'static/images/uc-default-vatar.png'
      },
      // 跳转
      to (router) {
        if (!router) return
        this.$router.push(router)
      },
      // 跳转
      getShare () {
        let urlParams = parseURI()
        share(urlParams.params).then(response => {
          response = response.data
          if (response.errcode === 0) {
            this.qrCodeUrl = response.data.qrCodeUrl
            this.wechatName = response.data.wechatName
            this.nickname = response.data.nickname
            this.headImgUrl = response.data.headImgUrl
          }
          this.loading = false
        })
      }
    },
    beforeMount () {
      this.getShare()
      setTitle('分享设备')
    },
    mounted: function () {
      console.log(TextBar)
      console.log(ImgBox)
      console.log(Loading)
    }
  }

</script>

<style lang='scss' scoped>
  .ucShare{
    height: 100%;
    width: 100%;
    color: #FBFBFC;
    background: #fff;
    text-align: center;
    position: fixed;
    z-index: 4;
    top: 0;
    left: 0;

    img{
      width:auto;
      max-width:100%;
    }

    .header{
      min-height:11rem;
      padding: .5rem 1rem;
      background: linear-gradient(#8e46ff, #b483ff);
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left,.right{
        width:4rem;
      }
      .avatar{
        flex:1;
        .name{
          font-size:1rem;
        }
        img{
          border-radius: 100%;
        }
      }
      .right{
        text-align: right;
        align-self: flex-start;
      }
    }
    .loading{
      margin-top:2rem;
      background:#fff;
      color:#C8C8C8;
    }
    .list{
      background: #fff;
      margin-bottom:.5rem;
    }
    .classify{
      margin-top:3rem;
      background: #fff;
      color:#C8C8C8;
    }

    .no-bind{
      position: fixed;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      color: #75707B;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .text{
        line-height:5rem;
        color: rgba(117, 111, 123, 0.5);
      }
      .button{
        width: 70%;
        padding: .5rem .7rem;
        margin: 1rem 0;
        border: 0;
        border-radius: 1rem;
        background: #B585FF;
        color: #fff;
        margin: 0 auto;
      }
    }
  }

</style>
