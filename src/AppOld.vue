<template>
<header>
    <div v-if="studio" class="wrapper w-[85%] md:w-1/3 bg-violet-600 mix-blend-multiply fixed top-16 text-white p-3 -translate-x-1/2 left-1/2">
    <div class="logo flex justify-between">
      <div class="text-base md:text-lg">
        <router-link :to="`/`">
          {{studio.title}}
        </router-link>
      </div>
      <div class="menu cursor-pointer text-base md:text-lg" @click="toggleMenu">Menu</div>
    </div>
    <div class="live-player flex mt-1">
      <div class="live flex-grow-1 bg-white text-violet-600 p-1 px-4">
        ●  Live now 
      </div>
      <div class="audio-player flex-grow">
        <AudioPlayer :file="audioUrl" :autoPlay="isPlaying" :seekbar="showSeekbar" />
      </div>      
    </div>
    <div class="menu-wrapper overflow-auto max-h-[60vh]" v-if="isMenuOpen">
      <div class="text-base md:text-lg pt-2">● Broadcasts</div>
      <div v-for="broadcast in studio.broadcasts" :key="broadcast.title" class="broadcast">
        <router-link :to="`/broadcast/${broadcast.slug}`" class="flex mb-4">
          <div class="w-16">
            <img class="rounded-xl" v-if="broadcast.thumbnail" :src="broadcast.thumbnail.url" alt="" />
          </div>
          <div class="pl-2 flex-grow-1">
            <div class="text-base md:text-lg">{{ broadcast.title }}</div>
            <div class="text-xs md:text-sm inline-block">{{ broadcast.length }} &nbsp;</div>
            <div v-for="(person, index) in broadcast.people" :key="person.id" class="person inline-block">
              {{ person.firstName }} {{ person.lastName }}<span v-if="index < broadcast.people.length - 1">,</span>
            </div>
          </div>
        </router-link>
      </div>
      <router-link :to="`/articles/`" class="articles-slug">
      <div class="text-base md:text-lg border-t border-white pt-1">● Articles</div>
      </router-link>
      <div class="text-base md:text-lg border-t border-white pt-1">About</div>
      <div class="text-xs md:text-sm">{{studio.summary}}</div>
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
      studio: null
    }
  },
  mounted() {
    window.scrollTo(0, 0);

    // Set initial audio URL from singleBroadcast
    if (this.studio && this.studio.singleBroadcast && this.studio.singleBroadcast.url) {
      this.$store.dispatch('loadAudio', {
        url: this.studio.singleBroadcast.url,
        showSeekbar: false // Assuming you want the seekbar hidden initially
      });
    }
  },
  computed: {
    audioUrl() {
      return this.$store.state.audioUrl;
    },
    isPlaying() {
      return this.$store.state.isPlaying;
    },
    showSeekbar() {
      return this.$store.state.showSeekbar;
    }
  },
  watch: {
    // Watch for changes in the studio data
    studio(newValue) {
      if (newValue && newValue.singleBroadcast && newValue.singleBroadcast.url) {
        this.$store.dispatch('loadAudio', {
          url: newValue.singleBroadcast.url,
          showSeekbar: false // Set to false or true based on your requirement
        });
      }
    },
    '$route'() {
      // Close the menu whenever the route changes
      this.isMenuOpen = false;
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
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    }
  }
});
</script>


