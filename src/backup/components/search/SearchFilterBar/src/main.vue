<template>
  <div class="components search-filter">
    <div class="filter-class">
        <div class="filter-item" v-for="(sort, index) in sorts" :key="index" v-if="sort.checked">
            <label class="class-button">
              <input type="checkbox" :value="sort.value" @click="clearSort({index: index})">
              {{sort.title}}
            </label>
        </div>

        <div class="filter-item" v-for="(age, index) in ages" :key="index" v-if="age.checked">
            <label class="class-button">
              <input type="checkbox" :value="age.value" @click="clearAge({index: index})">
              {{age.title}}
            </label>
        </div>
    </div>
  </div>
</template>
<script>
  import {mapActions, mapState} from 'vuex'
  export default {
    name: 'SearchFilterBar',
    data: function () {
      return {}
    },
    methods: {
      ...mapActions('search', [
        'clearSort',
        'clearAge'
      ])
    },
    computed: {
      ...mapState({
        sorts: state => state.search.sorts,
        ages: state => state.search.ages
      })
    }
  }

</script>

<style lang="scss" scoped>
.filter-class{
  border-bottom:1px solid #ecebef;

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
      width:100%;
      padding:.35rem 1rem .35rem .35rem;
      margin:.25rem 0;
      /*border: 1px solid #dedce2;*/
      border-radius: 1rem;
      color:#fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background:#B585FF url('./keyword-delete.png') no-repeat scroll right center;

      input[type=checkbox]{
        position:absolute;
        left:-9999px;
        top:-9999px;
        opacity: 0;
      }
    }
  }
}
</style>
