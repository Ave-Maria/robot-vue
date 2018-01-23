<template>
  <div class='pages ucUserInfo'>
    <div class="content" v-if="!loading">
        <div class = "line"></div>
        <div class="title">
            家庭成员可以接受故事机发来的语音消息
        </div>
        <div class="list">
            <div class="item" v-for="item in members">
              <ImgBox :imgUrl="item.headImgUrl" imgstyle="width:4rem;height:4rem;" style="height:5rem;"></ImgBox>
              <div class="nickname">{{item.nickname}}</div>
          </div>
        </div>
        
        <div class="classify">
            <TextSlotBar leftIcon="" rightIcon="" title="我在本群的昵称">
              <span slot="right">
                <!--<input ref="name" :value="myNickname" @keydown="bfCheckName"  @keyup="checkName" @blur="closeSetName($refs.name.value)" style="border:0;"/>-->
                <input ref="keyword" v-model="keyword"  @keyup.enter="$refs.keyword.blur()" @blur="closeSetName()" style="border:0;"/>
              </span>
            </TextSlotBar>

            <TextSlotBar rightIcon="static/images/rightIcon@2x.png" title="分享设备" @clickTitle="openSetting('share')" @clickRight="openSetting('share')"></TextSlotBar>
            
            <TextSlotBar rightIcon="static/images/rightIcon@2x.png" title="切换设备" @clickTitle="to({path:'ucSwitchDevice'})" @clickRight="to({path:'ucSwitchDevice'})"></TextSlotBar>
        </div>
      </div>
      
      <div class="loading" v-else>
        <Loading :show="loading" loadingText="加载中..."></Loading>
      </div>

      <div class="setting">
          <setShare :open="open" :myNickname='myNickname' :qrCodeUrl="qrCodeUrl" @close="close" v-if="setType === 'share'"></setShare>
      </div>
  </div>
</template>
<script>
  import {getFamilyGroup, updateNickname} from '../api/album'
  import {mapState} from 'vuex'
  import {countLength, setTitle} from '../utils/index'
  import TextSlotBar from '../components/bar/TextSlotBar/'
  import setShare from '../components/setting/setShare/'
  import Loading from '../components/Loading/'
  import ImgBox from '../components/ImgBox/'
  export default {
    data: function () {
      return {
        keyword: '', // 输入框内容
        bfkeyword: '', // 保存输入框之前内容
        loading: true, // 数据加载中
        members: [], // 家庭成员
        myNickname: '', // 昵称
        qrCodeUrl: '', // 家庭圈二维码
        open: false,
        setType: ''
        // ,
        // keydownName: ''
      }
    },
    computed: {
      ...mapState({
        WeixinReady: state => state.mqtt.WeixinReady,
        nameLength: state => state.setting.nameLength
      }),
      isWeixinReady () {
        if (this.WeixinReady) {
          this.familyGroupGet()
          return
        }
      }
    },
    watch: {
      isWeixinReady (isReady) {},
      keyword () {
        // 检查
        if (!this.isOverLength()) {
          this.bfkeyword = this.keyword
        } else {
          this.keyword = this.bfkeyword
          this.tip('最多允许输入8个汉字或16个字符')
        }
      }
    },
    filters: {
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
      // 获取列表
      familyGroupGet (animate = true) {
        if (animate) this.loading = true
        getFamilyGroup().then(response => {
          response = response.data
          if (response.errcode === 0) {
            this.members = response.data.members
            this.bfkeyword = this.keyword = this.myNickname = response.data.myNickname
            this.qrCodeUrl = response.data.qrCodeUrl
          }
          if (animate) this.loading = false
        }).catch(error => {
          console.log(error)
          if (animate) this.loading = false
        })
      },
      // 开启设置
      openSetting (type) {
        if (!type) return
        this.setType = type
        this.open = true
      },
      close () {
        this.setType = ''
        this.open = false
      },
      // bfCheckName (e) {
      //   let dom = this.$refs.name
      //   let name = dom.value
      //   let length = countLength(name)
      //   // 检查
      //   if (this.nameLength >= length) {
      //     this.keydownName = name
      //   }
      // },
      // // 检查名字
      // checkName (e) {
      //   let dom = this.$refs.name
      //   let name = dom.value
      //   let length = countLength(name)
      //   // 检查
      //   if (length > this.nameLength) {
      //     dom.value = this.keydownName
      //     this.tip('最多允许输入8个汉字或16个字符')
      //     return false
      //   }
      //   // 回车键提交保存数据
      //   if (e.keyCode === 13) {
      //     // this.closeSetName(name)
      //     dom.blur()
      //   }
      // },
      // 判断是否超过长度
      isOverLength () {
        let length = countLength(this.keyword)
        // 检查
        return length > this.nameLength
      },
      // 设置名字
      closeSetName () {
        let nickname = this.keyword
        if (!nickname) {
          this.$refs.keyword.focus()
          this.tip('请填写昵称哦!')
          return
        }
        updateNickname({nickname}).then(response => {
          response = response.data
          if (response.errcode !== 0) {
            this.tip('设置失败,请重试！')
          } else {
            this.familyGroupGet(false)
          }
        }).catch(error => {
          console.log(error)
          this.tip('设置失败,请重试！')
        })
      }
    },
    beforeMount () {
      setTitle('家庭成员')
    },
    mounted: function () {
      console.log(TextSlotBar)
      console.log(setShare)
      console.log(Loading)
      console.log(ImgBox)
    }
  }

</script>

<style lang='scss' scoped>
  .ucUserInfo{
    height:100%;
    width:100%;
    color: #FBFBFC;
    background: #F2F2F4;
    text-align: center;

    img{
      width:auto;
      max-width:100%;
    }
    .line{
      height: .5rem;
      background:#F2F2F4;
    }
    .title{
      font-size: .8rem;
      padding:1rem 0;
      color:#C8C8C8;
      background:#fff;
    }

    .list{
      overflow:hidden;
      background: #fff;
      border-bottom: 1px solid #F1F1F1;
      padding-bottom: 1rem;

      .item {
          width: 25%;
          float: left;
          margin: .5rem 4.16%;

          .nickname{
            color: #75707B;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: -.5rem;
          }
      }
    }
    .loading{
      margin-top:2rem;
      background:#fff;
      color:#C8C8C8;
    }
    .classify{
      background: #fff;
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
