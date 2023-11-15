<template>
  <div id="app">
    <div class="player">
      <div class="state" :class="[{ published: isPublished }]"></div>
      <div class="audio-player">
        <div class="timeline">
          <div class="progress" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="controls">
          <div class="play-container">
            <i
              class="bi"
              :class="isPaused ? 'bi-play-fill' : 'bi-pause-fill'"
              @click="playPause"
            >
            Play
            </i>
          </div>
          <div class="time">
            <div class="current">{{ current }} / {{ length }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AudioPlayer',
props: {
    file: {
      type: String,
      default: null
    }
  },  
  data() {
    return {
      isPublished: true,
      isPaused: true,
      isMuted: false,
      audio: null,
      progress: 0,
      current: "0:00",
      length: "",
      volume: 100,
    };
  },
  mounted() {
    const audioPlayer = document.querySelector(".audio-player");

    const timeline = audioPlayer.querySelector(".timeline");
    timeline.addEventListener(
      "click",
      (e) => {
        const timelineWidth = window.getComputedStyle(timeline).width;
        const timeToSeek =
          (e.offsetX / parseInt(timelineWidth)) * this.audio.duration;
        this.audio.currentTime = timeToSeek;
      },
      false
    );

    const volumeSlider = audioPlayer.querySelector(".controls .volume-slider");
    volumeSlider.addEventListener(
      "click",
      (e) => {
        const sliderWidth = window.getComputedStyle(volumeSlider).width;
        const newVolume = e.offsetX / parseInt(sliderWidth);
        this.audio.volume = newVolume;
        this.volume = newVolume * 100;
      },
      false
    );

    this.audio = new Audio(this.file);
    this.audio.addEventListener(
      "loadeddata",
      () => {
        this.length = this.getTimeCodeFromNum(this.audio.duration);
        this.audio.volume = 1;
      },
      false
    );
    setInterval(() => {
      this.progress = (this.audio.currentTime / this.audio.duration) * 100;
      this.current = this.getTimeCodeFromNum(this.audio.currentTime);
    }, 500);
  },
  methods: {
    volMute() {
      this.audio.muted = !this.audio.muted;
      this.isMuted = !this.isMuted;
    },
    playPause() {
      if (this.audio.paused) {
        this.isPaused = false;
        this.audio.play();
      } else {
        this.isPaused = true;
        this.audio.pause();
      }
    },
    getTimeCodeFromNum(num) {
      let seconds = parseInt(num);
      let minutes = parseInt(seconds / 60);
      seconds -= minutes * 60;
      const hours = parseInt(minutes / 60);
      minutes -= hours * 60;

      if (hours === 0)
        return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
      return `${String(hours).padStart(2, 0)}:${minutes}:${String(
        seconds % 60
      ).padStart(2, 0)}`;
    }
  }
};
</script>

<style>
.player {
  display: flex;
}
.player .state {
  height: auto;
  width: 0.5rem;
  background-color: #ff0000;
}
.player .state.published {
  background-color: #00ff00;
}
.audio-player {
  height: 50px;
  width: 350px;
  background: #fff;
  box-shadow: 0 0 20px 0 #000a;
  font-family: arial;
  color: #444;
  font-size: 0.75em;
  overflow: hidden;
  display: grid;
  grid-template-rows: 6px auto;
}
.audio-player .timeline {
  background: white;
  width: 100%;
  position: relative;
  cursor: pointer;
  box-shadow: 0 2px 10px 0 #0008;
}
.audio-player .timeline .progress {
  background: coral;
  width: 0%;
  height: 100%;
  transition: 0.25s;
}
.audio-player .controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.audio-player .controls .bi {
  font-size: 1.5rem;
}
.audio-player .controls .time {
  display: flex;
}
.audio-player .controls .time > * {
  padding: 2px;
}
.audio-player .controls .volume-button {
  height: 26px;
  display: flex;
  align-items: center;
}
.audio-player .controls .volume-button .volume {
  transform: scale(0.7);
}
.audio-player .controls .volume-slider {
  width: 100px;
  height: 15px;
  background: white;
  box-shadow: 0 0 20px #000a;
  transition: 0.25s;
}
.audio-player .controls .volume-slider .volume-percentage {
  background: coral;
  height: 100%;
  width: 75%;
}

</style>
