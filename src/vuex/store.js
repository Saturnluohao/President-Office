import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    circle_pack_data: null
  },
  mutations: {
    setData(state, data){
      state.circle_pack_data = data;
    }
  }
})
