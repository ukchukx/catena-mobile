import Vue from 'nativescript-vue';
import RadListView from 'nativescript-ui-listview/vue';
import RadCalendarPlugin from 'nativescript-ui-calendar/vue';
import { CheckBox } from 'nativescript-checkbox';

import Home from './components/Home';
import Login from './components/Login';
import store from './store';

// Vue.config.silent = false;
Vue.use(RadListView);
Vue.use(RadCalendarPlugin);
Vue.registerElement('CheckBox', () => CheckBox, {
  model: {
    prop: 'checked',
    event: 'checkedChange'
  }
});

new Vue({
  components: {
    Home
  },
  store,
  render: h => h('frame', [h(store.getters.isLoggedIn ? Home : Login)])
}).$start();
