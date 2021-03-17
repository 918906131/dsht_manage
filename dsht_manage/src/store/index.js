import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    shadow_active: false,
    nov_title: '用户管理',
    nov_son_title: '用户列表'
  },
  mutations: {
    modify_state(state, payload) {
      // 变更状态
      state.shadow_active = payload
    },
    modify_nov(state, payload) {
      // 变更状态
      state.nov_title = payload
    },
    modify_nov_son(state, payload) {
      // 变更状态
      state.nov_son_title = payload
    }
  },
  actions: {},
  modules: {}
})