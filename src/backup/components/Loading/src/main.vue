<template>
  <div class='component Loading' v-if="show">
        <div class="mu-infinite-scroll">
            <div class="mu-circle-wrapper active" style="width: 24px;height: 24px;/* display: none; */">
            <div class="mu-circle-spinner active">
            <div class="mu-circle-clipper left">
            <div class="mu-circle" style="border-width: 3px;"></div>
        </div> 

        <div class="mu-circle-gap-patch">
           <div class="mu-circle"></div>
        </div>

         <div class="mu-circle-clipper right"><div class="mu-circle" style="border-width: 3px;">
            </div></div>
            </div></div> 
            <span class="mu-infinite-scroll-text" style="/* display: none; */">{{loadingText}}</span>
         </div>
  </div>
</template>
<script>
  export default {
    name: 'Loading',
    props: {
      loadingText: {
        type: String,
        default: ''
      },
      show: {
        type: Boolean,
        default: false
      }
    },
    components: {
    },
    data: function () {
      return {}
    },
    computed: {
    },
    methods: {
    },
    mounted: function () {
    }
  }

</script>

<style lang='scss'>
</style>
