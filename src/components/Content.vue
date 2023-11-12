<template>
  <div>
    <!-- Display Content -->
    <div v-for="(contentItem, index) in content" :key="index" class="content-item">
      <!-- Header -->
      <div v-if="contentItem.__typename === 'Header'" class="header font-bold">
        {{ contentItem.header }}
      </div>
      <!-- Text -->
      <div v-if="contentItem.__typename === 'Text'" 
           :class="['font-bold', 'width-xs', {'font-size-small': contentItem.small}]">
        <div v-html="contentItem.text.html"></div>
      </div>        
      <!-- Media -->
      <div v-else-if="contentItem.__typename === 'Media'" class="media">
        <div v-for="(mediaItem, mediaIndex) in contentItem.media" :key="`media-${mediaIndex}`">
          <audio v-if="mediaItem.mimeType === 'audio'" :src="mediaItem.url" controls></audio>
          <video v-else-if="mediaItem.mimeType === 'video'" :src="mediaItem.url" controls></video>
          <img v-else-if="mediaItem.mimeType.includes('image')" :src="mediaItem.url" alt="" />
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