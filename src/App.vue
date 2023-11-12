<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  
}

.logo {
  
}

nav {
  
}

nav a.router-link-exact-active {
  
}

nav a.router-link-exact-active:hover {
  
}

nav a {
  
}

nav a:first-of-type {
  
}


</style>
