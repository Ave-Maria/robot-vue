<template>
  <div class='components trsckAlbum'>
    <div class='album'>
      <div :class="['album-item',{'bottom-border':(tracks.id != currentTracksId)}]">
        <!--推送且添加播列表-->
        <div class="album-icon">
            <template v-if="currentTrack.musicId === tracks.id">
                <template v-if="isPlaying">
                  <img src='static/images/iconPushPause@2x.png' @click="pausePlaying" >
                </template>
                <template v-else>
                  <img src='static/images/iconPushPlay@3x.png' @click="resumePlaying">
                </template>
            </template>
            <template v-else>
                <img src='static/images/iconPushPlay@3x.png' @click="bfPlayingShift">            
            </template>
        </div>
        <!--单曲信息-->
        <div class='album-info' @click='showPlayPause(tracks.id)'>
            <div class='track_title'>{{tracks.track_title}}</div>
            <div class="track-info">
                <div class="current" v-if='tracks.id == playingTracksId'>{{currentTime | formatTime}}</div>
                <div class="process" v-if='tracks.id == playingTracksId' @click.stop>
                  <range :value="process" :max="100" :min="0" :step="1" :decimal="true" @on-change="changeProcess"></range>
                </div>
                <div class='duration'>{{tracks.duration | formatTime}}</div>
            </div>
        </div>
        <div class='album-add'>
          <!--添加播列表-->
            <img :class="['add-icon', 'add-icon-fly', {Fly:AddToisPlay}]" src="static/images/icon_psuh_add_queue.png" v-if="isplay">
            <img :class="['add-icon', {Bhide:AddToisPlay}]" src="static/images/check@2x.png" v-if="isplay" @click="delFromePlaylist()">

            <img :class="['add-icon',{hide:AddToisPlay}]" src="static/images/icon_psuh_add_queue.png" @click="bfAddToPlaylist()" v-if="!isplay">
        </div>
      </div>
      <transition name='fade'>
      <div class='album-subItem' v-if='tracks.id == currentTracksId'>
          <div class='play-pause' @click='togglePlayPauseAudio(tracks)'>
            <div><img :src='playPauseIcon' class="album-subItem-icon"></div>
            <div class="album-subItem-text">{{ playPauseText }}</div>
          </div>
          <div class='like' @click='toggleCollection(tracks)'>
            <div><img :src='collectionIcon' class="album-subItem-icon"></div>
            <div class="album-subItem-text">收藏</div>
          </div>
      </div>
      </transition>
    </div>
  </div>
</template>
<script>
  import {mapActions, mapState} from 'vuex'
  import { Range } from 'vux'
  import {collectionCreate, collectionDel, playlistCreate} from '../../../../api/album'
  import {formatTrack} from '../../../../utils/index'
  import {listArray, coverOption, playListLength} from '../../../../utils/const'
  export default {
    name: 'TracksAlbum',
    props: {
      tracks: {
        type: Object,
        default: {}
      }
    },
    components: {
      Range
    },
    data: function () {
      return {
        isCollection: this.tracks.isfav,
        isplay: this.tracks.isplay,
        AddToisPlay: false,
        promptOption: {
          inputType: 'checkbox',
          inputText: '不再提醒'
        }
      }
    },
    methods: {
      ...mapActions('audio', [
        'playPauseAudio',
        'showPlayPause',
        'changeAudioCurrTime',
        'setCurrentTime',
        'togglePlayPauseAudio'
      ]),
      ...mapActions('mqtt', [
        'playingPrevNext',
        'addToPlayList',
        'checkFav',
        'addtoCollctionListData',
        'delfromCollectionListData',
        'resumePlaying',
        'pausePlaying',
        'playlistDel',
        'addToPlayListAndPlay'
      ]),
      toggleCollection (tracks) {
        console.log('add to fav', tracks)
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        if (!this.clientBind) {
          this.confirm('您还没有绑定设备哦，是否前往绑定？', null, (ok) => {
            if (ok) {
              this.$router.push({path: '/config'})
            }
          })
          return
        }

        let trackData = formatTrack(tracks)
        // 取消收藏
        if (this.isCollection) {
          collectionDel(trackData).then(response => {
            if (response.data.errcode === 0) {
              this.isCollection = false
              this.delfromCollectionListData(trackData[0])
            }
          })
        // 收藏
        } else {
          collectionCreate(trackData).then(response => {
            if (response.data.errcode === 0) {
              this.isCollection = true
              this.addtoCollctionListData(trackData[0])
            }
          })
        }
      },
      // 批量添加单曲到播放列表
      bfAddToPlaylist () {
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        if (!this.clientBind) {
          this.confirm('您还没有绑定设备哦，是否前往绑定？', null, (ok) => {
            if (ok) {
              this.$router.push({path: '/config'})
            }
          })
          return
        }
        let storage = window.localStorage
        // 播放列表超过n(五百）首歌曲
        if (this.playListData && this.playListData.length >= playListLength && !storage.getItem(coverOption.AutoCoverPlaylist)) {
          this.prompt('您播放列表已经超过' + playListLength + '首，添加后系统将为您自动删除最早单曲', '确定添加单曲？', (param) => {
            // ok
            if (param && param.isPrompt) {
              storage.setItem(coverOption.AutoCoverPlaylist, param.input)
              this.AddToPlaylist()
            }
          }, this.promptOption)
          return
        }
        this.AddToPlaylist()
      },
      // 批量添加单曲到播放列表
      AddToPlaylist () {
        let self = this
        let trackData = formatTrack(this.tracks)
        playlistCreate(trackData).then(response => {
          if (response.data.errcode === 0) {
            // 播放列表已经有数据-添加，无则添加并显示播放器
            if (this.playListData.length && this.currentTrack.musicId) {
              self.AddToisPlay = true
            } else {
              this.tip('已添加至播放列表')
            }
            // self.isplay = true
            this.addToPlayList(trackData[0])
          }
        })
      },
      // 删除
      delFromePlaylist () {
        let trackData = formatTrack(this.tracks)
        this.playlistDel(trackData[0])
        // this.isplay = false
        this.AddToisPlay = false
      },
      // 添加播放列表并播控判断
      bfPlayingShift () {
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        if (!this.clientBind) {
          this.confirm('您还没有绑定设备哦，是否前往绑定？', null, (ok) => {
            if (ok) {
              this.$router.push({path: '/config'})
            }
          })
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
        this.playingShift()
      },
      // 添加播放列表并播控
      playingShift () {
        let trackData = formatTrack(this.tracks)
        this.addToPlayListAndPlay({data: trackData[0], list: listArray[2]})
        this.tip('已通知小驰宝宝播放')
      },
      // 改变播放进度
      changeProcess (value) {
        let currentTime = value / 100 * this.tracks.duration
        let currentTimeNum = Math.abs(this.currentTime - currentTime)
        if (currentTimeNum < 1) return // 兼容range组件绑定值变化时触发事件
        this.changeAudioCurrTime(currentTime)
        this.setCurrentTime(currentTime)
        console.log('new currentTime', currentTime)
      },
      // 过滤列表数据
      filteListData (listData) {
        let self = this
        let inListData = listData.filter(item => {
          return self.tracks.id === item.musicId
        })
        return inListData && inListData.length > 0
      }
    },
    computed: {
      ...mapState({
        currentTracksId: state => state.audio.currentTracksId,
        playingTracksId: state => state.audio.playingTracksId,
        playState: state => state.audio.playState,
        currentTime: state => state.audio.currentTime,
        playListData: state => state.mqtt.playListData,
        collectionListData: state => state.mqtt.collectionListData,
        currentTrack: state => state.mqtt.currentTrack,
        deviceStatus: state => state.mqtt.deviceStatus,
        clientOnline: state => state.mqtt.clientOnline,
        clientBind: state => state.mqtt.clientBind,
        deviceOnline: state => state.mqtt.deviceOnline,
        isPlaying: state => state.mqtt.isPlaying
      }),
      // 是否播放图标
      playPauseIcon () {
        return (this.tracks.id === this.playingTracksId && this.playState === 0) ? 'static/images/Stop@2x.png' : 'static/images/Audition@2x.png'
      },
      // 是否播放文字
      playPauseText () {
        return (this.tracks.id === this.playingTracksId && this.playState === 0) ? '停止' : '试听'
      },
      // 是否收藏图标
      collectionIcon () {
        return this.isCollection ? 'static/images/CollectionSelected.png' : 'static/images/Collection.png'
      },
      // 当前播放进度
      process () {
        return (this.currentTime && this.tracks.duration) ? Math.round(this.currentTime / this.tracks.duration * 100) : 0
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
    watch: {
      playListData () {
        this.$nextTick(() => {
          let isinListData = this.filteListData(this.playListData)
          isinListData = Boolean(isinListData)
          if (isinListData === this.isplay && this.isplay) return
          this.isplay = this.AddToisPlay = isinListData
        })
      },
      collectionListData () {
        this.$nextTick(() => {
          let isinListData = this.filteListData(this.collectionListData)
          if (isinListData === this.isCollection && this.isCollection) return
          this.isCollection = isinListData
        })
      }
    },
    mounted: function () {
      console.log(this.currentTracksId)
      console.log(this.tracks)
    }
  }

</script>
<style lang="scss" scoped>

  .album{
    
    /* 渐隐*/
    .fade-enter{
      opacity: 0;
      height:0;
    }
    .fade-enter-active{
      transition: opacity .8s, height .8s
    }
    /*hide class*/
    .hide{
      display:none;
    } 

    .album-item{
      display:flex;
      align-items: center;
      margin: 0 0.5rem;
      height: 4.5rem;
      &.bottom-border{
        border-bottom:1px solid #F2F2F2;
      }

      .album-icon{
        flex:1;
        width: 3rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        
        img{
          width:90%;
          max-width:100%;
          /*position: relative;
          top: .1rem;*/
        }
      }

      .album-info{
        flex:6;
        overflow: hidden;
        padding-left: .5rem;
        text-align:left;

        .track_title{
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          /*font-weight: bold;
          font-size: .95rem;*/
        }

        .track-info{
          display:flex;
          width: 100%;
          align-items: center;
          color: #C2BEC9;

          .current{
            width:3rem;
          }
          .process{
            width:100%;
            margin:.2rem .5rem;
          }
          .duration{
            font-size:.8rem;
            width:3rem;
          }
        }

      }

      .album-add{
        flex:1;
        text-align: right;
        color:#AAA6AD;
        position: relative;

        .add-icon{
          width:100%;
        }
        .add-icon-fly{
          position: absolute;
          right: 0;
          top: -10000rem;
        }
        /* 动画*/
        @-webkit-keyframes fly{
          0% {top:0;right:0; opacity: 1; -webkit-transform :rotate(0deg);}
          100% { top: 100rem;right:0; opacity: .3; -webkit-transform :rotate(360deg);}
        }
        .Fly{
          -webkit-transform: rotate(360deg);
          animation: fly 3s;
          -moz-animation: fly 3s;
          -webkit-animation: fly 3s;
          -o-animation: fly 3s;
        }
        /* 动画*/
        @-webkit-keyframes bhide{
          0% {opacity: 0; }
          100% { opacity: 1;}
        }
        .Bhide{
          -moz-animation: bhide 0.1s ease .5s 1 normal;
          -webkit-animation: bhide 0.1s ease .5s 1 normal;
          -o-animation: bhide 0.1s ease .5s 1 normal;
          animation: bhide 0.1s ease .5s 1 normal;

          -moz-animation-fill-mode:backwards;
          -webkit-animation-fill-mode:backwards;
          -o-animation-fill-mode:backwards;
          animation-fill-mode:backwards;
        }
      }

    }

    .album-subItem{
      display:flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: #FBFBFC;
      height: 4.5rem;
      & > div{
        width:2.4rem;
        margin:0 1.5rem;
      }
      .album-subItem-icon{
        max-width:100%;
        position: relative;
        top: 0.25rem;
      }
      .album-subItem-text{
        position: relative;
        top: -0.25rem;
      }
    }
  }

  @media only screen and (min-device-width : 768px){
    .album{
      .album-item{
        .album-icon img{
          width: 55%;
        }
        .album-add img.add-icon{
          width: 70%;
        }
      }
    }
  }
</style>
