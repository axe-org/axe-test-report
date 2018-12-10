<template>
  <iframe :src="src"/>
</template>

<script>
export default {
  name: 'speed-scope',
  props: {
    fragment: String
  },
  computed: {
    src () {
      return window.urlPrefix + 'speedscope/index.html' + this.fragment
    }
  }
}
</script>