// store/index.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    audioUrl: null,
    hideTimeline: true,
    audioTitle: "Tokyo is a Planet broadcast standby"
  },
  mutations: {
    setAudioUrl(state, url) {
      state.audioUrl = url;
    },
    setAutoplay(state, autoplay) {
      state.autoplay = autoplay;
    },    
    setHideTimeline(state, hideTimeline) {
      state.hideTimeline = hideTimeline;
    },
    setAudioTitle(state, title) {
      state.audioTitle = title;
    }    
  },
  actions: {
    clearAudio({ commit }) {
      commit('setAudioUrl', null);
    },
    loadAudio({ commit }, payload) {
      commit('setAudioUrl', payload.url);
      commit('setAutoplay', payload.autoplay); // New mutation for autoplay
    },    
    playAudio({ commit }, payload) {
      commit('setAudioUrl', payload.url);
      commit('setAudioTitle', payload.title);
      commit('setHideTimeline', payload.hideTimeline);
      commit('setAutoplay', payload.autoplay);
    }
  }
});
