import Vue from 'vue'
import Modal from './Modal'
import ModalApi from './ModalApi'
Modal.mixins = [ModalApi]
Vue.component(Modal.name, Modal)
export default Modal
