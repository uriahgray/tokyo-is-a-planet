<template>
  <div class="home p-4 text-riso-blue">
    <div v-if="studio">
      <div class="text-xs md:text-sm w-full md:w-1/2 mb-8 md:mb-16">{{ studio.summary }}</div>
      <!-- Display Content -->
      <Content :content="studio.content" />   
      <!-- Display Broadcasts -->
      <div v-if="studio.broadcasts" class="flex flex-wrap">
        <div class="my-8 md:my-16 ff-cond text-xl md:text-2xl text-center whitespace-pre-line w-full">
          Broadcasts
        </div>   
        <div v-for="broadcast in studio.broadcasts" :key="broadcast.title"
             class="text-center w-full md:w-1/2 px-0 md:px-4 mb-4">
          <router-link :to="`/broadcast/${broadcast.slug}`">
          <img class="w-full rounded-2xl mb-2" v-if="broadcast.thumbnail" :src="broadcast.thumbnail.url" alt="" />
          <div class="text-base md:text-lg">{{ broadcast.title }} {{ broadcast.length }}</div>
          <div v-for="(person, index) in broadcast.people" :key="person.id" class="text-xs md:text-sm">
            {{ person.firstName }} {{ person.lastName }}<span v-if="index < broadcast.people.length - 1">,</span>
          </div>          
          </router-link>
        </div>
      </div>
      <!-- Display Articles -->
      <div v-if="studio.articles">
        <div class="my-8 md:my-16 ff-cond text-xl md:text-2xl text-center whitespace-pre-line w-full">
        Articles
        </div>  
        <div v-for="article in studio.articles" :key="article.title" class="article text-base md:text-lg">
          <router-link :to="`/article/${article.slug}`" class="article-slug">
            <div>
              <span>{{ article.title }},&nbsp;</span>
              <span v-for="(person, index) in article.people" :key="person.id">
                <template v-if="index !== 0">, </template>{{ person.firstName }} {{ person.lastName }}
              </span>               
            </div>            
          </router-link>
        </div>  
      </div>
      <!-- Credits -->
      <div v-if="studio.credits" class="my-8 md:my-16 text-xs md:text-sm">
        <div v-html="studio.credits.html"></div>
      </div>   
    </div>
  </div>
</template>


<script>
import { defineComponent } from 'vue';
import gql from "graphql-tag";
import Content from "../components/Content.vue";

export default defineComponent({
  name: 'Home',
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

