<template>
  <div class="broadcast-view p-4 text-riso-blue mb-8 md:mb-16">
    <div v-if="broadcast">

      

      <div class="hidden md:block relative">
         <img class="w-full rounded-2xl mb-2" v-if="broadcast.heroImage" :src="broadcast.heroImage.url" alt="" />
        <div class="absolute inset-0 mx-auto my-auto z-10  w-[100px] h-[100px] rounded-xl">
          <button @click="playAudio(broadcast.audio.url, broadcast.title, false)">
            <div class="bg-white w-[100px] h-[100px] rounded-lg">
              <svg :class="{ 'fill-riso-blue translate-x-[26px] translate-y-[15px]': true, blink: !isClicked }">
              <path d="M55 32.5L0.249997 64.1099L0.25 0.890069L55 32.5Z"/>
              </svg>
            </div>
          </button>
        </div>
      </div>

      <div class="block md:hidden">
        <img class="w-full rounded-2xl mb-8 mt-64" v-if="broadcast.thumbnail" :src="broadcast.thumbnail.url" alt="" />
        <AudioPlayer :file="broadcast.audio.url" :title="broadcast.title" :autoPlay="false" />
      </div>

      <div class="text-ml md:text-lg mt-2">{{ broadcast.title }} <span class="hidden md:inline">{{ broadcast.length }}</span></div>
      <div v-for="(person, index) in broadcast.people" :key="person.id" class="text-xs md:text-sm">
        {{ person.firstName }} {{ person.lastName }}<span v-if="index < broadcast.people.length - 1">,</span>
      </div>
      


      <Content :content="broadcast.content" />

    </div>
    <div v-else>
      
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import gql from "graphql-tag";
import Content from "../components/Content.vue";
import AudioPlayer from "../components/AudioPlayer.vue";

export default defineComponent({
  name: 'BroadcastView',
  components: {
    Content,
    AudioPlayer
  },
  data() {
    return {
      broadcast: null,
      slug: this.$route.params.slug,
      isClicked: false,
    }
  },
  methods: {
  async playAudio(audioUrl, title, hideTimeline) {
    await this.$store.dispatch('clearAudio');
    this.isClicked = true;
    
    setTimeout(() => {
      this.$store.dispatch('playAudio', { url: audioUrl, title, hideTimeline, autoplay: true });
    }, 100);
  }
  },   
  apollo: {
    broadcast: {
      query: gql`
        query GetBroadcast($slug: String!) {
          broadcast(where: {slug: $slug}) {
            slug
            title
            length
            heroImage {
              url(transformation: {image: {resize: {width: 1380}}})
            }            
            thumbnail {
              url(transformation: {image: {resize: {width: 700}}})
            }            
            people {
              firstName
              lastName
            }
            audio {
              url
            }            
            content {
              ... on Text {
                text {
                  html
                }
                small
              }
            }
          }
        }
      `,
      variables() {
        return {
          slug: this.slug
        };
      },
      update: data => data.broadcast,
      error(error) {
        console.error('Error fetching broadcast data:', error);
      },
    }
  },
  watch: {
    '$route.params.slug': {
      immediate: true,
      handler(newSlug) {
        this.slug = newSlug;
        if (this.$apollo && this.$apollo.queries.broadcast) {
          this.$apollo.queries.broadcast.refetch();
        }
      }
    }
  },
  mounted() {
    window.scrollTo(0, 0);
  }
});
</script>

<style>

.blink {
  animation: blink-animation 2s steps(5, start) infinite;
  -webkit-animation: blink-animation 2s steps(5, start) infinite;
}
@keyframes blink-animation {
  to {
    visibility: hidden;
  }
}
@-webkit-keyframes blink-animation {
  to {
    visibility: hidden;
  }
}

</style>

