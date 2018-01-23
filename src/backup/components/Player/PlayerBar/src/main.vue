<template>
  <div :class="['components','PlayerBar',{openHalfPlayer},{active:openPlayer}]" v-show="openAllPlayer">
    <div class="logo">
      <img src="static/images/logoAll@2x.png" @click.prevent="toggleLogo()">
    </div>

    <div class="bottomBar">
        <!--专辑封面-->
        <div class="bottomBarIcon">
          <img :src="PlayingTrackIcon" :class="['PlayingTrackIcon',{Rotation:isPlaying}]" @click="PlayerOpen({pageIndex: 0})"/>
        </div>

        <!--专辑封面信息-->
        <div class="bottomBarInfo">
          <h4 class="play_current_title" @click="PlayerOpen({pageIndex: 0})">{{currentTrack.musicTitle}}</h4>
          <p class="play_desc" @click="PlayerOpen({pageIndex: 0})">{{currentTrack.artistsName}}</p>
        </div>

        <!--播放暂停按钮-->
        <div class="bottomBarIcon play-pause">
          <img :src="isPlayingIcon" @click="togglePlayResume"/>
        </div>

        <!--下一首按钮-->
        <div class="bottomBarIcon flex-demo">
          <img src="static/images/nextSong@2x.png" @click="playingNext"/>
        </div>

        <!--列表页面按钮-->
        <div class="bottomBarIcon flex-demo">
          <img src="static/images/playing_list.png" @click="PlayerOpen({pageIndex: 1})"/>
        </div>
    </div>

    <PlayBox></PlayBox>
  </div>
</template>
<script>
  import {mapActions, mapState} from 'vuex'
  import PlayBox from '../../PlayBox/'
  export default {
    name: 'PlayerBar',
    props: {},
    data: function () {
      return {
        isShowPlayer: false // 打开播放器
      }
    },
    methods: {
      ...mapActions('player', [
        'playerOpen',
        'playerHalfShow',
        'playerHalfHide'
      ]),
      ...mapActions('mqtt', [
        'togglePlayResume',
        'playingNext',
        'getVolume',
        'getLock',
        'getPlaylistCurmodel'
      ]),
      toggleLogo () {
        this.openHalfPlayer ? this.playerHalfHide() : this.playerHalfShow()
      },
      PlayerOpen (pageIndex) {
        this.playerOpen(pageIndex)
        this.getVolume()
        this.getLock()
        this.getPlaylistCurmodel()
      }
    },
    computed: {
      ...mapState({
        openPlayer: state => state.player.openPlayer,
        openAllPlayer: state => state.player.openAllPlayer,
        openHalfPlayer: state => state.player.openHalfPlayer,
        currentTrack: state => state.mqtt.currentTrack,
        isPlaying: state => state.mqtt.isPlaying
      }),
      isPlayingIcon () {
        return this.isPlaying ? 'static/images/CrossPause@2x.png' : 'static/images/CrossPlay@2x.png'
      },
      PlayingTrackIcon () {
        return this.currentTrack.cover_url_middle || 'static/images/DefaultCover@2x.png'
      }
    },
    mounted: function () {
      console.log(PlayBox)
    }
  }
</script>

<style scoped lang="scss">
.PlayerBar{
  position:fixed;  
  bottom:-1px;
  padding-bottom:1px;
  width:100%;
  &.active{
    z-index: 501;
  }
  
  /*收缩logo*/
  &.openHalfPlayer{
    .logo{
      margin-top: -1rem;
    }
    .bottomBar{
      display:none;
    }
  }

  /*正常显示*/
  .logo{
    z-index: -1;
    position: absolute;
    top: -2rem;
    right: .5rem;
    width: 2.8rem;

    img{
      width: 100%;
    }
  }
  .bottomBar{
    background-color: #f8f8f8;
    box-shadow: 0 -1px 0 0 #f8f8f8;
    height:4rem;
    display:flex;
    align-items: center;

    .bottomBarIcon{
      width:3.5rem;
    }
    .bottomBarInfo{
      flex:1;
      text-align: left;
      overflow: hidden;
    }

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
    .play_current_title{
      color:#000;
    }
    .play_desc{
      color: #C2BEC9;
      font-size:.6rem;
    }
    .PlayingTrackIcon{
      border-radius: 100%;
      margin:.2rem;
      padding:.2rem;
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
