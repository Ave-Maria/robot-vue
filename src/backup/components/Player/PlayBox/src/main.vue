<template>
  <div class='components player'>

      <popup :value="openPlayer" height="100%" class="popup-bottom" @on-hide="playerClose" @on-show="showPlayer" :popup-style="{zIndex: 555}">
            <div class="player-container">
              <div class="player-swiper">
                  <swiper :options="swiperOption" ref="mySwiper" class="swiper">
                      <swiper-slide >
                          <div class="close-container">
                            <div class="close-left" @click="playerClose">
                              <div class="close-left-icon">
                                <img src="static/images/select@2x.png"/>
                              </div>
                            </div>
                            <div class="close-content">
                              <div class="close-title">{{currentTrack.musicTitle}}</div>
                            </div>
                            <div class="close-right">&nbsp;</div>
                          </div> 
                          
                          <div class="swiper-page play-page">
                            <div class="looper"><img :class="{Rotation:isPlaying}" :src="currentTrack.cover_url_middle" @error="setErrorImg"></div>
                          </div>
                      </swiper-slide>
                      
                      <swiper-slide  class="s-slide">
                          <div class="close-container">
                            <div class="close-left" @click="playerClose">
                              <div class="close-left-icon">
                                <img src="static/images/select@2x.png"/>
                              </div>
                            </div>
                            <div class="close-content">
                              <div class="tab-title">
                                <div :class="['tab-title-item', activeList === 'play' ? 'active' : '']"  @click="toggeleList('play')">播放列表</div>
                                <div :class="['tab-title-item', activeList === 'collection' ? 'active' : '']" @click="toggeleList('collection')">我的收藏</div>
                              </div>
                            </div>
                            <div class="close-right" v-show="activeList === 'play'" @click="CleanPlaylist"> <span v-html="playList.totalCount ? '清空' : '&nbsp;' "></span></div>
                            <div class="close-right" v-show="activeList === 'collection'" @click="CleanCollectionList"><span v-html="collectionList.totalCount ? '清空' : '&nbsp;'"></span></div>
                          </div>
                      
                          <div class="swiper-page list-page" v-if="pageIndex === 1">
                              <PlayList v-if="activeList === 'play'"></PlayList>
                              <CollectionList v-if="activeList === 'collection'"></CollectionList>
                          </div>
                      </swiper-slide>
                      <div class="swiper-pagination" slot="pagination"></div>
                  </swiper>
              </div>

              <div class="player-control">
                  <PlayerControl v-if="openPlayer"></PlayerControl>
              </div>
            </div>
      </popup>
  </div>
</template>
<script>
  import {mapActions, mapState} from 'vuex'
  import {Popup} from 'vux'
  import PlayList from '../../PlayList/'
  import CollectionList from '../../CollectionList/'
  import PlayerControl from '../../PlayerControl/'
  export default {
    name: 'PlayBox',
    components: {
      Popup
    },
    props: {
      // bottomPopup: {
      //   type: Boolean,
      //   default: true
      // }
    },
    data: function () {
      let self = this
      return {
        swiperOption: {
          // NotNextTick is a component's own property, and if notNextTick is set to true, the component will not instantiate the swiper through NextTick, which means you can get the swiper object the first time (if you need to use the get swiper object to do what Things, then this property must be true)
          // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
          notNextTick: true,
          // swiper configs 所有的配置同swiper官方api配置
          loop: false,
          direction: 'horizontal',
          grabCursor: true,
          setWrapperSize: true,
          autoHeight: false,
          pagination: '.swiper-pagination',
          paginationClickable: true,
          mousewheelControl: true,
          observeParents: true,
          // if you need use plugins in the swiper, you can config in here like this
          // 如果自行设计了插件，那么插件的一些配置相关参数，也应该出现在这个对象中，如下debugger
          debugger: true,
          observer: true,
          resizeReInit: true,
          // swiper callbacks
          // swiper的各种回调函数也可以出现在这个对象中，和swiper官方一样
          onBeforeResize (swiper) {
          // console.log(swiper)
            // debugger
            // swiper.update(true)
          },
          on: {
            slideChangeTransitionStart: function () {
              // console.log('------------------this.activeIndex', this.activeIndex)
              self.setPageIndex({pageIndex: this.activeIndex})
            }
          }
        },
        activeList: 'play' // 切换播放列表
        // isOpenVolumn: false // 打开音量
      }
    },
    methods: {
      setErrorImg (e) {
        e.target.src = 'static/images/DefaultCover.png'
      },
      ...mapActions('player', [
        'playerClose',
        'setPageIndex'
      ]),
      ...mapActions('mqtt', [
        'getPlaylist',
        'getCollectionList',
        'cleanCollectionList',
        'cleanPlaylist',
        'pausePlaying'
      ]),
      // 切换列表
      toggeleList (type) {
        if (type) this.activeList = type
        // this.activeList === 'collection' ? this.getCollectionList() : this.getPlaylist()
      },
      // 显示页面
      showPlayer () {
        // 切换页面
        this.$refs.mySwiper.swiper.slideTo(this.pageIndex, 1000, false)
        this.toggeleList()
      },
      CleanPlaylist () {
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        if (!this.playList.totalCount) return
        this.confirm('确定要清空播放列表？', null, (ok) => {
          if (ok) {
            this.cleanPlaylist()
            this.pausePlaying()
          }
        })
      },
      CleanCollectionList () {
        if (!this.clientOnline) {
          this.tip('请检查网络是否连接')
          return
        }
        if (!this.collectionList.totalCount) return
        this.confirm('确定要清空收藏列表？', null, (ok) => {
          if (ok) {
            this.cleanCollectionList()
          }
        })
      }
    },
    computed: {
      ...mapState({
        pageIndex: state => state.player.pageIndex,
        openPlayer: state => state.player.openPlayer,
        collectionListData: state => state.mqtt.collectionListData,
        currentTrack: state => state.mqtt.currentTrack,
        isPlaying: state => state.mqtt.isPlaying,
        clientOnline: state => state.mqtt.clientOnline,
        playList: state => state.mqtt.playList,
        collectionList: state => state.mqtt.collectionList
      })
    },
    created () {
    },
    mounted: function () {
      console.log(PlayList)
      console.log(CollectionList)
      console.log(PlayerControl)
    }
  }

</script>

<style lang="scss">
.hideBox{
  width: 100%;
  height:100%;
  z-index: 20481246 !important;
  display:none !important;
}
/*popup 盒子*/
.popup-bottom {
  /*width: 100%;
  height:100%;
  z-index: 20481236 !important;*/

  /*播放器盒子*/  
  .player-container{
    width: 100%;
    height:100%;
    display:flex;
    flex-direction:column;
  
    /*轮播背景*/
    .player-swiper{
      display: flex;
      flex:1;
      background: linear-gradient(#8e46ff,#b483ff);

      .white-line{
        background-color: rgba(255, 255, 255, 0.12);
      }

      /*轮播外盒子*/ 
      .swiper-container{
        display: flex;
        flex-direction: column;

        /*轮播内盒子*/ 
        .swiper-wrapper{
          flex: 1;
          overflow-y: scroll;
          &::-webkit-scrollbar {
              display: none;
          }
          -webkit-overflow-scrolling: touch;

          /*每一个轮播盒子*/
          .swiper-slide{
            height:auto;
            display: flex;
            flex-direction: column;

            /*顶部导航*/
            .close-container{
              display:flex;
              align-items: center;
              color:#fff;
              height:3rem;
              flex-shrink: 0;

              .close-content{
                flex:1;
                text-align:center;
                overflow: hidden;
                .close-title{
                  font-size:1.1rem;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                .close-subtitle{
                  font-size:.8rem;
                  color:rgba(255,255,255,.6);
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                .tab-title{
                  display:flex;
                  justify-content: center;
                  height:2rem;
                  line-height:2rem;
                  padding: 0 1.5rem;
                  .tab-title-item{
                    flex:1;
                    height:100%;
                    background:#914aff;
                    border:1px solid #e9daff;
                    border-right:0;
                  }
                  .tab-title-item:last-child{
                    border-right:1px solid #e9daff;
                    border-bottom-right-radius: 1rem;
                    border-top-right-radius: 1rem;
                  }
                  .tab-title-item:first-child{
                    border-bottom-left-radius: 1rem;
                    border-top-left-radius: 1rem;
                  }
                  .tab-title-item.active{
                    background:#e9dbff;
                    color:#924BFF;
                  }
                }
              }
              .close-left,.close-right{
                width:2.5rem;
                text-align:center;
                margin: 0 .7rem;

                .close-left-icon{
                  width:2rem;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  
                  img{
                    max-width:100%;
                  }
                }
              }
            }

            /*公共页面 */
            .swiper-page{
              flex:1;
              margin-bottom:2.5rem;
            }
            /*播放页面*/
            .play-page{
              flex:1;
              display:flex;
              align-items: center;
              flex-direction:column;
              justify-content: center;
              padding-bottom: 0rem;

              .looper{
                flex:1;
                width:100%;
                display:flex;
                align-items: center;
                flex-direction:column;
                justify-content: center;
                
                img{
                  width: 50%;
                  max-width: 70%;
                  max-height: 100%;
                  border-radius: 100%;
                }
              }
              .volume{
                width:100%;
                margin-bottom: 0rem;
                img{
                  margin-left:1rem;
                  width:2.5rem;
                }
              }
            }
          /*列表页面*/
          .list-page{
            display: flex;
            flex-direction: column;
            flex:1;
            overflow: scroll;
            &::-webkit-scrollbar {
                display: none;
            }
            -webkit-overflow-scrolling: touch;

          }
          }
        }

        /*轮播分页*/ 
        .swiper-pagination{
            /*height: 2rem;*/
        }
      }
    }

    /*播控功能*/
    .player-control{
      border:1px dotted #ededed;
      height:12rem;
      background: #fff;

      .setting-container{
          display:flex;
          align-items: center;
          justify-content: space-around;
          height:3rem;
          padding:1rem 2.5rem 0rem;
          text-align: center;

          .setting-item{
            width: 2.85rem;

            img{
              max-width: 100%;
            }
          }
      }

      .progress-container{
          display:flex;
          align-items: center;
          height:2rem;
          .duration-played-time,
          .duration-total-time{
            width:4rem;
            text-align:center;
            color: #C2BEC9;
          }
          .duration-progress{
            flex:1;
            padding-top:1.1rem;
          }
      }
      .controler-button{
          height:6rem;
          display:flex;
          align-items: center;
          text-align:center;
          .button-item{
              flex:1;
              img{
                width:3rem;
              }
          }
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

}
/*横屏*/
@media screen and (orientation: landscape) {
 
  .popup-bottom .player-container .player-control{
    height: 7rem; 

    .progress-container{
      height: 3rem;
    }
    .controler-button{
      height: 3rem;
    }
  }
}

 
</style>
