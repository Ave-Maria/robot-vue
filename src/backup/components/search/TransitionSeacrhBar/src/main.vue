<template>
  <div class="components search-title-bar">

    <div class="search-top">
      <div class="search-container">
        <div class="search-left">
            <div class="search-left-bg">
              <div class="search-left-icon">
                <div class="search-select">
                  <span><img src="static/images/MagnifierHomePage@2x.png"/></span>
                </div>
              </div>
              <div class="search-left-text">
                  <div class="search-text">
                    <input class="text" placeholder="搜索关键字" ref="keyword" v-model="keyword"  @keyup.enter="inputSearch()" v-focus/>
                    <span v-show="keyword" @click="clearSearch()">
                      <img src="static/images/search-delete.png"/>
                    </span>
                  </div>
              </div>
            </div>
        </div>
        <div width="15" tablet="5" desktop="15" class="search-right">
          <div :class="['filter-select', {active: keyword}]" @click="inputSearch()">搜索</div>
        </div>
      </div>
    </div>

  </div>  
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import {countLength, trim} from '../../../../utils/index'
  export default {
    name: 'TransitionSeacrhBar',
    props: {
    },
    data: function () {
      return {
        topPopup: false,
        nameLength: 40,
        keyword: '',
        bfkeyword: ''
      }
    },
    methods: {
      ...mapActions('search', [
        'setKeyword'
      ]),
      // 清除搜索
      clearSearch () {
        this.keyword = ''
      },
      // 回车搜索
      inputSearch () {
        if (!this.keyword) return
        this.setKeyword(this.keyword)
        this.$router.push({path: '/search'})
      },
      // 判断是否超过长度
      isOverLength () {
        let length = countLength(this.keyword)
        // 检查
        return length > this.nameLength
      }
    },
    watch: {
      keyword () {
        // 检查
        if (!this.isOverLength()) {
          this.keyword = this.bfkeyword = trim(this.keyword, 'g')
        } else {
          this.keyword = this.bfkeyword
        }
      },
      keywordText () {
        this.keyword = this.keywordText
      }
    },
    computed: {
      ...mapState({
        keywordText: state => state.search.keyword
      })
    },
    directives: {
      focus: {
        // 指令的定义
        inserted: function (el) {
          el.focus()
        }
      }
    },
    mounted () {
      this.bfkeyword = this.keyword = this.keywordText
    }
  }

</script>

<style lang="scss" scoped>
.search-title-bar{
  .search-top{
    width:100%;
    position: fixed;
    top: 0;
    left: 0;
    /*z-index: 501;*/

    .search-container{
      display:flex;
      align-items:center;
      background-color: #B585FF;
      height: 4.25rem;
      
      .search-left{
          flex:1;
          margin:0 0 0 1rem;
          .search-left-bg{
            border-radius: 1.8rem;  
            background:#fff;
            padding:0.2rem .5rem;
            display:flex;
            align-items:center;

            .search-left-icon{
              width: 2rem;
            }
            .search-left-text{
              border-left:1px solid #D3CEDA;
              flex: 1;
            }
            .search-select{
              display: flex;
              align-items:center;

              /*select{
                padding:0 .8rem 0 .3rem;
                color:#B585FF;
                border:none;
                appearance:none;
                -moz-appearance:none;
                -webkit-appearance:none;
                background: url('./filter-down-icon.png') no-repeat scroll right center;

                &.active{
                  background: url('./filter-top-icon.png') no-repeat scroll right center;
                }
              }*/
              span {
                display:inline-block;
                width:2rem;
                display: flex;
                align-items: center;
                
                img{
                  width:100%;  
                }
              }
            }
            .search-text{
              display: flex;
              align-items:center;

              input{
                flex:1;
                height:1.4rem;
                text-indent:.3rem;
                color:#A79EB6;
                border:none;
                :focus{
                  border:0;
                }
              }
                
              span {
                display:inline-block;
                width:2rem;
                display: flex;
                align-items: center;
                justify-content: flex-end;

                img{
                  width:80%;  
                }
              }
          }
        }
      }

      .search-right{
        width:2rem;
        margin:0 1rem;
        .filter-select{
          color:#dedce2;
          text-align: center;
          &.active {
            color:#fff;
          }
          /*
          position: relative;
          right: 0.8rem;
          padding:0 .8rem 0;
          background: url('./filter-icon-open.png') no-repeat scroll right center;
          
          &.active{
            background: url('./filter-icon-close.png') no-repeat scroll right center;
          }*/
        }
      }
    }
  }
}
</style>
