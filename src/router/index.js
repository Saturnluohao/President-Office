import Vue from 'vue'
import Router from 'vue-router'
import CirclePack from "../components/CirclePack";
import HomePage from "../components/HomePage";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/circle_pack',
      name: 'circle_pack',
      component: CirclePack
    },{
      path: '/',
      name: 'home',
      component: HomePage
    }
  ]
})
