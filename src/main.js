// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
import axios from 'axios'
// import VueAxios from 'vue-axios'
Vue.prototype.$axios = axios;
Vue.prototype.API2='https://api.9xy.cn/Tp/';
// Vue.prototype.debug='debug=0';
Vue.prototype.rt='rt=h5';
// Vue.use(VueAxios, axios)
Vue.config.productionTip = false;
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
// 用于网页测试登陆
Vue.prototype.$myLogin = function (){
  axios({
    url: "https://api.9xy.cn/Tp/member/debugSession?rt=h5"
  })
  .then(res => {
    VueCookies.set('trd_session',res.data.info);
  });
};
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
