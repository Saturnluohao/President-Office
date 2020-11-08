import Vue from 'vue'
import Router from 'vue-router'
import CirclePack from "../components/CirclePack";
import HomePage from "../pages/HomePage";
import DetailPage from "../pages/DetailPage";

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
    },{
      path: '/detail',
      name: 'detail',
      component: DetailPage
    }
  ]
})
