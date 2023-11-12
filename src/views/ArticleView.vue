<template>
  <div class="article-view">
    <div v-if="article">
      <div class="title font-bold">{{ article.title }}</div>
      <Content :content="article.content" />     
    </div>
    <div v-else>
      <p>Loading article data or not available...</p>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import gql from "graphql-tag";
import Content from "../components/Content.vue";

export default defineComponent({
  name: 'ArticleView',
  components: {
    Content
  },
  data() {
    return {
      article: null
    }
  },
  computed: {
    // Computed property to always get the current slug from the route
    slug() {
      return this.$route.params.slug;
    }
  },
  apollo: {
    article: {
      query: gql`
        query GetArticle($slug: String!) {
          article(where: {slug: $slug}) {
            slug
            title
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
      `,
      variables() {
        return {
          slug: this.slug
        };
      },
      update: data => data.article,
      error(error) {
        console.error('Error fetching article data:', error);
      },
    }
  },
  mounted() {
    window.scrollTo(0, 0);
  }
});
</script>


