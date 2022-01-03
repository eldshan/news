import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const store = new Vuex.Store({
	state:{
		userinfo:uni.getStorageSync('USERINFO') || {},
		historyLists : uni.getStorageSync("__history") || []
	},
	mutations:{
		SET_USER_INFO(state,userinfo) {
			state.userinfo = userinfo
		},
		SET_HISTORY_LISTS(state,history) {
			state.historyLists = history
		},
		CLEAR_HISTORY(state) {
			state.historyLists = []
		}
	},
	actions: { 
		set_userinfo({commit},userinfo) {
			uni.setStorageSync('USERINFO',userinfo)
			commit('SET_USER_INFO',userinfo)
		},
		set_history({commit,state},history) {
			let list = state.historyLists
			list.unshift(history)
			uni.setStorageSync("__history",list)
			commit('SET_HISTORY_LISTS',list)
		},
		clearHistory({commit}){
			uni.removeStorageSync("__history",[])
			commit('CLEAR_HISTORY')
		}
	}
})

export default store