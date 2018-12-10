<template>
  <div>
    <img v-if="type === 'Image'" :src="imageSrc" class="image" @click="openImageInNewWindow"/>
    <div v-if="isNormalType" class="normal-text">{{ normalText }}</div>
  </div>
</template>

<script>
// import { AXEDataItemType } from 'axe-data-serialization'
export default {
  props: {
    data: [String, Object]
  },
  data () {
    return {
    }
  },
  name: 'DataItem',
  computed: {
    json () {
      if (Object.prototype.toString.call(this.data) === "[object String]") {
        return JSON.parse(this.data)
      } else {
        return this.data
      }
    },
    type () {
      return this.json.type
    },
    isNormalType () {
      return this.json.type !== 'Image'
    },
    normalText () {
      return `<${this.json.type}>${this.json.value}</${this.json.type}>`
    },
    imageSrc () {
      return window.urlPrefix + this.json.value
    }
  },
  methods: {
    openImageInNewWindow () {
      window.open(this.imageSrc, "_blank")
    } 
  }
}

</script>

<style scoped>
.image {
  max-width: 400px;
  max-height: 300px;
  image-orientation: from-image;
  cursor: pointer;
}
.normal-text {
  width: 100%;
  word-wrap: break-word;
}
</style>
