<template>
  <transition name='fade'>

      <div class="volumn-container"  v-if="open">
          <div class="mask" @click="closeSetting()"></div>
          <div class="volumn-control">
              <h3 class="volume-title">音量设置</h3>
              <div class="volume-container">
                  <div class="volume-icon">
                      <img class="volume-small-icon" src="static/images/popVolume.png">
                  </div>
                  <div class="volume-progress">
                    <range v-model="playerVolume" :max="10" :min="0" :step="1"></range>
                  </div>
                  <div class="volume-icon">{{volume * 10}}%</div>
              </div>
              <div class="controler-button">
                  <button class="button-item" @click="closeSetting()">确定</button>
              </div>
          </div>
      </div>

  </transition>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import { Range } from 'vux'
  export default {
    name: 'SetVolume',
    props: {
      open: {
        type: Boolean,
        default: false
      }
    },
    components: {
      Range
    },
    data: function () {
      return {
        volumeTimeout: null // 记录slider 延时器
      }
    },
    computed: {
      ...mapState({
        clientOnline: state => state.mqtt.clientOnline,
        clientBind: state => state.mqtt.clientBind,
        deviceStatus: state => state.mqtt.deviceStatus,
        deviceOnline: state => state.mqtt.deviceOnline,
        volume: state => state.mqtt.volume
      }),
      playerVolume: {
        get: function () {
          return this.volume
        },
        set: function (volume) {
          if (this.volumeTimeout) clearTimeout(this.volumeTimeout)
          this.volumeTimeout = setTimeout(() => {
            this.setVolume(volume)
          }, 1 * 1000)
        }
      }
    },
    methods: {
      setErrorImg (e) {
        e.target.src = 'static/images/uc-default-all-vatar@3x.png'
      },
      // 关闭组件
      closeSetting (data) {
        this.$emit('close')
      },
      ...mapActions('mqtt', [
        'setVolume'
      ])
    },
    mounted: function () {
    }
  }

</script>

<style lang='scss' scoped>
    /* 渐隐*/
    .fade-enter{
      opacity: 0;
      height:0;
    }
    .fade-enter-active{
      transition: opacity .8s, height .8s
    }

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
            position: fixed;
            
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
                    }
                    .volume-progress{
                      flex:1;
                      padding-top:.9rem;
                    }
                }
                .controler-button{
                    margin: 0 2.5rem;
                    height:5rem;
                    display:flex;
                    align-items: center;
                    justify-content: center;
                    .button-item{
                      flex:1;
                      height:2.3rem;
                      margin: 1rem;
                      font-size: 1rem;
                      color:#fff;
                      background:#B585FF;
                      border:0;
                      border-radius: 2rem;
                    }
                    .cancel{
                      background:#C2BEC9;
                    }
                }
            }
          }

</style>
