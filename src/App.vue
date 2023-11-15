<template>
<header>
    <div v-if="studio" class="wrapper w-[85%] md:w-1/3 bg-amber-700 mix-blend-multiply fixed top-16 text-white p-3 -translate-x-1/2 left-1/2 z-50 rounded-xl">
    <div class="logo flex justify-between items-center">
      <div class="text-base md:text-lg">
        <router-link :to="`/`">
          {{studio.title}}
        </router-link>
      </div>
      <div class="menu cursor-pointer text-base md:text-lg translate-x-1" @click="toggleMenu">
        <div v-if="!isMenuOpen" >
      <svg width="45" height="45" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_136_90)">
          <path d="M4.375 26.25H30.625V23.3333H4.375V26.25ZM4.375 18.9583H30.625V16.0417H4.375V18.9583ZM4.375 8.75V11.6667H30.625V8.75H4.375Z" fill="white"/>
        </g>
        <defs>
        <clipPath id="clip0_136_90">
        <rect width="35" height="35" fill="white"/>
        </clipPath>
        </defs>
        </svg>
        </div>
        <div v-else class="translate-x-1.5">
          <svg width="45" height="45" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_136_93)">
          <path d="M27.7083 9.34794L25.652 7.29169L17.5 15.4438L9.34788 7.29169L7.29163 9.34794L15.4437 17.5L7.29163 25.6521L9.34788 27.7084L17.5 19.5563L25.652 27.7084L27.7083 25.6521L19.5562 17.5L27.7083 9.34794Z" fill="white"/>
          </g>
          <defs>
          <clipPath id="clip0_136_93">
          <rect width="35" height="35" fill="white"/>
          </clipPath>
          </defs>
          </svg>          
        </div>
      </div>
    </div>
    <div class="live-player  md:flex mt-1">
      <div class="live flex-grow-2 w-28 pr-2 text-lime-300">
          <button @click="playAudio(studio.singleBroadcast.url, true)">
            ●  Live now
          </button>        
      </div>
      <div class="audio-player flex-grow-1">
        <AudioPlayer :file="audioUrl" :title="audioTitle" :autoPlay="autoPlayState" :hideTimeline="hideTimelineState" />
      </div>  
    </div>
    <div class="menu-wrapper overflow-auto max-h-[70vh]" v-if="isMenuOpen">
      <div class="text-base md:text-lg pt-2">● Broadcasts</div>
      <div v-for="broadcast in studio.broadcasts" :key="broadcast.title" class="broadcast">
        <router-link :to="`/broadcast/${broadcast.slug}`" class="flex mb-4">


          <div class="w-16 mr-4">
            <img class="rounded-xl grayscale contrast-150" v-if="broadcast.thumbnail" :src="broadcast.thumbnail.url" alt="" />
          </div>

          <div class="pl-2 flex-grow-1 ">
            <div class="text-base md:text-lg ">{{ broadcast.title }}</div>
            <div class="text-xs md:text-sm inline-block">{{ broadcast.length }} &nbsp;</div>
            <div v-for="(person, index) in broadcast.people" :key="person.id" class="person inline-block">
              {{ person.firstName }} {{ person.lastName }}<span v-if="index < broadcast.people.length - 1">,</span>
            </div>
          </div>

        </router-link>
      </div>
      <router-link :to="`/articles/`" class="articles-slug">
      <div class="text-base md:text-lg">Articles</div>
      </router-link>
      <div class="text-base md:text-lg">About</div>
      <div class="text-xs md:text-sm">{{studio.summary}}</div>
    </div>
    </div>

  <div v-if="studio" :class="hideThumbnails">
    <div v-for="(article, index) in articlesWithPosition" :key="article.slug" class="article-thumbnail fixed" :class="{'show': article.show}" :style="article.position">
      
        <div class="w-[100px] md:w-[200px]">
          <div class="close cursor-pointer mb-2" @click="removeArticle(index)">
            <svg width="27" height="27" viewBox="0 0 27 27" class="fill-purple-700" xmlns="http://www.w3.org/2000/svg">
              <circle cx="13.5" cy="13.5" r="13.5"/>
              <path d="M19 9.10786L17.8921 8L13.5 12.3921L9.10786 8L8 9.10786L12.3921 13.5L8 17.8921L9.10786 19L13.5 14.6079L17.8921 19L19 17.8921L14.6079 13.5L19 9.10786Z" fill="#fff"/>
            </svg>
          </div>
          <router-link :to="`/article/${article.slug}`">
            <img class="" v-if="article.thumbnail" :src="article.thumbnail.url" alt="" />
          </router-link>
        </div>
    </div>  
  </div>

    
</header>
<router-view></router-view>
</template>


<script>
import { defineComponent } from 'vue';
import gql from "graphql-tag";
import AudioPlayer from "./components/AudioPlayer.vue";

export default defineComponent({
  name: 'App',
  components: {
    AudioPlayer
  },
  data() {
    return {
      isMenuOpen: false,
      studio: null,
      articlesWithPosition: [] // New property to hold articles with positions      

    }
  },
  watch:{
    '$route'() {
      // Close the menu whenever the route changes
      this.isMenuOpen = false;
    },
  'studio.singleBroadcast': function(newBroadcast) {
    if (newBroadcast && newBroadcast.url) {
      this.$store.dispatch('loadAudio', { url: newBroadcast.url, autoplay: false });
    }
  },    
  'studio.articles': {
    handler(newArticles) {
      if (newArticles) {
        let zIndex = 150; // Starting z-index
        // Assign random positions and a z-index to each article and shuffle
        this.articlesWithPosition = this.shuffleArray(newArticles.map(article => ({
          ...article,
          position: this.getRandomPosition() + `; z-index: ${zIndex++};`,
          show: false // Initialize with show set to false
        })));

        this.articlesWithPosition.forEach((article, index) => {
          setTimeout(() => {
            // Directly set the show property
            article.show = true;
          }, 3000 * (index + 1));
        });
      }
    },
    immediate: true,
    deep: true
  }
},
  mounted() {
    if (this.studio && this.studio.singleBroadcast) {
      const url = this.studio.singleBroadcast.url;
      this.$store.dispatch('loadAudio', { url, autoplay: false });
    }
  },
  computed: {
    hideThumbnails() {
      return this.$route.path === '/articles/' ? 'hidden' : '';
    },   
    audioUrl() {
      return this.$store.state.audioUrl;
    },
    hideTimelineState() {
      return this.$store.state.hideTimeline;
    },
    autoPlayState() {
      return this.$store.state.autoplay;
    },
    audioTitle() {
      return this.$store.state.audioTitle;
    }       
  },    
  apollo: {
    studio: {
      query() {
        return gql`
          query GetSiteOption {
            siteOption(where: {id: "clotg8w8sse6x0b2ooiw1g2sh"}) {
              studio {
                id
                summary
                title
                singleBroadcast {
                  url
                }
                articles {
                  slug
                  thumbnail {
                    url(transformation: {image: {resize: {width: 150}}})
                  }
                }              
                broadcasts {
                  title
                  length
                  slug
                  people {
                    firstName
                    lastName
                  }
                  thumbnail {
                    url(transformation: {image: {resize: {width: 200}}})
                  }                
                }             
              }
            }
          }
        `;
      },
      update: data => data.siteOption?.studio,
      error(error) {
        console.error('Error fetching studio data:', error);
      },
    }
  },
  methods: {
    async playAudio(audioUrl, hideTimeline) {
      // Dispatch the clearAudio action
      await this.$store.dispatch('clearAudio');
      this.isClicked = true;

      // Dispatch the playAudio action with both URL and hideTimeline
      setTimeout(() => {
        this.$store.dispatch('playAudio', { url: audioUrl, hideTimeline });
      }, 100);
    },   
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
      }
      return array;
    },    
    removeArticle(index) {
      // Check if the article exists at the given index
      if (this.articlesWithPosition[index]) {
        // Set 'show' to false to hide the article
        this.articlesWithPosition[index].show = false;
      }
    },    
    getRandomPosition() {
      // Generate random positions
      const top = Math.random() * (window.innerHeight - 100); // 100 is the height of the thumbnail
      const left = Math.random() * (window.innerWidth - 100); // 100 is the width of the thumbnail
      return `top: ${top}px; left: ${left}px;`;
    }
  }
});
</script>

<style>

.article-thumbnail {
  display: none;
}

.article-thumbnail.show {
  display: block;
}

</style>


