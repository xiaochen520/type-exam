import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css';
import 'view-design/dist/styles/iview.css';
import { get, post } from './util/request'
import { Radio, RadioGroup, Modal, Button, Message } from 'view-design';

Vue.component('Radio', Radio);
Vue.component('RadioGroup', RadioGroup);
Vue.component('Modal', Modal);
Vue.component('Button', Button);

Vue.prototype.$get = get;
Vue.prototype.$post = post;
Vue.prototype.$Message = Message;
Vue.config.productionTip = false

Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el, binding) {
    if(binding.value == true) {
      el.focus()
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
