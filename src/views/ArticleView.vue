<template>
  <div class="p-4 article-view text-riso-blue mb-8 md:mb-16 ">
    <div v-if="article.summary" class="text-xs md:text-sm mb-8 mt-64 md:mt-0">
      {{article.summary}}
    </div>
    <div v-if="article">
      <!-- <div class="title font-bold">{{ article.title }}</div> -->
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
            summary
            content {
              ... on Header {
                header
                gold
              }
                ... on Dot {
                  id
                  gold
                }              
              ... on Text {
                text {
                  html
                }
                small
                gold
              }                
              ... on Media {
                id
                name
                media {
                  mimeType
                  url
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


