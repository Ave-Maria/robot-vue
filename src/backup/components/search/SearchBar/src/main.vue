<template>
  <div class="components search-title-bar">
    <div :class="['search-tops',{active:topPopup}]">
      <div class="search-container">
        <div width="85" tablet="85" desktop="95" class="search-left">
            <div class="search-left-bg">
              <div class="search-left-icon">
                <div class="search-select">
                  <select :value="kind" ref="kind" @change="selectKind($refs.kind.value)">
                    <option value="tracks">单曲</option>
                    <option value="albums">专辑</option>
                  </select>
                </div>
              </div>
              <div class="search-left-text">
                  <div class="search-text">
                    <input class="text" placeholder="搜索关键字" ref="keyword" v-model="keyword"  @keyup.enter="inputSearch()"/>
                    <span><img src="static/images/MagnifierHomePage@2x.png" @click="inputSearch()"/></span>
                  </div>
              </div>
            </div>
        </div>
        <div width="15" tablet="15" desktop="15" class="search-right">
          <div :class="['filter-select',{active: topPopup}]" @click="toggleFilter">筛选</div>
        </div>
      </div>
    </div>
    <popup :value="topPopup"  position="top" class="search-popup-top" @on-hide="toggleFilter" :popup-style="{zIndex: 556}">
        <div class="popup-container">
            <div class="popup-class">
                  <h3>分类</h3>
                  <div class="filter-class">
                      <div class="filter-item" v-for="(sort, index) in sorts" :key="index">
                          <label :class="['class-button', {active: sort.checked}]">
                            <input type="checkbox" :value="sort.value" @click="toggleSortChecked({index: index, sort: sort})">
                            {{sort.title}}
                          </label>
                      </div>
                  </div>
            </div>
            <!--<div class="popup-class popup-age">
                  <h3>年龄</h3>
                  <div class="filter-class">
                      <div class="filter-item" v-for="(age, index) in ages" :key="index">
                          <label :class="['class-button', {active: age.checked}]">
                            <input type="checkbox" :value="age.value" @click="toggleAgeChecked({index: index, age: age})">
                            {{age.title}}
                          </label>
                      </div>
                  </div>
            </div>-->
            <div class="popup-action">
                <div class="class-item">
                  <input type="button" value="重置"  class="class-button reset" @click="clear">
                </div>  
                <div class="class-item">
                  <input type="button" value="确定"  class="class-button save" @click="save">
                </div>
            </div>
        </div>
    </popup>

  </div>  
</template>
<script>
  import {Popup} from 'vux'
  import {mapState, mapActions} from 'vuex'
  import {countLength, trim} from '../../../../utils/index'
  export default {
    name: 'SearchBar',
    components: {
      Popup
    },
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
        'setKeyword',
        'addKeywordList',
        'toggleSortChecked',
        'clearSorts',
        'toggleAgeChecked',
        'clearAges',
        'selectKind',
        'search'
      ]),
      // 切换筛选下拉框
      toggleFilter () {
        this.topPopup = !this.topPopup
      },
      clear () {
        this.clearSorts()
        this.clearAges()
      },
      save () {
        this.search()
        this.toggleFilter()
      },
      // 回车搜索
      inputSearch () {
        if (!this.keyword) return
        this.setKeyword(this.keyword)
        this.search()
      },
      // 判断是否超过长度
      isOverLength () {
        let length = countLength(this.keyword)
        // 检查
        return length > this.nameLength
      }
      // ,
      // bfcheckKeyword (e) {
      //   let dom = this.$refs.keyword
      //   let keyword = dom.value
      //   let length = countLength(keyword)
      //   // 检查
      //   if (this.nameLength >= length) {
      //     this.bfkeyword = keyword
      //   }
      // },
      // // 检查名字
      // checkKeyword (e) {
      //   // @keyup="inputSearch($refs.keyword.value)"
      //   let dom = this.$refs.keyword
      //   let keyword = dom.value
      //   let length = countLength(keyword)
      //   // 检查
      //   if (length > this.nameLength) {
      //     dom.value = this.bfkeyword
      //     // this.tip('最多允许输入8个汉字或16个字符')
      //     return false
      //   }
      //   // 回车键提交保存数据
      //   if (e.keyCode === 13) {
      //     this.inputSearch()
      //   }
      // }
    },
    watch: {
      keyword () {
        // 检查
        if (!this.isOverLength()) {
          // this.bfkeyword = this.keyword
          this.keyword = this.bfkeyword = trim(this.keyword, 'g')
        } else {
          this.keyword = this.bfkeyword
        }
      }
    },
    computed: {
      ...mapState({
        keywordText: state => state.search.keyword,
        kind: state => state.search.kind,
        keywordList: state => state.search.keywordList,
        sorts: state => state.search.sorts,
        ages: state => state.search.ages
      }),
      windowWidth () {
        return window.innerWidth + 'px'
      }
    },
    mounted () {
      this.bfkeyword = this.keyword = this.keywordText
    }
  }

</script>

<style lang="scss" scoped>
.search-title-bar{
  margin-bottom:4.25rem;
}
.search-popup-top{
  height:100%;
  width:100%;
  padding: 4.25rem 1rem 0;
  color:#8A848F;
  background:#fff;

  .popup-container{
    /*margin-top:4.25rem;*/
  }

  .popup-class{
      h3{
        text-align: left;
        font-size:1rem;
        font-weight:500;
        margin:1rem .25rem .5rem;
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

  .popup-action{
        display:flex;
        align-items:center;
        margin:0 .5rem;

      .class-item{
        flex:1;
        margin:.5rem;
      }
      .class-button{
        width:100%;
        padding:.5rem .7rem;
        margin:1rem 0;
        border:0;
        border-radius: 1rem;
        background: #C2BEC9;
        color:#fff;

        &.save{
          background: #B585FF;
          color:#fff;
        }
      }
  }
}

.search-tops{
  width:100%;
  position: fixed;
  top: 0;
  left: 0;
  
  &.active{
    z-index: 557;
  }
  

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
            width: 3.25rem;
          }
          .search-left-text{
            flex: 1;
          }
          .search-select{
            border-right:1px solid #D3CEDA;
            select{
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
              
              img{
                width:100%;  
              }
            }
        }
      }
    }

    .search-right{
      width:2.75rem;
      margin:0 1rem;

      .filter-select{
        color:#fff;
        padding-right: .5rem;
        background: url('./filter-icon-open.png') no-repeat scroll right center;
        
        &.active{
          background: url('./filter-icon-close.png') no-repeat scroll right center;
        }
      }
    }
  }
}

</style>
