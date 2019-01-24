import Vue from 'nativescript-vue';
import Vuex from 'vuex';

import mutations from './mutations.js';
import * as actions from './actions.js';
import * as getters from './getters';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
  state: {
    tasks: [],
    user: {},
    token: '',
    pendingTasks: []
  },
  mutations,
  actions,
  getters,
  strict: debug,
});

Vue.prototype.$store = store;
export default store;
