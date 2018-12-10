<template>
  <div class="sascroll">
    <el-dialog :visible.sync="largeImageVisible" custom-class="dialog-preview" top="0px">
      <el-carousel ref="carousel" trigger="click" class="image-preview" :autoplay="false" :height="carouselHeight">
        <el-carousel-item v-for="mark in markList" :key="mark.id" :label="mark.title" :name="String(mark.id)">
          <img class="large-img" :src="urlPrefix + mark.src" @click="openImageInNewWindow(mark)"/>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
    <div class="list" :style="{width: totalWidth}">
      <div class="screen" v-for="mark in markList" :key="mark.id" @mouseover="mouseover(mark)" @mouseout="mouseout(mark)" @click="showScreenshoot(mark)">
        <img class="screen-img" :src="urlPrefix + mark.src"/>
        <div class="screen-title">{{ mark.title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import config from './config.js'
// 一个 测试用例的截图区域。
// 截图宽度 120 + 10， 高度 180 + 20 ， 20 放标题。
export default {
  name: 'ScreenArea',
  props: {
    markList: Array,
    duration: Number // 毫秒
  },
  data () {
    return {
      largeImageVisible: false,
      carouselHeight: '0px',
      urlPrefix: window.urlPrefix
    }
  },
  computed: {
    totalWidth () {
      let calcWidth = this.markList.length * 130
      let windowWidth = parseInt(this.duration * config.TIME_AXIS_MILLISECOND_WIDTH)
      return (windowWidth < calcWidth ? calcWidth : windowWidth) + 'px'
    }
  },
  methods: {
    mouseover (mark) {
      this.$emit('selecttime', mark.time)
    },
    mouseout () {
      this.$emit('selecttime', 0)
    },
    showScreenshoot (mark) {
      this.carouselHeight = (document.documentElement.clientHeight - 110) + 'px'
      this.largeImageVisible = true
      setTimeout(() => {
        this.$refs['carousel'].setActiveItem(String(mark.id))
      },300)
    },
    openImageInNewWindow (mark) {
      window.open(window.urlPrefix + mark.src, "_blank");
    } 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sascroll {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow: auto;
}
.list {
  display: flex;
  flex-direction: row;
  height: 210px;
  align-items: stretch;
  justify-content: space-around;
}
.screen {
  width: 120px;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  cursor: pointer;
}
.screen:hover { 
  background-color:yellow;
}
.screen-img {
  width: 120px;
  height: 180px;
}
.screen-title {
  text-align: center;
  height: 12px;
  width: 100%;
  color: red;
  font-size: 11pt;
  display:inline-block;
  white-space: nowrap;
}
.image-preview {
  width: 100%;
  height: 100%;
}
.large-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  cursor: pointer;
}
</style>
<style>
.dialog-preview {
  width:  calc(60vw + 60px) !important;
  height: 100% !important;
  margin-bottom: 0px !important;
}
</style>

