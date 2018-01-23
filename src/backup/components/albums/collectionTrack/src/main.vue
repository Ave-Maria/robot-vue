<template>
  <div class='components trsckAlbum'>
    <div class='album'>
      <div :class="['album-item',{'bottom-border':(tracks.id != currentTracksId)}]">
        <!--推送且添加播列表-->
        <div class='album-icon'>
            <template v-if="currentTrack.musicId === tracks.id">
                <template v-if="isPlaying">
                  <img src='static/images/iconPushPause@2x.png' style='max-width:100%' @click="pausePlaying" >
                </template>
                <template v-else>
                  <img src='static/images/iconPushPlay@3x.png' style='max-width:100%' @click="resumePlaying">
                </template>
            </template>
            <template v-else>
                <img src='static/images/iconPushPlay@3x.png' style='max-width:100%' @click="bfPlayingShift">            
            </template>
        </div>
        <!--单曲信息-->
        <div class='album-info' @click='toggleAction()'>
            <div class='track_title'>{{tracks.track_title}}</div>
            <div class="track-info">{{tracks.announcer.nickname}}</div>
        </div>
        <div class='album-add'>
          <slot name="right"></slot>
        </div>
      </div>

      <template v-if="!editModel">
      <transition name='fade'>
          <div class='album-subItem' v-show="tracks.id == currentTracksId">
              <div class='like' @click='delCollection()'>
                <div><img src='static/images/uc-delete@2x.png' class="album-subItem-icon"></div>
                <div class="album-subItem-text">删除</div>
              </div>
              <div class='play-pause' @click='toggleAddPlay()'>
                <div class="icon"><img :src='isPlayIcon' class="album-subItem-icon"></div>
                <div class="text album-subItem-text">{{ isPlayText }}</div>
              </div>
          </div>
      </transition>
      </template>

      <div class="editModel" v-if="editModel" @click="clickModel()"></div>
    </div>
  </div>
</template>
<script>
  import {mapActions, mapState} from 'vuex'
  import {playlistCreate} from '../../../../api/album'
  import {formatTrack} from '../../../../utils/index'
  import {listArray, coverOption, playListLength} from '../../../../utils/const'
  export default {
    name: 'CollectionTrack',
    props: {
      // 单曲数据
      tracks: {
        type: Object,
        default: {}
      },
      // 最近编辑单曲
      value: {
        default: null
      },
      // 是否进入编辑状态
      editModel: {
        type: Boolean,
        default: false
      }
    },
    data: function () {
      return {
        promptOption: {
          inputType: 'checkbox',
          inputText: '不再提醒'
        }
      }
    },
    methods: {
      ...mapActions('mqtt', [
        'playingPrevNext',
        'addToPlayList',
        'resumePlaying',
        'pausePlaying',
        'playlistDel',
        'addToPlayListAndPlay'
      ]),
      // 添加播放列表并播控判断
      bfPlayingShift () {
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
        this.playingShift()
      },
      // 添加播放列表并播控
      playingShift () {
        let trackData = formatTrack(this.tracks)
        this.addToPlayListAndPlay({data: trackData[0], list: listArray[1]})
        this.tip('已通知小驰宝宝播放')
      },
      // 切换下拉选项
      toggleAction () {
        this.$emit('input', (this.tracks.id === this.currentTracksId ? null : this.tracks.id))
      },
      // 删除收藏单曲
      delCollection () {
        this.$emit('delCollection', this.tracks)
      },
      // 切换操作单曲到播放列表
      toggleAddPlay () {
        this.isPlay ? this.delFromPlaylist() : this.bfAddToPlaylist()
      },
      bfAddToPlaylist () {
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        let storage = window.localStorage
        // 播放列表超过n(五百）首歌曲
        if (this.playListData && this.playListData.length >= playListLength && !storage.getItem(coverOption.AutoCoverPlaylist)) {
          this.prompt('您播放列表已经超过' + playListLength + '首，添加后系统将为您自动删除最早单曲', '确定添加单曲？', (param) => {
            // ok
            if (param && param.isPrompt) {
              storage.setItem(coverOption.AutoCoverPlaylist, param.input)
              this.addToPlaylist()
            }
          }, this.promptOption)
          return
        }
        this.addToPlaylist()
      },
      // 添加单曲到播放列表
      addToPlaylist () {
        let self = this
        let trackData = formatTrack(this.tracks)
        playlistCreate(trackData).then(response => {
          if (response.data.errcode === 0) {
            self.isPlay = true
            this.tip('已添加至播放列表')
            this.addToPlayList(trackData[0])
          }
        })
      },
      // 单曲从播放列表删除
      delFromPlaylist () {
        let trackData = formatTrack(this.tracks)
        this.playlistDel(trackData[0])
        this.isPlay = false
      },
      // 点击选中框
      clickModel () {
        this.$emit('togglecheck')
      }
    },
    computed: {
      ...mapState({
        playListData: state => state.mqtt.playListData,
        isPlaying: state => state.mqtt.isPlaying,
        currentTrack: state => state.mqtt.currentTrack,
        clientOnline: state => state.mqtt.clientOnline,
        deviceStatus: state => state.mqtt.deviceStatus,
        clientBind: state => state.mqtt.clientBind,
        deviceOnline: state => state.mqtt.deviceOnline
      }),
      // 是否已存在播放列表
      isPlay () {
        let self = this
        let inCollectionListData = this.playListData.filter(item => item.musicId === self.tracks.id)
        return inCollectionListData.length > 0
      },
      // 是否播放图标
      isPlayIcon () {
        return this.isPlay ? 'static/images/check@2x.png' : 'static/images/icon_psuh_add_queue.png'
      },
      // 是否播放文字
      isPlayText () {
        return this.isPlay ? '已添加' : '添加进列表'
      },
      // 显示最近显示单曲索引
      currentTracksId () {
        return this.value
      }
    },
    mounted: function () {
      console.log(this.currentTracksId)
      console.log(this.tracks)
    }
  }

</script>
<style lang="scss" scoped>
  /*编辑状态*/
  .active{
    .album-add{
      overflow: hidden;
    }
  }
  .album{
    position: relative;
    border:0px solid #dedede;
    /*编辑状态*/ 
    .editModel{
      position: absolute;
      z-index: 2;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
    }

    /* 渐隐*/
    .fade-enter{
      opacity: 0;
      height:0;
    }
    .fade-enter-active{
      transition: opacity .8s, height .8s
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
        .track_title{
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align:left;
          /*font-weight: bold;
          font-size: .95rem;*/
        }

        .track-info{
          display:flex;
          width: 100%;
          align-items: center;
          color: #C2BEC9;
          font-size: .8rem;
        }

      }

      .album-add{
        flex:1;
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
        width:2.3rem;
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
      & > .play-pause{
        width: 5rem;
        .icon{
          margin:0 auto;
          width:2.4rem;
        }
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
