<template>

  <!--<label  class='component Checkbox' v-show="show">
    <input type="checkbox" v-model="value">
    <i>✓</i>
  </label>-->
  <label class='component Checkbox' v-show="show">
    <input type="checkbox" v-model="value">
    <img :src="icon">
  </label>
</template>
<script>
  export default {
    name: 'Checkbox',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      show: {
        type: Boolean,
        default: false
      }
    },
    data: function () {
      return {}
    },
    computed: {
      icon () {
        return this.value ? 'static/images/selected@2x.png' : 'static/images/unselected@2x.png'
      }
    },
    methods: {
      computeHeight () {}
    },
    mounted: function () {
    }
  }

</script>

<style lang='scss' scoped>
  .Checkbox{
    width: 1.5rem;
    height: 1.5rem;
    input[type="checkbox"]{
        display:none;
    }
    img{
      width: 3rem;
      max-width:90%;
    }
  }
    /*input css
    label {
      display: inline-block;
      margin: 0 auto;
      width: 1.5rem;
      height: 1.5rem;
      color: #fff;
      background:#af7bff;
      font-size:1.1rem;
      border: #b195ec 1px solid;
      border-radius: 100%;
      text-align:center;

      i {display: inline-block;}

      input[type="radio"] + i {
        border-radius:7px;
      }
      input[type="checkbox"],input[type="radio"] {
        display:none;
      }
      input[type="checkbox"]:checked + i,input[type="radio"]:checked + i {

      }
      input[type="checkbox"]:disabled + i,input[type="radio"]:disabled + i {
        border-color:#ccc;
      }
      input[type="checkbox"]:checked:disabled + i,input[type="radio"]:checked:disabled + i {
        background:#ccc;
      }
    }*/

</style>
