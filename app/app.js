import Vue from 'nativescript-vue';

import Home from './components/Home';
import Login from './components/Login';
import store from './store';

// Vue.config.silent = false;
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
        if (debug) console.log('Logged in? ', store.getters.isLoggedIn);
        return h('frame', [h(store.getters.isLoggedIn ? Home : Login)]);
    }
}).$start();
