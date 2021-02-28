/*
 * @Author: your name
 * @Date: 2020-12-23 16:07:36
 * @LastEditTime: 2021-02-09 13:42:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /yj-project/src/store/index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    hasLogin: uni.getStorageSync("hasLogin"),
    sessionKey: uni.getStorageSync("sessionKey"),
    messegeNum: 0,
    circle: uni.getStorageSync("circle"),
    position: uni.getStorageSync("position")
  },
  mutations: {
    login (state, userInfo) {
      state.hasLogin = uni.getStorageSync("hasLogin");
      state.sessionKey = uni.getStorageSync("sessionKey");
    },
    logout (state) {
      state.hasLogin = false;
      state.sessionKey = null;
    },
    setCircle (data) {
      uni.setStore
    }
  },
  getters: {
    getCircle: () => {
      return uni.getStorageSync("circle")
    }
  }

})

export default store
