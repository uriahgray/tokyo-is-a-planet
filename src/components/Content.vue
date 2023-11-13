<template>
  <div>
    <!-- Display Content -->
    <div v-for="(contentItem, index) in content" :key="index" class="content-item my-8 md:my-16 last:my-0 md:last:my-0">
      <!-- Header -->
      <div v-if="contentItem.__typename === 'Header'" 
      :class="['ff-cond text-xl md:text-2xl text-center text-riso-blue whitespace-pre-line', {'text-riso-gold': contentItem.gold}]">
        {{ contentItem.header }}
      </div>
      <!-- Text -->
      <div v-else-if="contentItem.__typename === 'Text'" 
           :class="['text-base md:text-lg', 'w-full', 'md:w-2/3', 'font-bold', {'text-riso-gold': contentItem.gold}, {'text-xs md:text-sm w-full md:w-1/2': contentItem.small}]">
        <div v-html="contentItem.text.html"></div>
      </div>
      <!-- Header -->
      <div v-else-if="contentItem.__typename === 'Dot'"
      :class="['w-32 h-32 md:w-[25vw] md:h-[25vw] rounded-full bg-riso-blue', {'bg-riso-gold': contentItem.gold}]"> 
      </div>              
      <!-- Media -->
      <div v-else-if="contentItem.__typename === 'Media'"
          :class="['flex flex-wrap justify-center', {'smaller': contentItem.small}]">

        <div v-for="(mediaItem, mediaIndex) in contentItem.media" :key="`media-${mediaIndex}`" 
             :class="{'w-full mb-4 last:mb-0': !contentItem.small, 'w-full md:w-1/2 px-0 md:px-4 mb-4 md:mb-0': contentItem.small}">

          <!-- Audio media -->
          <div v-if="mediaItem.mimeType.includes('audio')">
                <audio :src="mediaItem.url" controls
                class="max-w-full max-h-screen"></audio>
          </div>
          
          <!-- Video media -->
          <video v-else-if="mediaItem.mimeType === 'video'" :src="mediaItem.url" controls
                class="max-w-full max-h-screen"></video>
          
          <!-- Image media -->
          <div v-else-if="mediaItem.mimeType.includes('image')" 
              class="">
              <img :class="['mx-auto rounded-2xl', {'max-w-full max-h-screen': !contentItem.small, 'w-full': contentItem.small}]" :src="mediaItem.url" alt="" />
              <div class="w-full mx-auto text-center mt-2 text-xs md:text-sm">
                {{ mediaItem.caption }}
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Content',
  props: {
    content: {
      type: Array,
      required: true
    }
  }
}
</script>