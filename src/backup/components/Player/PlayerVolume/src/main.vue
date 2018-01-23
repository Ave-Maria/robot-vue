<template>
  <div class="component PlayerVolume" v-show="isOpenVolumn">
      <transition name='fade'>
      <div class="volumn-container" >
          <div class="mask"  @click="toggleOpenvolume"></div>
          <div class="volumn-control">
              <h3 class="volume-title">故事机音量</h3>
              <div class="volume-container">
                  <div class="volume-icon">
                      <img class="volume-small-icon" src="static/images/popVolume@2x.png">
                  </div>
                  <div class="volume-progress">
                    <range v-model="playerVolume" :max="10" :min="0" :step="1"></range>
                  </div>
                  <div class="volume-icon">{{volume * 10}}%</div>
              </div>
              <div class="controler-button">
                  <button class="button-item" @click="toggleOpenvolume">确定</button>
              </div>
          </div>
      </div>
      </transition>
  </div>
</template>
<script>
  import {mapActions, mapState} from 'vuex'
  import { Range } from 'vux'
  export default {
    name: 'PlayerVolume',
    props: {
      isOpenVolumn: {
        type: Boolean,
        default: false
      }
    },
    components: {
      Range
    },
    data: function () {
      return {
        duration: 0, // 播放进度
        volumeTimeout: null // 记录slider 延时器
      }
    },
    methods: {
      ...mapActions('mqtt', [
        'setVolume'
      ]),
      toggleOpenvolume () {
        this.$emit('update:isOpenVolumn', false)
      }
    },
    computed: {
      ...mapState({
        volume: state => state.mqtt.volume
      }),
      playerVolume: {
        get: function () {
          return this.volume
        },
        set: function (volume) {
          if (this.volumeTimeout) clearTimeout(this.volumeTimeout)
          if (!this.isOpenVolumn) return
          this.volumeTimeout = setTimeout(() => {
            this.setVolume(volume)
          }, 1 * 1000)
        }
      }
    },
    mounted: function () {
    }
  }
</script>

<style scoped lang="scss">
  /*音量盒子*/ 
  .volumn-container{
    width: 100%;
    height:100%;
    display:flex;
    flex-direction:column;
    position: absolute;
    left: 0;
    top: 0;
    z-index:2;
    
    .mask{
      flex:1;
      background: rgba(0, 0, 0, 0.5);
    }
    .volumn-control{
        background:#fff;
        border:1px dotted #ededed;
        height:12rem;
        
        .volume-title{
            text-align:center;
            height:3rem;
            line-height:3rem;
            margin:0;
            color:#75707B;
            font-size: .8rem;
        }
        .volume-container{
            display:flex;
            align-items: center;
            height:3rem;
            /*background:rgb(248,248,248);
            margin:0 1rem;*/

            .volume-icon{
              width:3.5rem;
              text-align:center;
              color:#C2BEC9;

              img{
                max-width:100%;
              }
            }
            .volume-progress{
              flex:1;
            }
        }
        .controler-button{
            height:5rem;
            display:flex;
            align-items: center;
            justify-content: center;
            .button-item{
              height:2.3rem;
              width: 100%;
              margin: 0 3rem;
              font-size: 1rem;
              color:#fff;
              background:#B585FF;
              border:0;
              border-radius: 2rem;
            }
        }
    }
  }
  .fade-enter{
    opacity: 0;
  }

  .fade-enter-active{
    transition: opacity .4s
  }
</style>
