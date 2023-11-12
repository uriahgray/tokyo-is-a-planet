<template>
  <div class="home">
    <div v-if="studio">
      <div class="title font-bold">{{ studio.title }}</div>
      <div class="summary">{{ studio.summary }}</div>
      <!-- Display Broadcasts -->
      <div v-for="broadcast in studio.broadcasts" :key="broadcast.title" class="broadcast">
        <div class="broadcast-title">{{ broadcast.title }}</div>
        <div class="broadcast-length">{{ broadcast.length }}</div>
      </div>
      <!-- Display Content -->
      <Content :content="studio.content" />
    </div>
  </div>
</template>


<script>
import { defineComponent } from 'vue';
import gql from "graphql-tag";
import Content from "../components/Content.vue";

export default defineComponent({
  name: 'ArticlesView',
  components: {
    Content
  },
  data() {
    return {
      studio: null
    }
  },
  mounted() {
    window.scrollTo(0, 0);
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
              broadcasts {
                title
                length
              }
              content {
                ... on Header {
                  header
                }
                ... on Text {
                  text {
                    html
                  }
                  small
                }                
                ... on Media {
                  id
                  name
                  media {
                    mimeType
                    url(transformation: {image: {resize: {width: 1380}}})
                  }
                }
              }
            }
          }
        }     
      `
    },
    update: data => data.siteOption?.studio,
    error(error) {
      console.error('Error fetching studio data:', error);
    },
  }
}
});
</script>

