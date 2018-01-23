<template>
  <hr class="divider" :class="{'inset': inset, 'shallow-inset': shallowInset}"/>
</template>

<script>
export default {
  name: 'Divider',
  props: {
    inset: {
      type: Boolean,
      default: false
    },
    shallowInset: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.divider {
  margin: 0;
  height: 1px;
  border: none;
  background-color: rgba(0,0,0,.12);
  width: 100%;
  
  &.inset{
    margin-left: 72px;
  }
  &.shallow-inset{
    margin-left: 16px;
  }
}
</style>
