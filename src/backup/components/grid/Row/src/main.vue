<template>
  <div class="row" :class="{'no-gutter': !gutter}">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'GridRow',
    props: {
      gutter: {
        type: Boolean,
        default: false
      }
    }
  }
</script>
<style lang="css">
  @import '../../grid.css'
</style>

