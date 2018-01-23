import Vue from 'vue'
import {EventMethods} from './EventBus'

Vue.mixin({
  methods: EventMethods
})
