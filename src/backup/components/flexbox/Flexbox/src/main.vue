<template>
  <div class="flexbox" :class="{'flex-col': orient === 'vertical', 'flex-row': orient === 'horizontal'}" :style="styles">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Flexbox',
  props: {
    gutter: {
      type: Number,
      default: 8
    },
    orient: {
      type: String,
      default: 'horizontal'
    },
    justify: String,
    align: String,
    wrap: String
  },
  computed: {
    styles () {
      return {
        'justify-content': this.justify,
        'align-items': this.align,
        'flex-wrap': this.wrap
      }
    }
  }
}
</script>

<style lang="less">
.flexbox{
  width: 100%;
  text-align: left;
  display: flex;
  box-align: center;
  align-items: center;
}
.flexbox .flexbox-item {
  flex: 1;
  min-width: 20px;
  width: 0%;
}
.flexbox-item > .flexbox {
  width: 100%;
}
.flexbox .flexbox-item:first-child{
  margin-left: 0!important;
  margin-top: 0!important;
}
.flex-col {
  box-orient: vertical;
  flex-direction: column;
}

.flex-col > .flexbox-item {
  width: 100%;
}

.flex-row {
  box-direction: row;
  box-orient: horizontal;
  flex-direction: row;
}
</style>
