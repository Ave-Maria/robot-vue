<template>
    <scroller lock-y :scrollbar-x="false">
      <div class="box1">
          <div :key="index" class="box1-item" v-for="(item,index) in sorts" @click="sortChecked({item, index})">
            <div><img :src="item.icon" width="80%" /></div>
            <div class="title">{{item.title}}</div>
          </div>
      </div>
    </scroller>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {Scroller} from 'vux'
export default {
  components: {
    Scroller
  },
  data () {
    return {
    }
  },
  name: 'CategoryTab',
  methods: {
    ...mapActions('search', [
      'searchSort'
    ]),
    sortChecked (sort) {
      this.searchSort(sort)
      this.$router.push({path: '/search'})
    }
  },
  computed: {
    ...mapState({
      sorts: state => state.search.sorts
    })
  },
  mounted () {
  }
}
</script>

<style scoped>
/*.box1 {
  position: relative;
  width: 49.5rem;
  padding:.45rem;
}
.box1-item {
  width: 4.5rem;
  margin-left:.45rem;
  display:inline-block;
  margin-left: 1rem;
  float: left;
  text-align: center;
}
.box1-item:first-child {
  margin-left: 0;
}*/
.box1 {
  padding:.5rem 0;
  width: 200%;
  display:flex;
  text-align: center;
  justify-content: space-around;
}

.title{
  color:#C2BEC9;
}
</style>
