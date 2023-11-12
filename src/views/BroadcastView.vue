<template>
  <div class="broadcast-view">
    <div v-if="broadcast">
      <div class="title font-bold">{{ broadcast.title }}</div>
      <div class="content">
        <div v-for="(contentItem, index) in broadcast.content" :key="index">
          <div v-html="contentItem.text.html"></div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Loading broadcast data or not available...</p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import gql from "graphql-tag";

export default defineComponent({
  name: 'BroadcastView',
  data() {
    return {
      broadcast: null,
      slug: this.$route.params.slug
    }
  },
  apollo: {
    broadcast: {
      query: gql`
        query GetBroadcast($slug: String!) {
          broadcast(where: {slug: $slug}) {
            slug
            title
            content {
              ... on Text {
                text {
                  html
                }
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

