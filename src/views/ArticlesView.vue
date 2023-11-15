<template>
  <div class="home p-4 text-riso-blue">
    <div class="text-xs md:text-sm w-full md:w-1/2 mb-8 mt-64 md:mt-0 md:mb-16">{{ studio.summary }}</div>
    <div v-if="studio">
      <!-- Display Articles -->
      <div v-if="studio.articles" class="grid gap-x-8 gap-y-4 grid-cols-2 md:grid-cols-5">
        <div v-for="article in studio.articles" :key="article.title" class="article text-base md:text-lg">
          <router-link :to="`/article/${article.slug}`" class="article-slug">
            <div>
              <img class="" v-if="article.thumbnail" :src="article.thumbnail.url" alt="" />
              <span>{{ article.title }}</span> <br>
              <span v-for="(person, index) in article.people" :key="person.id">
                <template v-if="index !== 0">, </template>{{ person.firstName }} {{ person.lastName }}
              </span>               
            </div>            
          </router-link>
        </div>  
      </div> 
    </div>
  </div>
</template>


<script>
import { defineComponent } from 'vue';
import gql from "graphql-tag";
import Content from "../components/Content.vue";

export default defineComponent({
  name: 'Articles',
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
              credits {
                html
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
                  url(transformation: {image: {resize: {width: 1000}}})
                }                 
              }
              articles {
                title
                summary
                slug
                thumbnail {
                  url(transformation: {image: {resize: {width: 600}}})
                }                
                people {
                  firstName
                  lastName
                }                
              }              
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
                    url(transformation: {image: {resize: {width: 1380}}})
                    caption
                  }
                  small
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

