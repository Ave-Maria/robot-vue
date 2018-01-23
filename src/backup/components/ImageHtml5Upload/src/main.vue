<template>
  <div style='display: none'>
    <input type='file' :id='id' accept="image/*"  @change='uploadImg'/>
  </div>
</template>
<script>
  import EXIF from 'exif-js'
  export default{
    name: 'ImageHtml5Upload',
    props: {
      id: {
        type: String,
        default: 'img-upload'
      },
      accept: {
        type: String,
        default: 'image/png,image/jpg,image/jpeg,image/gif'
      }
      // ,
      // imgNumLimit: { // 一次最多可以上传多少张照片
      //   type: Number,
      //   default: 1
      // }
    },
    data: function () {
      return {
        imgArr: [],
        imgNumLimit: 1 // 一次最多可以上传多少张照片
      }
    },
    methods: {
      'uploadImg': function (e) {
        let tag = e.target
        var fileList = tag.files
        let imgNum = fileList.length
        let _this = this
        _this.imgArr = [] // 图片数据清零
        if (this.imgArr.length + imgNum > this.imgNumLimit) {
          this.tip('最多选择' + this.imgNumLimit + '张图片')
          return
        }
        // alert(this.accept)
        // alert(fileList[0].type)
        // alert(this.accept.indexOf(fileList[0].type))
        if (this.accept.indexOf(fileList[0].type) === -1) {
          this.tip('请选择图片上传')
          return
        }
        var Orientation
        for (let i = 0; i < imgNum; i++) {
          EXIF.getData(fileList[i], function () {
            Orientation = EXIF.getTag(fileList[i], 'Orientation')
          })
          let reader = new FileReader()
          reader.readAsDataURL(fileList[i])
          reader.onload = function () {
            var oReader = new FileReader()
            oReader.onload = function (e) {
              var image = new Image()
              image.src = e.target.result
              image.onload = function () {
                var expectWidth = this.naturalWidth
                var expectHeight = this.naturalHeight
                if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 800) {
                  expectWidth = 800
                  expectHeight = expectWidth * this.naturalHeight / this.naturalWidth
                } else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 1200) {
                  expectHeight = 1200
                  expectWidth = expectHeight * this.naturalWidth / this.naturalHeight
                }
                var canvas = document.createElement('canvas')
                var ctx = canvas.getContext('2d')
                canvas.width = expectWidth
                canvas.height = expectHeight
                ctx.drawImage(this, 0, 0, expectWidth, expectHeight)
                var base64 = null
                 // 修复ios上传图片的时候 被旋转的问题
                if (Orientation !== '' && Orientation !== 1) {
                  switch (Orientation) {
                    case 6:  // 需要顺时针（向左）90度旋转
                      _this.rotateImg(this, 'left', canvas)
                      break
                    case 8:  // 需要逆时针（向右）90度旋转
                      _this.rotateImg(this, 'right', canvas)
                      break
                    case 3:  // 需要180度旋转
                      _this.rotateImg(this, 'right', canvas) // 转两次
                      _this.rotateImg(this, 'right', canvas)
                      break
                  }
                }
                base64 = canvas.toDataURL('image/jpeg', 0.8)
                if (fileList[i].size / 1024000 > 1) {
                  _this.imgScale(base64, 4)
                } else {
                  _this.imgArr.push({'src': base64})
                }
                setTimeout(() => {
                  // 附加图片文件信息
                  _this.imgArr[i].name = fileList[i].name
                  _this.imgArr[i].type = fileList[i].type
                  // 触发$emit事件
                  if (i + 1 === fileList.length) {
                    _this.$emit('on-success', _this.imgArr)
                    console.log('end upload img', _this.imgArr)
                  }
                }, 100)
              }
            }
            oReader.readAsDataURL(fileList[i])
          }
        }
      },
      'imgScale': function (imgUrl, quality) {
        let img = new Image()
        let _this = this
        let canvas = document.createElement('canvas')
        let cxt = canvas.getContext('2d')
        img.src = imgUrl
        img.onload = function () {
           // 缩放后图片的宽高
          let width = img.naturalWidth / quality
          let height = img.naturalHeight / quality
          canvas.width = width
          canvas.height = height
          cxt.drawImage(this, 0, 0, width, height)
          _this.imgArr.push({'src': canvas.toDataURL('image/jpeg')})
        }
      },
      'rotateImg': function (img, direction, canvas) { // 图片旋转
        var minStep = 0
        var maxStep = 3
        if (img == null) return
        var height = img.height
        var width = img.width
        var step = 2
        if (step == null) {
          step = minStep
        }
        if (direction === 'right') {
          step++
          step > maxStep && (step = minStep)
        } else {
          step--
          step < minStep && (step = maxStep)
        }
        var degree = step * 90 * Math.PI / 180
        var ctx = canvas.getContext('2d')
        switch (step) {
          case 0:
            canvas.width = width
            canvas.height = height
            ctx.drawImage(img, 0, 0)
            break
          case 1:
            canvas.width = height
            canvas.height = width
            ctx.rotate(degree)
            ctx.drawImage(img, 0, -height)
            break
          case 2:
            canvas.width = width
            canvas.height = height
            ctx.rotate(degree)
            ctx.drawImage(img, -width, -height)
            break
          case 3:
            canvas.width = height
            canvas.height = width
            ctx.rotate(degree)
            ctx.drawImage(img, -width, 0)
            break
        }
      }
    }
  }
</script>
