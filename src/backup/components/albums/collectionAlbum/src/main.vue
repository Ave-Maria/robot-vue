<template>
  <div class='components CollectionAlbum'>
    <div class='album'>
      <div class='album-item bottom-border' >
        <!--图标-->
        <div class='album-icon' @click="toDetailAlbum()">
          <img :src='album.cover_url_middle' >            
        </div>
        <!--单曲信息-->
        <div class='album-info' @click="toDetailAlbum()">
            <div class='track_title'>{{album.album_title}}</div>
            <div class="track-info">
                <div class="current">{{album.include_track_count || 0}}首</div>
            </div>
        </div>
        <div class='album-add'>
          <!--操作-->
          <slot name="right"></slot>
        </div>
      </div>

      <div class="editModel" v-if="editModel" @click="clickModel()"></div>

    </div>
  </div>
</template>
<script>
  // import {mapActions, mapState} from 'vuex'
  // import {collectionCreate, collectionDel, playlistCreate} from '../../../../api/album'
  // import {formatTrack} from '../../../../utils/index'
  export default {
    name: 'CollectionAlbum',
    props: {
      // 专辑数据
      album: {
        type: Object,
        default: {}
      },
      // 是否进入编辑状态
      editModel: {
        type: Boolean,
        default: false
      }
    },
    data: function () {
      return {
      }
    },
    methods: {
      toDetailAlbum (album) {
        this.$router.push({
          path: '/detailAlbum',
          query: {
            ids: this.album.albumId
          }
        })
      },
      // 点击选中框
      clickModel () {
        this.$emit('togglecheck')
      }
    },
    computed: {

    },
    filters: {
    },
    mounted: function () {
      // console.log(this.currentTracksId)
      // console.log(this.album)
    }
  }

</script>
<style lang="scss" scoped>
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
          border-radius: 100%;
          /*position: relative;
          top: .1rem;*/
        }
      }

      .album-info{
        flex:6;
        overflow: hidden;
        padding-left: .5rem;
        text-align: left;
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
            font-size: .8rem;
          }
          .process{
            width:100%;
            margin:.2rem .5rem;
          }
          .duration{
            width:3rem;
          }
        }

      }

      .album-add{
        flex:1.5;
        text-align: center;
      }

    }

    .album-subItem{
      display:flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: #FBFBFC;
      & > div{
        width:2.3rem;
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
