<template>
<header>
    <div v-if="studio" class="wrapper w-1/4 bg-blue-600 mix-blend-multiply fixed top-16 text-white p-3 -translate-x-1/2 left-1/2">
    <div class="logo flex justify-between">
      <div>{{studio.title}}</div>
      <div class="menu cursor-pointer" @click="toggleMenu">Menu</div>
    </div>
    <div class="audio-player">audio-here</div>
    <div class="menu-wrapper" v-if="isMenuOpen">
      <div class="broadcasts-title">● Broadcasts</div>
      <div v-for="broadcast in studio.broadcasts" :key="broadcast.title" class="broadcast">
        <router-link :to="`/broadcast/${broadcast.slug}`" class="broadcast-slug">
          <img v-if="broadcast.thumbnail" :src="broadcast.thumbnail.url" alt="" />
          <div class="broadcast-length">{{ broadcast.length }}</div>
          <div class="broadcast-title">{{ broadcast.title }}</div>
          <div v-for="(person, index) in broadcast.people" :key="person.id" class="person">
            {{ person.firstName }} {{ person.lastName }}<span v-if="index < broadcast.people.length - 1">,</span>
          </div>
        </router-link>
      </div>
      <router-link :to="`/articles/`" class="articles-slug">
      <div class="broadcasts-title">Articles</div>
      </router-link>
      <div class="imprint-title">Imprint</div>
      {{studio.summary}}
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

