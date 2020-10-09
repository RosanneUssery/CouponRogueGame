import Vue from 'vue'
import Vuex from 'vuex'

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

