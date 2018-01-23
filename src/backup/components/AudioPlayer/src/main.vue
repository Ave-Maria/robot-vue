<template>
  <div class="component audioPlayer">
    <audio ref="audio" :src="src" @error="">您的浏览器不支持播放音频</audio>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'AudioPlayer',
    props: {},
    data: function () {
      return {}
    },
    methods: {
      ...mapActions('audio', [
        'playAudio',
        'pauseAudio',
        'updateAudio'
      ])
    },
    computed: {
      ...mapState({
        src: state => state.audio.src,
        nativeAudio: state => state.audio.nativeAudio
      })
    },
    mounted: function () {
      this.updateAudio(this.$refs.audio)
      this.nativeAudio.addEventListener('loadedmetadata', () => {
        this.nativeAudio.addEventListener('play', () => {
          this.interval = setInterval(() => {
            if (this.nativeAudio.ended) {
              clearInterval(this.interval)
              this.pauseAudio()
            }
          }, 1000)
        })
        this.playAudio()
      })
    }
  }
</script>

<style scoped>
.audioPlayer{
  display:none;
}
</style>
