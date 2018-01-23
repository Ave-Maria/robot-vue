<template>
    <transition name="modal">
        <div id="v-modal-wrap" :class="{blackBg: type != 'tip'}" v-show="show" @touchmove.prevent>
            <!-- alert;prompt;confirm-->
            <div class="v-modal-dialog" v-if="type != 'tip'">
                <div id="v-modal-title" v-show="title">{{title}}</div>
                <div id="v-modal-body">
                    <slot name="slotA" v-if="slot == 'slotA'"></slot>
                    <slot name="slotB" v-if="slot == 'slotB'"></slot>
                    <slot name="slotC" v-if="slot == 'slotC'"></slot>

                    <div v-if="!slot" :class="['v-modal-message',{textLeft:(type == 'prompt')}]">{{message}}</div>

                    <template v-if="type == 'prompt'">
                        <form @submit="onSubmitForm" class="v-modal-prompt-form">
                            <div v-if="inputType == 'text'" >
                              <input type="text" ref="input" v-model="input" class="v-modal-input">
                            </div>
                            <div v-if="inputType == 'number'">
                              <input  type="number" step="0.01" ref="input" v-model="input" class="v-modal-input">
                            </div>
                            <div v-if="inputType == 'checkbox'" class="v-modal-checkbox-box">
                              <label class="checkbox"><input type="checkbox" ref="input" v-model="input"><i>✓</i></label>
                              <span class="text">{{inputText}}</span>
                            </div>
                        </form>
                    </template>
                </div>
                <div id="v-modal-footer">
                    <button class="v-modal-btn slave" @click="cancel()" v-show="type == 'confirm' || type == 'prompt'">取消</button>
                    <button class="v-modal-btn primary" @click="ok()" v-show="type">{{okBtn}}</button>
                </div>
            </div>
            <!-- tip-->
            <div class="v-modal-dialog blackBg whiteColor width_p50" v-if="type == 'tip'">
                <div id="v-modal-body" style="text-align:center;" v-show="message">{{message}}</div>
            </div>
        </div>
    </transition>
</template>

<script>
    import ModalApi from './ModalApi'
    import modalEventBind from './ModalEventBind'
    console.log(ModalApi)
    export default {
      name: 'modal',
      data: function () {
        return {
          okBtn: '确定',
          show: false,
          type: '',
          message: '',
          slot: null,
          title: '',
          callback: null,
          input: '',
          inputType: 'text',
          inputText: ''
        }
      },
      methods: {
        modal: function (message, title) {
          if (typeof message === 'string') {
            this.message = message
            this.slot = null
          } else if (typeof message === 'object' && message.slot) {
            this.slot = message.slot
          }
          this.title = title
          this.callback = null
          this.input = ''
          this.show = true
        },
        modalTip: function (params = {}) {
          this.type = 'tip'
          this.modal(params.message, null)
          // this.callback = params.callback
          var self = this
          setTimeout(function () {
            if (self.type === 'tip') {
              self.show = false
            }
            if (params.callback && this.type === 'tip') {
              params.callback()
            }
          }, params.duration || 1000)
        },
        modalAlert: function (params = {}) {
          this.type = 'alert'
          this.modal(params.message, params.title || '')
          this.callback = params.callback
        },
        modalConfirm: function (params = {}) {
          this.type = 'confirm'
          this.modal(params.message, params.title || '')
          this.okBtn = (params.option && params.option.okBtn) ? params.option.okBtn : '确定'
          this.callback = params.callback
        },
        modalPrompt: function (params = {}) {
          this.type = 'prompt'
          this.modal(params.message, params.title || '')
          this.callback = params.callback
          this.inputType = params.options.inputType || 'text'
          this.inputText = params.options.inputText || ''
          this.$nextTick(() => {
            this.$refs.input.focus()
          })
        },
        ok: function () {
          var self = this
          this.show = false
          setTimeout(function () {
            // if (self.callback) {
            //   self.callback(self.type === 'prompt' ? self.input : true)
            // }
            if (self.callback) {
              let post = {
                isPrompt: (self.type === 'prompt'),
                input: self.input
              }
              self.callback(self.type === 'prompt' ? post : true)
            }
          }, 0)
        },
        cancel: function () {
          var self = this
          this.show = false
          setTimeout(function () {
            if (self.callback) {
              self.callback(self.type === 'prompt' ? undefined : false)
            }
          }, 0)
        },
        onSubmitForm: function (e) {
          e.preventDefault()
          this.ok()
          return false
        }
      },
      mounted () {
        modalEventBind(this)
      }
    }
</script>

<style scoped>
    @import "Modal.css";
</style>
