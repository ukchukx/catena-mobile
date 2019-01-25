import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import { getString } from 'tns-core-modules/application-settings';

import mutations from './mutations.js';
import * as actions from './actions.js';
import * as getters from './getters';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';
const tasks = getString('tasks');
const user = getString('user');

const store = new Vuex.Store({
  state: {
    tasks: tasks ? JSON.parse(tasks) : [],
    user: user ? JSON.parse(user) : {},
    token: getString('token'),
    pendingTasks: []
  },
  mutations,
  actions,
  getters,
  strict: debug,
});

Vue.prototype.$store = store;
export default store;
