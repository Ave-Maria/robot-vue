<template>
  <div class='pages ucUserInfo'>

      <div class="list">
          <TextSlotBar leftIcon="" rightIcon="static/images/rightIcon@2x.png" title="设置头像" @clickRight="openSetting('avatar')">
            <div slot="right"><ImgBox :imgUrl="avatar" imgstyle="width:4rem;height:4rem;" @click.native="openSetting('avatar')"></ImgBox></div>
          </TextSlotBar>
      </div>
      
      <div class="classify">
          <TextSlotBar leftIcon="" rightIcon="" title="宝宝信息">
            <span slot="right">
              <!--<input ref="name" :value="name" @keydown="keydownName = $refs.name.value"  @keyup="checkName" @blur="closeSetName($refs.name.value)" style="border:0;"/>-->
              <!--<input ref="name" :value="name" @keydown="bfCheckName"  @keyup="checkName" @blur="closeSetName($refs.name.value)" style="border:0;"/>-->
              <input ref="keyword" v-model="keyword"  @keyup.enter="$refs.keyword.blur()" @blur="closeSetName()" style="border:0;"/>
            </span>
          </TextSlotBar>

          <TextSlotBar rightIcon="static/images/downIcon@2x.png" title="宝宝性别" @clickRight="openSetting('sex')">
            <span slot="right" @clickRight="openSetting('sex')">{{sex | sexFormat}}</span>
          </TextSlotBar>

          <TextSlotBar  title="宝宝生日" rightIcon="static/images/downIcon@2x.png" @clickRight="showDatetime = true">
            <span slot="right" @click="showDatetime = true">{{defaultBirth | birthFormat}}</span>
          </TextSlotBar>
      </div>

      <div class="setting">
          <SetAvatar :open="open" :avatar="avatar" @close="closeSetAvatar" v-if="setType === 'avatar'"></SetAvatar>

          <SetSex :open="open" :sexOption="sexOption" :sex="sex" @close="closeSetSex" v-if="setType === 'sex'"></SetSex>

          <div style="display:none;">
            <datetime :value="defaultBirth" :show.sync="showDatetime" year-row="{value}年" month-row="{value}月" day-row="{value}日" :start-date="startDate"  :end-date="endDate" @on-change="closeSetBirth"></datetime>
          </div>
      </div>
  </div>
</template>
<script>
  import Datetime from 'vux/src/components/datetime/'
  import {mapState, mapActions} from 'vuex'
  import {setTitle, countLength} from '../utils/index'
  import TextSlotBar from '../components/bar/TextSlotBar/'
  import NoBind from '../components/NoBind/'
  import SetAvatar from '../components/setting/SetAvatar/'
  import SetSex from '../components/setting/SetSex/'
  import SetBirth from '../components/setting/SetBirth/'
  import ImgBox from '../components/ImgBox/'
  export default {
    components: {
      Datetime
    },
    data: function () {
      return {
        keyword: '', // 输入框内容
        bfkeyword: '', // 保存输入框之前内容
        open: false,
        setType: '',
        showDatetime: false
        // ,
        // keydownName: ''
      }
    },
    computed: {
      ...mapState({
        avatar: state => state.setting.avatar,
        name: state => state.setting.name,
        sex: state => state.setting.sex,
        birth: state => state.setting.birth,
        sexOption: state => state.setting.sexOption,
        nameLength: state => state.setting.nameLength
      }),
      defaultBirth () {
        let birth = this.birth ? this.birth * 1000 : new Date().getTime()
        return birth.toString()
      },
      startDate () {
        var now = new Date()
        return (now.getFullYear() - 20) + '-' + (now.getMonth() + 1) + '-' + now.getDate()
      },
      endDate () {
        let now = new Date()
        return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
      }
    },
    watch: {
      keyword () {
        // 检查
        // if (!this.isOverLength()) {
        //   this.bfkeyword = this.keyword
        // } else {
        //   this.keyword = this.bfkeyword
        //   this.tip('最多允许输入8个汉字或16个字符')
        // }
        let keywordTrim = this.keyword.toString().replace(/[^a-zA-Z\u4E00-\u9FA5]/g, '')
        let keywordLength = countLength(keywordTrim)
        // 检查
        if (keywordLength <= this.nameLength) {
          this.keyword = this.bfkeyword = keywordTrim
        } else {
          this.keyword = this.bfkeyword
          this.tip('最多允许输入8个汉字或16个字符')
        }
      }
    },
    filters: {
      sexFormat: (sex) => {
        return sex === 0 ? '公主' : '王子'
      },
      birthFormat: (birth) => {
        if (!birth) return
        let d = new Date(birth * 1)
        let dateStr = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日'
        return dateStr
      }
    },
    methods: {
      ...mapActions('setting', [
        'setAvatar',
        'setName',
        'setSex',
        'setBirth'
      ]),
      setErrorImg (e) {
        e.target.src = 'static/images/uc-default-vatar.png'
      },
      // 跳转
      to (router) {
        if (!router) return
        this.$router.push(router)
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
      // 设置头像
      closeSetAvatar (avatarData) {
        this.close()
        if (avatarData) {
          this.setAvatar(avatarData)
        }
        // this.close()
        // if (avatarData && avatarData.data.url) {
        //   this.setAvatar(avatarData.data.url)
        // }
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
      //     this.closeSetName(name)
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
          this.tip('请填写宝宝信息哦!')
          return
        }
        this.setName(nickname)
      },
      // 设置性别
      closeSetSex (sexData) {
        this.close()
        if (!sexData) {
          return
        }
        this.setSex(sexData.value)
      },
      // 设置生日
      closeSetBirth (birthData) {
        if (!birthData) {
          return
        }
        let birthDate = new Date(birthData)
        let birthTime = Math.round(birthDate.getTime() / 1000) // 转为时间戳
        this.setBirth(birthTime)
      }

    },
    beforeMount () {
      setTitle('驰小宝-宝宝信息')
    },
    mounted: function () {
      this.bfkeyword = this.keyword = this.name
      console.log(TextSlotBar)
      console.log(NoBind)
      console.log(SetAvatar)
      console.log(SetSex)
      console.log(SetBirth)
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
    padding-top: .5rem;

    img{
      width:auto;
      max-width:100%;
    }

    .header{
      height:11rem;
      padding:1rem;
      background: linear-gradient(#8e46ff, #b483ff);
      display: flex;
      align-items: center;

      .left,.vatar,.right{
        flex:1;
        height:100%;
      }
      .vatar{
        padding:0 1rem;

        .name{
          font-size:1rem;
        }
      }
      .right{
        text-align: right;
      }
    }

    .list{
      background: #fff;
      margin-bottom:.5rem;
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
