<template>
  <div :style="{width: axisWidth + 'px', height: '50px', position: 'relative'}">
    <canvas ref="canvas" :width="axisWidth + 'px'" height="50px">抱歉，您的浏览器不支持canvas元素</canvas>
    <div class="time-point" v-if="timePoint !== -1" :style="timePointStyle">
      <div class="time-label">{{ relativeTime }}</div>
      <div class="time-label">{{ formatTime }}</div>
    </div>
  </div>
  
</template>

<script>
import config from './config.js'
import dateFormat from 'dateformat'

export default {
  name: 'Timeaxis',
  props: {
    feature: Object
  },
  data () {
    return {
      timePoint: -1
    }
  },
  methods: {
    // 显示时间， 为时间戳。
    showTimePoint (time) {
      // window.console.log(time)
      this.timePoint = time
    },
    hideTimePoint () {
      this.timePoint = -1
    }
  },
  mounted () {
    let canvas = this.$refs['canvas']
    let context = canvas.getContext("2d")
    context.save()
    // context.fillStyle = 'rgba(255, 255, 255, 0)';
    context.beginPath()
    context.moveTo(0, 2) //画线的起点
    context.lineWidth = 3
    context.lineTo(this.axisWidth, 2) //终点
    context.closePath()
    context.strokeStyle = "red"
    context.stroke()
    
    context.beginPath()
    context.moveTo(2, 0) //画线的起点
    context.lineWidth = 3
    context.lineTo(2, 40) //终点
    context.closePath()
    // context.strokeStyle = "red"
    context.stroke()
    // 第一条线加粗
    for (let i = 1; i < (this.feature.duration + config.TIME_AXIS_APPEND_TIME) / 1000; i ++) {
      let x = parseInt(config.TIME_AXIS_MILLISECOND_WIDTH * i * 1000)
      if (i % 10 === 0) {
        context.beginPath()
        context.moveTo(x, 0) //画线的起点
        context.lineWidth = 3
        context.lineTo(x, 20) //终点
        context.closePath()
        // context.strokeStyle = "red"
        context.stroke()
        // 写字。
        context.fillStyle = "red";
        context.font = "bold 26px"; //字体样式
        context.textAlign = "statr"; //对齐方式为左对齐
        context.textBaseline = "top"; //基线
        context.fillText(String(i), x, 20, 100);
      } else {
        context.beginPath()
        context.moveTo(x, 0) //画线的起点
        context.lineWidth = 1
        context.lineTo(x, 10) //终点
        context.closePath()
        // context.strokeStyle = "red"
        context.stroke()
      }
    }
    // 写上开始和结束时间。
    context.fillStyle = "red";
    context.font = "bold 26px"; //字体样式
    context.textAlign = "statr"; //对齐方式为左对齐
    context.textBaseline = "top"; //基线
    context.fillText('Relative: 00:00.000', 5, 20, 300);
    context.fillText('Absolute:' + dateFormat(new Date(this.feature.startTime), "HH:MM:ss.l"), 5, 35, 300);
    context.restore()
  },
  computed: {
    relativeTime () {
      let time = this.timePoint - this.feature.startTime
      let minutes = (time / 60000) | 0
      minutes = ('00' + minutes).slice(-2)
      let seconds = (time % 60000 / 1000) | 0
      seconds = ('00' + seconds).slice(-2)
      let milliseconds = time % 1000
      milliseconds = ('000' + milliseconds).slice(-3)
      return `${minutes}:${seconds}.${milliseconds}`
    },
    formatTime () {
      // window.console.log(new Date(this.timePoint))
      return dateFormat(new Date(this.timePoint), "HH:MM:ss.l")
    },
    axisWidth () {
      return parseInt((this.feature.duration + config.TIME_AXIS_APPEND_TIME) * config.TIME_AXIS_MILLISECOND_WIDTH)
    },
    timePointStyle () {
      return {
        left: ((this.timePoint - this.feature.startTime) * config.TIME_AXIS_MILLISECOND_WIDTH) + 'px'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.time-point {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100px;
  height: 50px;
  padding-top: 15px;
  border-left-width: 4px;
  border-left-style: solid;
  border-left-color: black;
}
.time-label {
  padding-top: 5px;
  padding-left: 5px;
  color: blue;
  font-size: 12px;
  background-color: white;
}
</style>
