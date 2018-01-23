<template>
  <transition name='fade'>
  <div class='component SetAvatar' v-if="open" @click="closeSetting()">
      <div class="icon">
        <ImgBox :imgUrl="avatar" imgstyle="width:12rem;height:12rem;" @click.native="closeSetting()"></ImgBox>
      </div>

      <div class="button" @click.stop="">
        <label v-if="!isUploading" for="img-upload">上传照片</label>
        <label v-if="isUploading">正在上传</label>
        <ImageHtml5Upload @on-success="uploadSuccess" :accept="accept" id="img-upload"></ImageHtml5Upload>
      </div>

  </div>

  </transition>
</template>
<script>
  import _ from 'lodash'
  import {userSettingUploadPic} from '../../../../api/album'
  import ImgBox from '../../../ImgBox/'
  import ImageHtml5Upload from '../../../ImageHtml5Upload/'
  export default {
    name: 'SetAvatar',
    props: {
      open: {
        type: Boolean,
        default: false
      },
      avatar: {
        type: String,
        default: ''
      }
    },
    data: function () {
      return {
        isUploading: false, // 是否正在上传
        accept: 'image/png,image/jpg,image/jpeg',
        imgList: []
      }
    },
    computed: {
    },
    methods: {
      setErrorImg (e) {
        e.target.src = 'static/images/uc-default-all-vatar@3x.png'
      },
      // 关闭组件
      closeSetting (data) {
        this.$emit('close', data)
      },
      // input () {

      // },
      // inputFile (newFile, oldFile) {
      //   // 自动上传
      //   if (!this.$refs.upload.active) {
      //     this.$refs.upload.active = true
      //   }
      //   // 上传成功
      //   if (newFile.success && !oldFile.success) {
      //     let response = newFile.response
      //     this.closeSetting(response)
      //     console.log('upload response', response)
      //   }
      // },
      uploadSuccess (imgList) {
        // debugger
        let self = this
        let imgData = imgList[0]
        if (!imgData && !imgData.src) return
        this.isUploading = true
        userSettingUploadPic({data: imgData.src, fileName: imgData.name}).then((response) => {
          response = response.data
          if (response.errcode === 0) {
            let data = _.isString(response.data) ? JSON.parse(response.data) : response.data
            self.closeSetting(data.url)
            self.isUploading = false
            console.log('upload response', data.url)
          }
        }).catch(error => {
          console.log(error)
          self.isUploading = false
        })
      }
    },
    mounted: function () {
      console.log(this.$ref)
      console.log(ImgBox)
      console.log(ImageHtml5Upload)
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
    .SetAvatar{
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1;
      height: 100%;
      width: 100%;
      color: #75707B;
      background-color: rgba(51, 51, 51, 0.85);
      display: flex;
      flex-direction: column;
      justify-content: center;

      .icon{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;

        img{
          max-width:80%;
          border-radius: 100%;
        }
      }
      .button{
        width: 70%;
        margin: 1rem 0;
        border: 0;
        border-radius: 1rem;
        background: #B585FF;
        color: #fff;
        margin: 3rem auto;

        label{
          padding: .5rem .7rem;
          display: inline-block;
          width: 100%;
          height: 100%;
        }
      }
    }

</style>
