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
    <div class="audio-player">audio-here</div>
    <div class="menu-wrapper overflow-auto max-h-[60vh]" v-if="isMenuOpen">
      <div class="text-base md:text-lg border-t border-white pt-1">● Broadcasts</div>
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

export default defineComponent({
  name: 'App',
  data() {
    return {
      isMenuOpen: false,
      studio: null
    }
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    }
  },
  watch: {
    // Watch for changes in the route
    $route() {
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

