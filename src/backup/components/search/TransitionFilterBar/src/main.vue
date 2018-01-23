<template>
  <div class="components TransitionFilterBar">

    <div class="search-bar-top">
      <div class="popup-class">
            <h3 class="title">
              <span class="title-text">{{title}}</span>
              <span class="title-icon" v-if="titleIcon"><img :src="titleIcon" @click="iconClick()"/></span>
            </h3>
            <div class="filter-class">
                <div class="filter-item" v-for="(text, index) in sorts" :key="index" @click="itemClick(text)">
                    <label :class="['class-button', {active: text === sort}]">{{text}}</label>
                </div>
            </div>
      </div>
    </div>

  </div>  
</template>
<script>
  export default {
    name: 'TransitionFilterBar',
    props: {
      title: {
        type: String,
        default: ''
      },
      titleIcon: {
        type: String,
        default: ''
      },
      sorts: {
        type: Array,
        default: []
      },
      sort: {
        type: String,
        default: ''
      }
    },
    data: function () {
      return {
      }
    },
    methods: {
      itemClick (sort) {
        this.$emit('itemClick', sort)
      },
      iconClick (sort) {
        this.$emit('iconClick')
      }
    },
    watch: {
    },
    computed: {
    },
    mounted () {
    }
  }

</script>

<style lang="scss" scoped>
.TransitionFilterBar{
  
  .search-bar-top{
    width:100%;
    padding: 0rem 0rem 0;
    color:#8A848F;

    .popup-class{
        h3.title{
          font-size:1rem;
          font-weight:500;
          margin:1rem .25rem .5rem;
          text-align: left;
          
          .title-icon{
            float:right;
            width:2.2rem;

            img{
              width:100%;
            }
          }
        }
        .filter-class{
            display:flex;
            align-items:center;
            flex-wrap: wrap;

            .filter-item{
              width:23%;
              min-width:4.5rem;
              margin:.25rem 1%;
              
              .class-button{
                display:block;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width:100%;
                padding:.35rem;
                margin:.25rem 0;
                border: 1px solid #dedce2;
                border-radius: 1rem;
                background:#fff;
                color:#75707b;
                &.active{
                  background:#B585FF;
                  color:#fff;
                  border: 1px solid #B585FF;
                }
                input[type=checkbox]{
                  position:absolute;
                  left:-9999px;
                  top:-9999px;
                  opacity: 0;
                }
              }
            }
          }


        .class-button{
          width:100%;
          padding:.35rem;
          margin:.25rem 0;
          border: 1px solid #dedce2;
          border-radius: 1rem;
          background:#fff;
          color:#7b7681;

          &.active{
            background: #B585FF;
            color:#fff;
          }
        }
    }

  }
}


</style>
