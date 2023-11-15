<template>
  <div class="broadcast-view p-4 text-riso-blue">
    <div v-if="broadcast">

      <img class="w-full rounded-2xl mb-2" v-if="broadcast.thumbnail" :src="broadcast.thumbnail.url" alt="" />

      <!-- <div v-if="broadcast.audio">
        <AudioPlayer :file="broadcast.audio.url" :title="broadcast.title" />
      </div> -->

      <button @click="playAudio(broadcast.audio.url)">Play</button>

      <div class="text-base md:text-lg">{{ broadcast.title }} {{ broadcast.length }}</div>
      <div v-for="(person, index) in broadcast.people" :key="person.id" class="text-xs md:text-sm">
        {{ person.firstName }} {{ person.lastName }}<span v-if="index < broadcast.people.length - 1">,</span>
      </div>


      <Content :content="broadcast.content" />

    </div>
    <div v-else>
      <p>Loading broadcast data or not available...</p>
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
      slug: this.$route.params.slug
    }
  },
  methods: {
  async playAudio(audioUrl) {
    // Clear the current audio URL first
    await this.$store.dispatch('clearAudio');

    // Introduce a slight delay to ensure the audio is cleared before playing the new one
    setTimeout(() => {
      this.$store.dispatch('playAudio', { url: audioUrl, showSeekbar: true });
    }, 100); // Slight delay, e.g., 100 milliseconds
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
            thumbnail {
              url(transformation: {image: {resize: {width: 1400}}})
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

