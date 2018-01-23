<template>
  <div class='pages ucSuggestions'>
      
      <div class="list">
          <div class="content">
            <textarea class="input" placeholder="请输入反馈内容" ref="content" v-model="content" @blur="CheckContent()"></textarea>
          </div>

          <div class="phoneNum">
            <input class="text input" placeholder="请输入手机号码" ref="phoneNum" v-model="phoneNum" @blur="CheckPhoneNum()"/>
          </div>

          <div class="tip">
            你的联系方式有助于我们沟通和解决问题
          </div>
      </div>

      <div :class="['create-suggestions',{active:formValid}]" @click="createsuggestions()">提交</div>
  </div>
</template>
<script>
  // import _ from 'lodash'
  import {mapState, mapActions} from 'vuex'
  import TextSlotBar from '../components/bar/TextSlotBar/'
  import {setTitle, countLength, trim} from '../utils/index'
  // import {suggestionsSave} from '../api/album'
  export default {

    data: function () {
      return {
        contentValid: false,
        content: '',
        bfcontent: '',
        contentMaxLength: 200,
        contentMinLength: 12,
        phoneNum: '',
        bfphoneNum: '',
        phoneNumMaxLength: 16,
        phoneNumMinLength: 7,
        phoneNumValid: true
      }
    },
    computed: {
      ...mapState({
        clientOnline: state => state.mqtt.clientOnline,
        clientBind: state => state.mqtt.clientBind,
        deviceOnline: state => state.mqtt.deviceOnline,
        WeixinReady: state => state.mqtt.WeixinReady
      }),
      isWeixinReady () {},
      formValid () {
        return this.contentValid && this.phoneNumValid
      }
    },
    watch: {
      isWeixinReady (isReady) {},
      content () {
        let contentTrim = trim(this.content)
        let contentLength = countLength(contentTrim)
        // 检查最小长度
        this.contentValid = (contentLength >= this.contentMinLength)
        // 检查最大长度
        if (contentLength <= this.contentMaxLength) {
          this.content = this.bfcontent = contentTrim
        } else {
          this.content = this.bfcontent
          this.tip('反馈内容最多允许输入' + this.contentMaxLength + '个字符')
        }
      },
      phoneNum () {
        let phoneNumTrim = this.phoneNum.toString().replace(/[^\d.]/img, '')
        let phoneNumLength = countLength(phoneNumTrim)
        // 检查最小长度
        this.phoneNumValid = (phoneNumLength >= this.phoneNumMinLength)
        // 检查最大长度
        if (phoneNumLength <= this.phoneNumMaxLength) {
          this.phoneNum = this.bfphoneNum = phoneNumTrim
        } else {
          this.phoneNum = this.bfphoneNum
          this.tip('手机号码最多允许输入' + this.phoneNumMaxLength + '个数字')
        }
      }
    },
    methods: {
      ...mapActions('mqtt', []),
      // 跳转
      to (router) {
        if (!router) return
        this.$router.push(router)
      },
      CheckContent () {
        let contentTrim = trim(this.content)
        let contentLength = countLength(contentTrim)
        if (contentTrim && contentLength < this.contentMinLength) {
          this.tip('反馈内容至少输入' + this.contentMinLength + '个字符')
        }
      },
      CheckPhoneNum () {
        let phoneNumTrim = trim(this.phoneNum)
        let valid = true
        if (phoneNumTrim) {
          // valid = checkPhoneNum(phoneNumTrim)
          var reg = /^\d{7,16}$/ // 十六位数字
          valid = reg.test(phoneNumTrim)
        }
        if (!valid) {
          this.tip('请输入正确手机号码')
        }
        this.phoneNumValid = valid
      },
      // 创建提交
      createsuggestions () {
        if (!this.formValid) return
        this.tip('意见反馈提交成功')
        this.content = this.phoneNum = ''
        let self = this
        setTimeout(() => {
          self.$router.go(-1)
        }, 1 * 1000)
      }
      // ,
      // // 切换自动播放微信消息
      // toggleState (suggestions, oldVal) {
      //   if (!this.clientOnline) {
      //     this.tip('请检查网络是否连接')
      //     return
      //   }
      //   let newsuggestions = _.cloneDeep(suggestions)
      //   newsuggestions.state = !newsuggestions.state
      //   suggestionsSave(newsuggestions).then(response => {
      //     if (response.data.errcode === 0) {
      //       this.getsuggestionsList()
      //     }
      //   })
      // }
    },
    beforeMount () {
      setTitle('意见反馈')
    },
    mounted: function () {
      console.log(TextSlotBar)
    },
    beforeRouteLeave (to, from, next) {
      // 导航离开该组件的对应路由时调用 都会触发停止“试听”
      // 可以访问组件实例 `this`
      if (this.content || this.phoneNum) { // 创建中途退出
        this.confirm('确定取消创建?', null, (ok) => {
          next(ok)
        })
        next(false)
      } else {
        next()
      }
    }
  }

</script>

<style lang='scss'>
  .ucSuggestions{
    z-index: 2;
    position: absolute;
    left: 0;
    bottom:0;      
    height:100%;
    width:100%;
    text-align: center;
    display:flex;
    flex-direction:column;
    background: #fff;
    display: flex;
    flex-direction: column;

    img{
      width:auto;
      max-width:100%;
    }

    .list{
      text-align: left;
      padding:.5rem;
      flex:1;
      background: #fff;
      overflow: scroll;
      &::-webkit-scrollbar {
          display: none;
      }
      -webkit-overflow-scrolling: touch;

      .input{
        width:100%;
        
        line-height:2rem;
        padding-left: .25rem;
        padding-right: .25em;
        background-color: #ffffff;
        border: 1px solid #cccccc;
        /*box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
        border-radius: 5px;
        */
        color: #A79EB6;
      }
      textarea{
        height:13rem;
        resize:none
      }
      .tip{
        color: #D0CBD8;
        font-size:.8rem;
        line-height:2rem;
      }
    }

    .create-suggestions{
      height: 3rem;
      line-height: 3rem;
      background:rgba(181, 133, 255, 1);
      color: #ccc;

      &.active {
        color: #fff;
        background: #b585ff;
      }
    }
  }

</style>
