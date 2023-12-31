<template>
  <div class="player">
    <div class="player-title">
      <p>{{title}} {{title}}</p>
      <p>{{title}} {{title}}</p>
    </div>      
    <div class="player-controls">
      <div id="play">
        <button @click.prevent="togglePlay" :title="playTitle" class="player-control">
          {{ playing ? 'Pause' : 'Play' }}
        </button>
      </div>
      <div id="seek" v-if="seekbar">
        <div class="player-timeline">
          <div :style="progressStyle" class="player-progress"></div>
          <div @click="seek" class="player-seeker" title="Seek"></div>
        </div>
        <div class="player-time">
          <div class="player-time-current">{{ currentSecondsConverted }}</div>
          <div class="player-time-total">{{ durationSecondsConverted }}</div>
        </div>
      </div>
      <div id="mute" v-show="!showVolume">
        <button @click.prevent="mute" class="player-control" title="Mute">
          <!-- SVG icons for mute and unmute -->
        </button>
      </div>
    </div>
    <audio ref="audio" :src="file" @timeupdate="update" @loadeddata="load" @pause="playing = false" @play="playing = true" preload="auto" style="display: none;"></audio>
  </div>
</template>

<script>
export default {
  name: 'AudioPlayer',
  props: {
    autoPlay: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: null
    },
    file: {
      type: String,
      default: null
    },
    loop: {
      type: Boolean,
      default: false
    },
    seekbar: { // Correctly placed at the same level as other props
      type: Boolean,
      default: true // Default to true to show the seekbar unless specified
    }
  },
  data() {
    return {
      currentSeconds: 0,
      durationSeconds: 0,
      loaded: false,
      looping: false,
      playing: false,
      previousVolume: 35,
      showVolume: false,
      volume: 100
    };
  },
  computed: {
    currentSecondsConverted() {
      return convertTimeHHMMSS(this.currentSeconds);
    },
    durationSecondsConverted() {
      return convertTimeHHMMSS(this.durationSeconds);
    },
    muted() {
      return this.volume === 0;
    },
    percentComplete() {
      return parseInt((this.currentSeconds / this.durationSeconds) * 100);
    },
    progressStyle() {
      return { width: `${this.percentComplete}%` };
    },
    playTitle() {
      return this.playing ? 'Pause' : 'Play';
    }
  },
  watch: {
    playing(newValue) {
      if (newValue) {
        this.playAudio();
      } else {
        this.$refs.audio.pause();
      }
    },    
    autoPlay(newVal) {
      if (newVal && this.loaded) {
        this.playAudio();
      }
    },
    volume(value) {
      this.$refs.audio.volume = value / 100;
    },
    file(newFile, oldFile) {
        if (newFile !== oldFile) {
        this.updateAudioSource(newFile);
        }
    }    
  },
  methods: {
    togglePlay() {
      this.playing = !this.playing;
    },
    mute() {
      if (this.muted) {
        this.volume = this.previousVolume;
      } else {
        this.previousVolume = this.volume;
        this.volume = 0;
      }
    },
    seek(e) {
      if (!this.loaded) return;

      const bounds = e.target.getBoundingClientRect();
      const seekPos = (e.clientX - bounds.left) / bounds.width;
      this.$refs.audio.currentTime = parseInt(this.$refs.audio.duration * seekPos);
    },
    update() {
      this.currentSeconds = parseInt(this.$refs.audio.currentTime);
    },
  updateAudioSource(newFile) {
    if (this.$refs.audio && newFile) {
      this.$refs.audio.src = newFile;
      this.$refs.audio.load(); // Load the new audio source
      if (this.autoPlay) {
        this.playAudio();
      }
    }
  },
  load() {
    if (this.$refs.audio.readyState >= 2) {
      this.loaded = true;
      this.durationSeconds = parseInt(this.$refs.audio.duration);
      // Check if autoplay is needed when loaded
      if (this.autoPlay) {
        this.playAudio();
      }
    } else {
      throw new Error("Failed to load sound file.");
    }
    },    
    playAudio() {
      if (!this.loaded) {
        // Avoid playing if audio is not loaded
        return;
      }
      this.$refs.audio.play()
        .then(() => {
          this.playing = true;
        })
        .catch(error => {
          console.error("Audio playback failed:", error);
          // Handle playback failure, e.g., due to browser autoplay policy
        });
    },
  },
  created() {
    this.looping = this.loop;
  }
};

function convertTimeHHMMSS(val) {
  let hhmmss = new Date(val * 1000).toISOString().substr(11, 8);
  return hhmmss.indexOf("00:") === 0 ? hhmmss.substr(3) : hhmmss;
}
</script>

<style>

.player-wrapper {
  align-items: center;
  background-color: #fff;
  display: flex;
  height: 100vh;
  justify-content: center;
}

.player {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  color: #404040;
  display: inline-block;
  line-height: 1.5625;
  position: relative;
  width:100%;
}

.player-controls {
  display: flex;
}
.player-controls > div {
  border-right: 1px solid #e0e0e0;
}
.player-controls > div:last-child {
  border-right: none;
}

.player-control {
  background-color: white;
  border: none;
  color: #404040;
  cursor: pointer;
  display: flex;
  line-height: 0;
  margin: 0;
  padding: 1em;
  text-decoration: none;
}
.player-control > svg {
  width: 1.125rem;
}

#seek {
  flex-grow: 1;
}

.player-timeline {
  background-color: #e0e0e0;
  height: 50%;
  position: relative;
}
.player-timeline .player-progress,
.player-timeline .player-seeker {
  bottom: 0;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
}
.player-timeline .player-progress {
  background-color: #404040;
  z-index: 1;
}
.player-timeline .player-seeker {
  cursor: pointer;
  width: 100%;
  z-index: 2;
}

.player-time {
  display: flex;
  justify-content: space-between;
}
.player-time .player-time-current {
  font-weight: 700;
  padding: 0 0.3125rem;
}
.player-time .player-time-total {
  opacity: 0.5;
  padding: 0 0.3125rem;
}

.player-title {
  display: flex;
  mask-image: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, black 25%, black 75%, rgba(0, 0, 0, 0) 100%);
  flex-grow: 1;
  overflow: hidden;
}
.player-title p {
  animation: slide-x 10s linear infinite;
  white-space: nowrap;
}
@keyframes slide-x {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

.player-volume {
  display: inline-block;
  height: 1.1rem;
  margin: 0 0 0 0.625rem;
  width: 7.925rem;
}

</style>
