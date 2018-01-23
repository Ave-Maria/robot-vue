<template>
  <div class="search-bar">
    <input class="text" autocomplete="off" placeholder="搜索专辑、故事、歌曲" @focus="goSearch()"/>
    <span><img src="static/images/MagnifierHomePage@2x.png" @click="goSearch()" /></span>    
  </div>
</template>
<script>
  export default {
    name: 'TransitionTopBar',
    data: function () {
      return {
      }
    },
    methods: {
      // 跳转
      to (router) {
        if (!router) return
        this.$router.push(router)
      },
      // 设置搜索内容并跳转页面
      goSearch () {
        this.to({path: '/searchTransition'})
      }
    },
    computed: {
    },
    watch: {
    },
    mounted: function () {
    }
  }

</script>

<style scoped>
.search-bar{
  position: absolute;
  z-index: 2;
  text-align: center;
  width: 100%;
  top: 0;
  border: none;
  padding: .5rem 0;
}
input{
  width: 90%;
  margin-left:5%;
  height: 2.2rem;
  border: none;
  border-radius: 1.8rem;  
  float: left;  
}
input.text{
  text-align:left; 
  font-size:1rem;   
  color: #A79EB6;
  letter-spacing: -0.39px;
  padding-left: 1rem;
  padding-right: 2.8rem;
}
span{
  display:inline-block;
  width:2.2rem;
  height:2.2rem;  
  margin-left:-2.8rem;  
  margin-top:0rem;
  float: left;
}
span img{
  width:100%;  
}

</style>
