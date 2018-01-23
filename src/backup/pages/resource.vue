<template>
  <div class="pages resource">
    <TransitionTopBar></TransitionTopBar>
    <BannerSlider :banners="banners"></BannerSlider>
    <CategoryTab></CategoryTab>

    <TextSlotBar leftIcon="static/images/Dailyrecommended@2x.png" rightIcon="" title="每日推荐"></TextSlotBar>
    <div class="resource-album" v-for="(item, index) in recommendData.tracks" :key="index">
      <TracksAlbum :tracks="item"></TracksAlbum>
    </div>

    <TextSlotBar leftIcon="static/images/NewArrivals@2x.png" rightIcon="" title="新品上架" @clickRight="openSetting('avatar')">
      <div slot="right" v-if="(newAlbumsData.total_count > 3)" class="right" @click="to({path:'/newListAlbum'})">更多﹥</div>
    </TextSlotBar>
    <template v-if="newAlbumsData.albums"><ItemAlbum :albums="newAlbumsData.albums" @clickAlbum="toDetailAlbum"></ItemAlbum></template>

    

    <TextSlotBar leftIcon="static/images/EveryoneListening@2x.png" rightIcon="" title="大家都在听" @clickRight="openSetting('avatar')">
      <div slot="right" v-if="(otherAlbumsData.total_count > 6)" class="right" @click="to({path:'/otherListAlbum'})">更多﹥</div>
    </TextSlotBar>
    <template v-if="otherAlbumsData.albums"><ItemAlbum :albums="otherAlbumsData.albums" @clickAlbum="toDetailAlbum"></ItemAlbum></template>
    
  </div>
</template>
<script>
  import TransitionTopBar from '../components/search/TransitionTopBar'
  import BannerSlider from '../components/BannerSlider'
  import CategoryTab from '../components/CategoryTab'
  import ItemAlbum from '../components/albums/ItemAlbum/'
  import TextSlotBar from '../components/bar/TextSlotBar/'
  import TracksAlbum from '../components/albums/TracksAlbum/'
  import {carousel, albumsList, recommend} from '../api/album'
  import {mapActions, mapState} from 'vuex'
  import {setTitle} from '../utils/index'
  export default {
    data: function () {
      return {
        banners: [],
        recommendData: [],
        newAlbumsData: {},
        otherAlbumsData: {}
      }
    },
    computed: {
      ...mapState({
        WeixinReady: state => state.mqtt.WeixinReady
      }),
      isWeixinReady () {
        if (this.WeixinReady) {
          this.getRecommend()
          return
        }
      }
    },
    watch: {
      isWeixinReady (isReady) {}
    },
    methods: {
      ...mapActions('audio', [
        'clearInfo',
        'pauseAudio'
      ]),
      // 跳转
      to (router) {
        if (!router) return
        this.$router.push(router)
      },
      // 跳转专辑详情
      toDetailAlbum (album) {
        this.$router.push({
          path: '/detailAlbum',
          query: {
            ids: album.id
          }
        })
      },
      // 轮播图
      getCarousel () {
        let self = this
        carousel({page: 'index'}).then(response => {
          self.banners = response.data
        })
      },
      // 首页/每日推荐
      getRecommend () {
        let self = this
        recommend({category_id: 6, count: 6, page: 1, type: 'recommend'}).then(response => {
          self.recommendData = response.data
        })
      },
      // 首页/新品上架
      getNewAlbums () {
        let self = this
        albumsList({category_id: 6, calc_dimension: 2, count: 3, page: 1, type: 'new'}).then(response => {
          self.newAlbumsData = response.data
        })
      },
      // 首页/大家都在听
      getOtherAlbums () {
        let self = this
        albumsList({category_id: 6, calc_dimension: 1, count: 6, page: 1, type: 'hot'}).then(response => {
          self.otherAlbumsData = response.data
        })
      }
    },
    created () {
      this.getCarousel()
      // this.getRecommend()
      this.getNewAlbums()
      this.getOtherAlbums()
    },
    beforeMount () {
      setTitle('儿童内容')
    },
    mounted: function () {
      console.log(BannerSlider.toString(), TransitionTopBar.toString())
      console.log(CategoryTab)
      console.log(ItemAlbum)
      console.log(TracksAlbum)
      console.log(TextSlotBar)
    },
    beforeRouteLeave (to, from, next) {
      // 导航离开该组件的对应路由时调用 都会触发停止“试听”
      // 可以访问组件实例 `this`
      this.pauseAudio()
      this.clearInfo()
      next()
    }
  }

</script>

<style lang="scss" scoped>
  .right{
    color: rgb(117, 112, 123);
  }

</style>
