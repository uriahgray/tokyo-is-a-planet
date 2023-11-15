// src/store/index.js
import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      audioUrl: null,
      isPlaying: false,
      showSeekbar: false
    };
  },
  mutations: {
    setAudioUrl(state, url) {
      state.audioUrl = url;
    },
    setIsPlaying(state, isPlaying) {
      state.isPlaying = isPlaying;
    },
    setShowSeekbar(state, show) { // Add this mutation
      state.showSeekbar = show;
    }    
  },
  actions: {
    clearAudio({ commit }) {
      commit('setAudioUrl', null);
      commit('setIsPlaying', false);
      commit('setShowSeekbar', false);
    },
    loadAudio({ commit }, payload) {
      commit('setAudioUrl', payload.url);
      commit('setIsPlaying', false);
      commit('setShowSeekbar', payload.showSeekbar);
    }
    ,
    playAudio({ commit }, payload) {
      commit('setAudioUrl', payload.url);
      commit('setIsPlaying', true);
      commit('setShowSeekbar', payload.showSeekbar);
    }    
  }
});
