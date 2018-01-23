<template>
  <div class='component BannerSlider'>
    <swiper :options="swiperOption" ref="mySwiper" class="swiper">
      <!-- slides -->
      <swiper-slide v-for="(banner,index) in banners" :key="index" class="swiper-item">      
        <a :href="banner.redirection">
          <img :src="banner.imgUrl" width="100%"  @error="setErrorImg">      
        </a>
      </swiper-slide>   
      <!-- Optional controls -->
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
    <div hidden>{{portraitScreen}}</div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    name: 'BannerSlider',
    props: {
      banners: {
        type: Array,
        default: []
      }
    },
    data: function () {
      return {
        swiperOption: {
          loop: true,
          autoplay: {
            delay: 3000,
            stopOnLastSlide: false,
            disableOnInteraction: false
          },
          pagination: {
            el: '.swiper-pagination'
          }
        }
      }
    },
    methods: {
      setErrorImg (e) {
        e.target.src = 'static/images/emptybox.png'
      }
    },
    computed: {
      ...mapState({
        portraitScreen: state => state.mqtt.portraitScreen
      })
    },
    watch: {
      portraitScreen (portraitScreen) {
        console.log('portraitScreen', portraitScreen)
      }
    },
    mounted: function () {
    }
  }

</script>

<style scoped>
.BannerSlider{
  min-height:4rem;
}
.swiper-item{
  min-height:5rem;
  overflow:hidden;
}
</style>
