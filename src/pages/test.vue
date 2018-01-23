<template>
  <div class='pages test'>
    <div @click="addData">click add data</div>
    <div @click="delData">click del data</div>
    
    <div>playList:1.page = {{playList.page}}</div>

    <div v-for="item in data" >
      {{item.musicTitle}}
    </div>
  </div>
</template>
<script>
  // import _ from 'lodash'
  import {mapState, mapActions} from 'vuex'
  import {setTitle} from '../utils/index'
  import {actions} from '../utils/const'
  export default {
    data: function () {
      return {
        data: [],
        page: 1,
        count: 10
      }
    },
    computed: {
      ...mapState({
        playList: state => state.mqtt.playList
      })
    },
    watch: {
      playList (newVal, lastVal) {
        if (!newVal.status || newVal.status === actions.create) return
        this.data = newVal.data
        console.log(newVal, lastVal)
      }
    },
    methods: {
      ...mapActions('mqtt', [
        'playlistGetData',
        'playlistDeleteData'
      ]),
      addData () {
        let self = this
        let promise = this.playlistGetData({page: this.page, count: this.count})
        promise.then((data) => {
          self.page = self.page + 1
          data.data.map(item => {
            self.data.push(item)
          })
        }, (error) => {
          console.log('error', error)
        })
      },
      delData () {
        this.playlistDeleteData()
      }
    },
    beforeMount () {
      setTitle('test')
    },
    mounted: function () {
    }
  }

</script>

<style lang='scss' scoped>
    .test{
    height:100%;
    width:100%;
    color: #ccc;
    background: #F2F2F4;
    text-align: center;

    img{
      width:auto;
      max-width:100%;
      width: 3rem;
    }

    .header{
      min-height:11rem;
      padding:.5rem 0rem;
      background: linear-gradient(#8e46ff, #b483ff);
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left,.right{
        width:3rem;
      }
      .avatar{
        display: flex;
        flex-direction: column;
        align-items: center;

        .name{
          font-size:1rem;
        }
        img{
          border-radius: 100%;
        }
      }
      .right{
        text-align: right;
        align-self: flex-start;
      }
    }

    .list{
      background: #fff;
      margin-bottom:.5rem;
    }
    .classify{
      background: #fff;
    }

    .no-bind{
      position: fixed;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      color: #75707B;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .text{
        line-height:5rem;
        color: rgba(117, 111, 123, 0.5);
      }
      .button{
        width: 70%;
        padding: .5rem .7rem;
        margin: 1rem 0;
        border: 0;
        border-radius: 1rem;
        background: #B585FF;
        color: #fff;
        margin: 0 auto;
      }
    }
  }

</style>
