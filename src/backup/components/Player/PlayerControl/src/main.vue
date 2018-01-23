<template>
  <div class="component PlayerControl">
      <div class="setting-container">
          <div class="setting-item setting-volume">
            <img src="static/images/popVolume-n@2x.png" @click="isOpenVolumn = true">
          </div>
          <div class="setting-item setting-earlamp">
            <img src="static/images/earlamp-n@2x.png" @click="GetEarLamp()">
          </div>
          <div class="setting-item setting-lock">
            <img src="static/images/lock-n@2x.png" @click="isOpenLock = true">
          </div>
      </div>

      <div class="progress-container">
          <div class="duration-played-time">
              {{duration | formatTime}}
          </div>
          <div class="duration-progress">
            <range disabled :value="playerProcess" :max="100" :min="0" :step="1"></range>
          </div>
          <div class="duration-total-time">
              {{totalDuration | formatTime}}
          </div>
      </div>

      <div class="controler-button">
          <!--播放模式按钮-->
          <div class="button-item">
            <img class="looper" :src="curmodelIcon" @click="toggleCurmodel">
          </div>
          <!--上一首按钮-->
          <div class="button-item">
            <img class="pre-song" src="static/images/PopUpSong@2x.png" @click="playingPrev">
          </div>
          <!--播放暂停按钮-->
          <div class="button-item">
            <img class="play-pause" :src="isPlayingIcon" @click="togglePlayResume">
          </div>
          <!--下一首按钮-->
          <div class="button-item">
            <img class="next-song" src="static/images/PopNextSong@2x.png" @click="playingNext">
          </div>
          <!--收藏按钮-->
          <div class="button-item">
            <img class="like" :src="currentTrackIsfavIcon" @click="toggleCurrentTrackIsfav">
          </div>
      </div>

      <PlayerVolume v-if="isOpenVolumn" :isOpenVolumn.sync="isOpenVolumn"></PlayerVolume>

      <SetEarlamp :open="isOpenEarlamp" :earlampOption="earlampOption" :earlamp="earlamp" @close="closeSetEarlamp"></SetEarlamp>
      
      <SetLock :open="isOpenLock" :lockOption="lockOption" :lock="lock" @close="closeSetLock"></SetLock>
  </div>
</template>
<script>
  import {mapActions, mapState} from 'vuex'
  import {earlampOption, lockOption} from '../../../../utils/const'
  // import {timeformat} from '../../../../utils/index'
  import PlayerVolume from '../../PlayerVolume/'
  import SetEarlamp from '../../../../components/setting/SetEarlamp/'
  import SetLock from '../../../../components/setting/SetLock/'
  import { Range } from 'vux'
  export default {
    name: 'PlayerControl',
    props: {},
    components: {
      Range
    },
    data: function () {
      return {
        isOpenVolumn: false, // 打开音量
        isOpenEarlamp: false, // 打开耳灯
        isOpenLock: false, // 打开童锁
        earlampOption,
        lockOption
      }
    },
    methods: {
      ...mapActions('mqtt', [
        'playingPrev',
        'toggleCurmodel',
        'togglePlayResume',
        'playingNext',
        'toggleCurrentTrackIsfav',
        'toggleLock',
        'getEarlamp',
        'updateEarlamp'
      ]),
      // 获取耳灯亮度
      GetEarLamp () {
        this.getEarlamp()
        this.isOpenEarlamp = true
      },
      // 设置耳灯亮度
      closeSetEarlamp (earlampData) {
        this.isOpenEarlamp = false
        if (earlampData === undefined) {
          return
        }
        this.updateEarlamp(earlampData.num)
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
        // let self = this
        // updateEarLampBrightness({brightness: earlampData.num}).then(response => {
        //   if (response.data.errcode === 0) {
        //     self.earlamp = earlampData.num
        //   }
        // })
      },
      // 切换童锁开关
      closeSetLock (newVal, oldVal) {
        this.isOpenLock = false
        if (newVal === undefined) {
          return
        }
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
        // 切换童锁开
        if (newVal) {
          this.confirm('开启童锁后,小驰上的按键功能将失效。你确定要这样做吗?', null, (ok) => {
            if (ok) {
              this.toggleLock(true)
            }
          })
          return
        }
        // 童锁关
        this.toggleLock(false)
      }
    },
    computed: {
      ...mapState({
        isPlaying: state => state.mqtt.isPlaying,
        curmodel: state => state.mqtt.curmodel,
        currentTrack: state => state.mqtt.currentTrack,
        currentTrackIsfav: state => state.mqtt.currentTrackIsfav,
        playerProcess: state => state.mqtt.playerProcess,
        clientOnline: state => state.mqtt.clientOnline,
        clientBind: state => state.mqtt.clientBind,
        deviceStatus: state => state.mqtt.deviceStatus,
        deviceOnline: state => state.mqtt.deviceOnline,
        lock: state => state.mqtt.lock,
        earlamp: state => state.mqtt.earlamp
        // ,
        // duration: state => state.mqtt.duration
      }),
      curmodelIcon () {
        return this.curmodel === 2 ? 'static/images/SingleTuneCirculation@2x.png' : (this.curmodel === 3 ? 'static/images/RandomPlay@2x.png' : 'static/images/SequentialPlay@2x.png')
      },
      isPlayingIcon () {
        return this.isPlaying ? 'static/images/PopPause@2x.png' : 'static/images/PopPlay@2x.png'
      },
      currentTrackIsfavIcon () {
        return this.currentTrackIsfav ? 'static/images/CollectionSelected.png' : 'static/images/Collection@2x.png'
      },
      duration () {
        return Math.round(this.currentTrack.duration * this.playerProcess / 100)
      },
      totalDuration () {
        return this.currentTrack.duration
      }
    },
    filters: {
      formatTime: seconds => {
        if (!seconds) return '00:00'
        let m, s
        m = Math.floor(seconds / 60)
        m = m.toString().length === 1 ? ('0' + m) : m
        s = Math.floor(seconds - 60 * m)
        s = s.toString().length === 1 ? ('0' + s) : s
        return m + ':' + s
      }
    },
    mounted: function () {
      console.log(PlayerVolume)
      console.log(SetEarlamp)
      console.log(SetLock)
    }
  }
</script>

<style scoped lang="scss">
.PlayerBar{
  position:fixed;  
  bottom:-1px;
  padding-bottom:1px;
  width:100%;
  
  /*收缩logo*/
  &.pageOnlyLogo{
    .logo{
      margin-top: -2rem;
    }
    .bottomBar{
      display:none;
    }
  }

  /*正常显示*/
  .logo{
    z-index: -1;
    position:absolute;
    top: -1.9rem;
    right: .5rem;
  }
  .bottomBar{
    background-color: #f8f8f8;
    box-shadow: 0 -1px 0 0 #f8f8f8;

    img{
      width:3rem;
      display: block;
      margin: 0 auto;
    }
    h4,p{
      margin:0;
    }
    .play_current_title,
    .play_desc{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .play_desc{
      color: #C2BEC9;
      font-size:.6rem;
    }
    .PlayingTrackIcon{
      border-radius: 100%;
      padding:.2rem .3rem;
    }
  }

  @-webkit-keyframes rotation{
    0% {-webkit-transform: rotate(0deg);}
    100% {-webkit-transform: rotate(360deg);}
    }
  .Rotation{
    -webkit-transform: rotate(360deg);
    animation: rotation 30s linear infinite;
    -moz-animation: rotation 30s linear infinite;
    -webkit-animation: rotation 30s linear infinite;
    -o-animation: rotation 30s linear infinite;
  }
}
</style>
