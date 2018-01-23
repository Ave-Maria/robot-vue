<template>
  <div class='pages ucUserInfo'>

      <div class="list" @click="to({path:'/ucUserInfo'})">
          <TextSlotBar leftIcon="" rightIcon="static/images/rightIcon@2x.png" :title="birth | birthFormat" @clickRight="to({path:'/ucUserInfo'})">
            <div slot="left">
              <ImgBox :imgUrl="avatar" imgstyle="width:4rem;height:4rem;"></ImgBox>
            </div>
            <div slot="right">修改信息</div>
          </TextSlotBar>
      </div>
      
      <div class="list">
          <TextSlotBar title="闹钟设置" rightIcon="static/images/rightIcon@2x.png" @clickRight="to({path:'/ucAlarmIndex'})" @clickTitle="to({path:'/ucAlarmIndex'})"></TextSlotBar>
      </div>

      <div class="list">
          <TextSlotBar rightIcon="static/images/rightIcon@2x.png" title="耳灯亮度" @clickRight="openSetting('earlamp')"  @clickTitle="openSetting('earlamp')">
            <span slot="right" @click="openSetting('earlamp')">{{earlampOption[earlamp].name}}</span>
          </TextSlotBar>

          <TextSlotBar rightIcon="static/images/rightIcon@2x.png" title="音量大小" @clickRight="openSetting('volume')" @clickTitle="openSetting('volume')">
            <span slot="right" @click="openSetting('volume')">{{volume * 10}}%</span>
          </TextSlotBar>

          <TextSlotBar rightIcon="static/images/rightIcon@2x.png" title="提醒设置" @clickRight="to({path:'/ucSelectTip'})" @clickTitle="to({path:'/ucSelectTip'})">
            <span slot="right" @click="to({path:'/ucSelectTip'})"></span>
          </TextSlotBar>

          <TextSlotBar rightIcon="static/images/rightIcon@2x.png" title="开关控制" @clickRight="openUucSwitch()" @clickTitle="openUucSwitch()"></TextSlotBar>
      </div>

      <div class="list">  
          <TextSlotBar rightIcon="static/images/rightIcon@2x.png" title="定时关机" @clickRight="openSetting('poweroff')" @clickTitle="openSetting('poweroff')">
            <span slot="right" @click="openSetting('poweroff')">{{poweroffOption[poweroff].name}}</span>
          </TextSlotBar>

          <TextSlotBar title="故事机电量">
            <span slot="right" :class="{textRed:(battery && battery <= 10)}">{{deviceBattery}}</span>
          </TextSlotBar>

          <TextSlotBar rightIcon="static/images/rightIcon@2x.png" title="家庭成员" @clickRight="to({path:'/ucFamilyGroup'})" @clickTitle="to({path:'/ucFamilyGroup'})">
          </TextSlotBar>
      </div>

      <div class="classify">
          <TextSlotBar rightIcon="static/images/rightIcon@2x.png" title="关于" @clickRight="to({path:'/ucAbout'})" @clickTitle="to({path:'/ucAbout'})">
          </TextSlotBar>

          <TextSlotBar rightIcon="static/images/rightIcon@2x.png" title="恢复出厂设置" @clickRight="clearnSetting()"  @clickTitle="clearnSetting()">
          </TextSlotBar>

          <TextSlotBar rightIcon="static/images/rightIcon@2x.png" title="意见反馈" @clickRight="to({path:'/ucSuggestions'})" @clickTitle="to({path:'/ucSuggestions'})">
          </TextSlotBar>
      </div>

      <div class="setting">
          <!--<SetAvatar :open="open" :avatar="avatar" @close="closeSetAvatar" v-if="setType === 'avatar'"></SetAvatar>-->

          <SetSex :open="open" :sexOption="sexOption" :sex="sex" @close="closeSetSex" v-if="setType === 'sex'"></SetSex>

          <div style="display:none;">
            <datetime :value="defaultBirth" :show.sync="showDatetime" year-row="{value}年" month-row="{value}月" day-row="{value}日" @on-change="closeSetBirth"></datetime>
          </div>

          <SetEarlamp :open="open" :earlampOption="earlampOption" :earlamp="earlamp" @close="closeSetEarlamp" v-if="setType === 'earlamp'"></SetEarlamp>

          <SetPoweroff :open="open" :poweroffOption="poweroffOption" :poweroff="poweroff" @close="closeSetPoweroff" v-if="setType === 'poweroff'"></SetPoweroff>
          
          <SetVolume :open="open" :volume="volume" @close="closeSetVolume" v-if="setType === 'volume'"></SetVolume>
      </div>
  </div>
</template>
<script>
  import Datetime from 'vux/src/components/datetime/'
  import {mapState, mapActions} from 'vuex'
  import TextSlotBar from '../components/bar/TextSlotBar/'
  import NoBind from '../components/NoBind/'
  import SetAvatar from '../components/setting/SetAvatar/'
  import SetSex from '../components/setting/SetSex/'
  import SetBirth from '../components/setting/SetBirth/'
  import SetEarlamp from '../components/setting/SetEarlamp/'
  import SetVolume from '../components/setting/SetVolume/'
  import SetPoweroff from '../components/setting/SetPoweroff/'
  import {setTitle} from '../utils/index'
  import {earlampOption, poweroffOption} from '../utils/const'
  import ImgBox from '../components/ImgBox/'
  export default {
    components: {
      Datetime
    },
    data: function () {
      return {
        earlampOption,
        poweroffOption,
        open: false,
        setType: '',
        showDatetime: false
      }
    },
    computed: {
      ...mapState({
        clientOnline: state => state.mqtt.clientOnline,
        clientBind: state => state.mqtt.clientBind,
        deviceOnline: state => state.mqtt.deviceOnline,
        deviceStatus: state => state.mqtt.deviceStatus,
        poweroff: state => state.mqtt.poweroff,
        earlamp: state => state.mqtt.earlamp,
        volume: state => state.mqtt.volume,
        battery: state => state.mqtt.battery,
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
      deviceBattery () {
        return (!this.deviceOnline || this.battery === 0) ? '故事机不在线' : (this.battery ? this.battery + '%' : '')
      }
    },
    filters: {
      sexFormat: (sex) => {
        return sex === 0 ? '公主' : '王子'
      },
      birthFormat: (birth) => {
        if (!birth) return ''
        let bitrthDate = new Date(birth * 1000)
        let nowDate = new Date()
        let diffMonth = (nowDate.getFullYear() - bitrthDate.getFullYear()) * 12 + (nowDate.getMonth() - bitrthDate.getMonth())
        let y, m
        y = Math.floor(diffMonth / 12)
        m = Math.floor(diffMonth - 12 * y)
        return y + '年' + m + '个月'
      }
    },
    methods: {
      ...mapActions('setting', [
        'setAvatar',
        'setName',
        'setSex',
        'setBirth',
        'userSettingClean'
      ]),
      ...mapActions('mqtt', [
        'clearnToySetting',
        'toggleLock',
        'setPoweroff',
        'setVolume',
        'cleanWeixinConfig',
        'getVolume',
        'getEarlamp',
        'updateEarlamp',
        'getScreen'
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
        // debugger
        this.close()
        if (avatarData) {
          this.setAvatar(avatarData)
        }
      },
      // 设置名字
      closeSetName (nameData) {
        if (!nameData) {
          this.$refs.name.focus()
          this.tip('请填写宝宝信息哦!')
          return
        }
        this.setName(nameData)
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
      },

      // 设置音量大小
      closeSetVolume () {
        // console.log('volumeData', volumeData)
        this.close()
        // if (volumeData !== undefined && volumeData !== null) {
        //   this.setVolume(volumeData)
        // }
      },
      // 恢复出厂设置
      clearnSetting () {
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        if (!this.clientBind) {
          this.tip('您还没有绑定设备哦')
          return
        }
        if (this.deviceStatus) {
          this.tip('故事机正在升级')
          return
        }
        if (!this.deviceOnline) {
          this.tip('设备不在线')
          return
        }
        let self = this
        this.confirm('恢复出厂设置将清除故事机除网络之外的其他设置,你确定要这么做吗?', null, (ok) => {
          if (ok) {
            this.userSettingClean()
            this.clearnToySetting()
            this.cleanWeixinConfig()
            // 关于设置
            self.earlamp = 3
          }
        })
      },
      // 设置定时关机
      closeSetPoweroff (poweroffData) {
        this.close()
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        if (!this.clientBind) {
          this.tip('您还没有绑定设备哦')
          return
        }
        if (this.deviceStatus) {
          this.tip('故事机正在升级')
          return
        }
        if (!this.deviceOnline) {
          this.tip('设备不在线')
          return
        }
        if (!poweroffData) {
          return
        }
        this.setPoweroff(poweroffData)
      },
      // 设置耳灯亮度
      closeSetEarlamp (earlampData) {
        this.close()
        if (earlampData && earlampData.num) this.updateEarlamp(earlampData.num)
        // if (!this.clientOnline) {
        //   this.tip('请检查网络是否连接')
        //   return
        // }
        // if (!this.clientBind) {
        //   this.tip('您还没有绑定设备哦')
        //   return
        // }
        // if (this.deviceStatus) {
        //   this.tip('故事机正在升级')
        //   return
        // }
        // if (!this.deviceOnline) {
        //   this.tip('设备不在线')
        //   return
        // }
        // if (!earlampData) {
        //   return
        // }
        // // this.setEarlamp(earlampData.num)
        // let self = this
        // updateEarLampBrightness({brightness: earlampData.num}).then(response => {
        //   if (response.data.errcode === 0) {
        //     self.earlamp = earlampData.num
        //   }
        // })
      },
      openUucSwitch () {
        this.getScreen()
        this.to({path: '/ucSwitch'})
      }
    },
    beforeMount () {
      setTitle('驰小宝-设置')
    },
    mounted: function () {
      this.getVolume()
      this.getEarlamp()
      console.log(TextSlotBar)
      console.log(NoBind)
      console.log(SetAvatar)
      console.log(SetSex)
      console.log(SetBirth)
      console.log(SetEarlamp)
      console.log(SetVolume)
      console.log(SetPoweroff)
      console.log(ImgBox)
    }
  }

</script>

<style lang='scss'>
  .ucUserInfo{
    height:100%;
    width:100%;
    color: #FBFBFC;
    background: #F2F2F4;
    text-align: center;
    padding-top: .5rem;

    .textRed{
      color:#F00;
    }

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
