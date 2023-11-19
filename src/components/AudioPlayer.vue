<template>
  <div id="app">
    <div class="player">
      <div class="state" :class="[{ published: isPublished }]"></div>
      <div class="audio-player bg-riso-blue">
        <div :class="hideTimeline ? 'inactive' : 'active'" class="timeline">
          <div class="progress" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="controls">
          <div class="play-container bg-riso-blue">
          <span class="bi text-lg bg-riso-blue" @click="playPause">
            <span v-if="isPaused" class="play">
              <svg width="30" height="36" viewBox="0 0 30 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 18L-1.63133e-06 35.3205L-1.17124e-07 0.67949L30 18Z" fill="#FFFFFF"/>
              </svg>
            </span>
            <span v-else class="pause">
              <svg width="25" height="35" viewBox="0 0 25 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="10" height="35" fill="#FFFFFF"/>
                <rect x="15" width="10" height="35" fill="#FFFFFF"/>
              </svg>
            </span>
          </span>
          </div>
          <div :class="hideTimeline ? 'text-transparent' : 'text-white'" class="time w-[85%] md:w-[90%]">
            <div class="title marquee">
              <span>{{title}} {{title}} {{title}} {{title}} {{title}} {{title}}</span>
            </div>
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
    },
    title: {
      type: String,
      default: null
    },    
    hideTimeline: {
      type: Boolean,
      default: false
    },     
    autoPlay: {
      type: Boolean,
      default: false
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
      length: ""
    };
  },
  watch: {
    file(newFile) {
      this.loadAudio(newFile);
    }
  },  
  mounted() {
    if (this.file) {
      this.loadAudio(this.file);
    }
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
    loadAudio(fileUrl) {
      if (this.audio) {
        this.audio.pause();
      }
      this.audio = new Audio(fileUrl);
      this.audio.addEventListener('loadeddata', () => {
        this.length = this.getTimeCodeFromNum(this.audio.duration);
        this.audio.volume = 1;
        
        if (this.autoPlay) {
          this.playPause();
        }
      });
      // Rest of the code for updating progress...
    },
    playPause() {
      if (this.audio && this.audio.paused) {
        this.isPaused = false;
        this.audio.play();
      } else if (this.audio) {
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

.marquee {
    width: 75%;
    overflow: hidden;
    position: relative;
}

.marquee span {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: 0;
    line-height: 25px; /* Adjust to your preference */
    text-align: center;
    /* Animate */
    -webkit-animation: marquee 20s linear infinite;
    animation: marquee 20s linear infinite;
    will-change: transform;
}

/* Keyframes for the animation */
@-webkit-keyframes marquee {
    0%   { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
}

@keyframes marquee {
    0%   { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
}
.current {
  width: 100px;
    text-align: right;
}

.player {
  display: flex;
}
.player .state {
  height: auto;
  width: 0.5rem;
  background-color: #00ff00;
}
.player .state.published {
  background-color: lime;
}
.audio-player {
  height: 50px;
  width: 100%;
  overflow: hidden;
  display: grid;
  grid-template-rows: 6px auto;
}
.audio-player .timeline {
  width: 100%;
  position: relative;
  cursor: pointer;
}

.audio-player .timeline.inactive {
  background: transparent;
}

.audio-player .timeline.active {
  background: white;
}

.audio-player .timeline.inactive .progress {
  background: transparent;
}

.audio-player .timeline.active .progress {
  background: black;
}

.audio-player .timeline .progress {
  background: black;
  width: 0%;
  height: 100%;
  transition: 0.25s;
}
.audio-player .controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 5px;
}
.audio-player .controls .bi {
  /* font-size: 1.5rem; */
}
.audio-player .controls .time {
  display: flex;
  justify-content: flex-end;
}
.audio-player .controls .time > * {
  padding: 2px;
}
.audio-player .controls .volume-slider .volume-percentage {
  background: coral;
  height: 100%;
  width: 75%;
}

</style>
