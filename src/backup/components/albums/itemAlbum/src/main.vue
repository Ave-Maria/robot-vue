<template>
  <div class="components ItemAlbum">
  <div class="title">{{ title }}</div>
    <div class="albums-list">
      <div class="albums-item" @click="clickAlbum(item)" :key="index" v-for="(item, index) in albums">
          <img class="item-icon" v-lazy="item.cover_url_middle"/>
          <div class="title">{{item.album_title}}</div>
          <div class="subtitle" v-if="item.announcer.sort">{{item.announcer.sort}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ItemAlbum',
    props: {
      albums: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      }
    },
    data: function () {
      return {}
    },
    methods: {
      clickAlbum (item) {
        this.$emit('clickAlbum', item)
      },
      setErrorImg (e) {
        e.target.src = 'static/images/DefaultCover.png'
      }
    },
    computed: {},
    mounted: function () {}
  }

</script>
<style scoped lang="scss">
  .ItemAlbum {
    padding: 0 1%;
  }
  .ItemAlbum > .title{
    margin-top:.5rem;
    text-align: left;
  }
  .ItemAlbum .albums-list{
    display:flex;
    flex-wrap: wrap;

    .albums-item{
      width:32.3333%;
      margin: .5rem .5% 0;
    
      .item-icon{
        width:100%;
        border-radius:.5rem;
      }
      .title,.subtitle{
        margin:0;
        padding:0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .subtitle{
        margin:0;
        padding:0;
        font-size:.5rem;
        color:#c4c1c6;
      }
    }
  }
</style>
