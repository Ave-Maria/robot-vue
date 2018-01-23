<template>
  <transition name='fade'>
  <div class='component SetRule' v-if="open">
      <div class="content">
        <template v-for="option in ruleOption">
          <TextSlotBar :title="option.complete" :rightIcon="(option.checked ? 'static/images/voiletCheck.png' : '')" @clickTitle="selectRule(option)"  @clickRight="selectRule(option)"></TextSlotBar>
        </template>
      </div>
      <div class="icon"></div>
  </div>

  </transition>
</template>
<script>
  import _ from 'lodash'
  import {alarmRuleOption} from '../../../../utils/const'
  export default {
    name: 'SetRule',
    props: {
      open: {
        type: Boolean,
        default: false
      },
      rule: {
        type: String,
        default: ''
      }
    },
    data: function () {
      return {
        ruleOption: []
      }
    },
    computed: {
    },
    methods: {
      setErrorImg (e) {
        e.target.src = 'static/images/uc-default-all-vatar@3x.png'
      },
      // 关闭组件
      closeSetting (data) {
        this.$emit('close', data)
      },
      selectRule (option) {
        // 切换选择
        option.checked = !option.checked
        // emit
        let inRuleOption = this.ruleOption.filter(item => item.checked)
        let rule = []
        if (inRuleOption.length === 0) {
          rule.push('NULL')
        } else if (inRuleOption.length === 7) {
          rule.push('EVERYDAY')
        } else {
          this.ruleOption.map(item => {
            if (item.checked) {
              rule.push(item.name)
            }
          })
        }
        this.$emit('close', rule.join(','))
      }
    },
    mounted: function () {
      // 复制星期一到星期天
      Object.keys(alarmRuleOption).map((text) => {
        if (/^W\d{1}$/.test(text)) {
          let rule = _.cloneDeep(alarmRuleOption[text])
          rule.checked = (this.rule === 'EVERYDAY' || this.rule.indexOf(text) > -1)
          rule.name = text
          this.ruleOption.push(rule)
        }
      })
    }
  }

</script>

<style lang='scss' scoped>
    /* 渐隐*/
    .fade-enter{
      opacity: 0;
      height:0;
    }
    .fade-enter-active{
      transition: opacity .8s, height .8s
    }
    .SetRule{
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1;
      height: 100%;
      width: 100%;
      color: #75707B;
      background-color:#fff;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .icon{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;

        img{
          max-width:80%;
        }
      }
      .content {
        background: #fff;

        .option{
          line-height:3.5rem;
          border-bottom:1px solid rgba(215, 213, 219, .5);
          margin: 0 .5rem;
        }
        .active{
          color:#B585FF;
        }
        .text{
          font-weight:bold;
          padding: 1rem;
          color:#fff;
          background: #B585FF;
        }
      }
    }

</style>
