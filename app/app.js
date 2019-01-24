import Vue from 'nativescript-vue';

import Home from './components/Home';
import Login from './components/Login';
import BackendService from './services/BackendService';
import store from './store';

// Vue.config.silent = false;
const backendService = new BackendService();
const debug = process.env.NODE_ENV !== 'production';

new Vue({

    // template: `
    //     <Frame>
    //         <Home />
    //     </Frame>`,

    components: {
        Home
    },
    store,
    render: h => {
        if (debug) console.log('Logged in? ', backendService.isLoggedIn());
        return h('frame', [h(backendService.isLoggedIn() ? Home : Login)]);
    }
}).$start();
