import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import {homePage} from './homePage/modules'
import {Cation} from './Cation/modules'

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    homePage,
    Cation
  }
})
