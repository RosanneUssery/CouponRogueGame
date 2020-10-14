import Vuex from 'vuex'
import Vue from "vue";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        dungeonLevel: 0
    },
    mutations: {
        increment (state) {
            state.dungeonLevel++
        }
    }
})

