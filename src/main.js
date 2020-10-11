import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css';
import 'view-design/dist/styles/iview.css';
import { get, post } from './util/request'
import { Radio, RadioGroup, Modal, Button, Message, Table } from 'view-design';

Vue.component('Radio', Radio);
Vue.component('RadioGroup', RadioGroup);
Vue.component('Modal', Modal);
Vue.component('Button', Button);
Vue.component('Table', Table);

Vue.prototype.$get = get;
Vue.prototype.$post = post;
Vue.prototype.$Message = Message;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
