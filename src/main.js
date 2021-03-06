// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ViewUI from 'view-design'
import store from './vuex/store'
import 'view-design/dist/styles/iview.css'
import * as d3 from "d3";
import axios from "axios";

require('../mock/index.js');

Vue.use(ViewUI)
Vue.config.productionTip = false
Vue.config.silent = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});
