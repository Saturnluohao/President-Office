import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    circle_pack_data: null,
    student_data: null,
    candidate_data: null
  },
  mutations: {
    setData(state, data){
      state.circle_pack_data = data;
    },
    addStudent(state, payload){
      state.student_data.push(payload);
    },
    removeCandidate(state, id){
      state.candidate_data = state.candidate_data.filter(d => d.v2 != id);
    }
  },
  getters: {
    getCandidate: (state) => (id) => {
      return state.candidate_data.find(d => d.v2 === id);
    },
    hasStudents: state => {
      return state.student_data != null;
    },
    hasCandidates: state => {
      return state.candidate_data != null;
    }
  }

})
