<template>
  <div class="body">
    <div ref="left-head" class="left-head">
      <div class="left-head-container" :style="{height: (totalHeight + 100) + 'px'}">
        <div class="left-title" style="top: 10px;">时间</div>
        <div class="left-title" style="top: 120px;">描述</div>
        <div class="left-title" style="top: 290px;">截图</div>
        <div class="left-title" style="top: 515px;">Route</div>
        <div class="left-title" style="top: 555px;">Event</div>
        <div class="left-title" style="top: 595px;">Data</div>
        <div class="left-title" v-if="feature.leakData" :style="{top: ( 70 + leakLogTop) + 'px'}">Leaks</div>
        <div class="left-title" v-if="feature.blockData" :style="{top: ( 70 + blockLogTop) + 'px'}">Block</div>
        <div class="left-title" v-if="feature.activityData" :style="{top: (140 + activityChartTop) + 'px'}">CPU</div>
        <div class="left-title" v-if="feature.activityData" :style="{top: (390 + activityChartTop) + 'px'}">内存</div>
        <div class="left-title" v-if="feature.activityData" :style="{top: (640 + activityChartTop) + 'px'}">Disk</div>
        <div class="left-title" v-if="feature.activityData" :style="{top: (660 + activityChartTop) + 'px'}">Read</div>
        <div class="left-title" v-if="feature.activityData" :style="{top: (890 + activityChartTop) + 'px'}">Disk</div>
        <div class="left-title" v-if="feature.activityData" :style="{top: (910 + activityChartTop) + 'px'}">Write</div>
        <div class="left-title" v-if="feature.gpuData" :style="{top: (140 + gpuChartTop) + 'px'}">GPU</div>
        <div class="left-title" v-if="feature.gpuData" :style="{top: (200 + gpuChartTop) + 'px'}">FPS</div>
        <div class="left-title" v-if="feature.networkData" :style="{top: (140 + networkChartTop) + 'px'}">bytesIn</div>
        <div class="left-title" v-if="feature.networkData" :style="{top: (390 + networkChartTop) + 'px'}">bytesOut</div>
      </div>
    </div>
    <div ref="top-head" class="top-head">
      <timeaxis ref="timeaxis" :style="{width: axisWidth + 'px', height: '50px'}" :feature="feature"/>
    </div>
    <div ref="scroll" class="scroll">
      <div class="container" :style="{width: axisWidth + 'px' , height: totalHeight + 'px'}">
        <div :style="{width: axisWidth + 'px',height: totalHeight + 'px', position: 'relative'}">
          <div v-for="scenario in unSkippedScenarioList" :key="scenario.id" :style="getScenarioAreaStyle(scenario)" class="scenario-area">
            <div class="title">{{ scenario.title }}</div>
            <el-form label-width="70px" label-position="right" inline class="detail-table">
              <el-form-item label="开始时间">
                <span>{{ scenario.startTimeText }}</span>
              </el-form-item>
              <el-form-item label="结束时间">
                <span>{{ scenario.endTimeText }}</span>
              </el-form-item>
              <el-form-item label="测试耗时">
                <span>{{ scenario.durationText }}</span>
              </el-form-item>
              <el-form-item label="测试结果">
                <span>{{ scenario.status }}</span>
              </el-form-item>
            </el-form>
            <screen-area :markList="scenario.markList" :duration="scenario.duration" class="screen-area" @selecttime="showTimeInAxis"/>
            <loglane class="log-area" :logList="scenario.logList" @selecttime="showTimeInAxis"/>
          </div>
        </div>
        <leak-log v-if="feature.profile === 'Leaks'" :style="leakLogStyle" :leak-list="feature.leakData" @selecttime="showTimeInAxis"/>
        <block-log v-if="feature.profile === 'Time Profiler'" :style="blockLogStyle" :block-list="feature.blockData" @selecttime="showTimeInAxis"/>
        <div :style="activityChartStyle" v-if="data.activityData">
          <histogram style="width: 100%;height: 250px;" dataKey="cpu" :data="data.activityData"/>
          <histogram style="width: 100%;height: 250px;" dataKey="memory" :data="data.activityData"/>
          <histogram style="width: 100%;height: 250px;" dataKey="read" :data="data.activityData"/>
          <histogram style="width: 100%;height: 250px;" dataKey="write" :data="data.activityData"/>
        </div>
        <div :style="gpuChartStyle" v-if="data.gpuData">
          <gpuchart style="width: 100%;height: 350px;" :data="data.gpuData"/>
        </div>
        <div :style="networkChartStyle" v-if="data.networkData">
          <histogram style="width: 100%;height: 250px;" dataKey="bytesIn" :data="data.networkData"/>
          <histogram style="width: 100%;height: 250px;" dataKey="bytesOut" :data="data.networkData"/>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import config from './config.js'
import ScreenArea from './ScreenArea'
import Loglane from './Loglane'
import Timeaxis from './Timeaxis'
import Histogram from './charts/Histogram'
import GPUChart from './charts/GPUChart'
import LeakLog from './LeakLog'
import BlockLog from './BlockLog'
export default {
  name: 'Feature',
  components: {
    'screen-area': ScreenArea,
    'timeaxis': Timeaxis,
    'loglane': Loglane,
    'histogram': Histogram,
    'gpuchart': GPUChart,
    'leak-log': LeakLog,
    'block-log': BlockLog
  },
  props: {
    data: Object
  },
  data () {
    return {
      
    }
  },
  computed: {
    axisWidth () {
      return parseInt((this.data.duration + config.TIME_AXIS_APPEND_TIME) * config.TIME_AXIS_MILLISECOND_WIDTH)
    },
    totalHeight () {
      // 计算整个视图的高度，通过测试的类型和图片的数量进行判断。
      if (this.feature.profile === 'AXE') {
        return this.networkChartTop + this.networkChartHeight
      } else if (this.feature.profile === 'Time Profiler') {
        return this.blockLogTop + this.blockLogHeight
      } else if (this.feature.profile === 'Leaks') {
        return this.leakLogTop + this.leakLogHeight
      } else {
        return this.activityChartTop
      }
    },
    feature () {
      return {
        ...this.data,
        scenarios: this.unSkippedScenarioList
      }
    },
    leakLogStyle () {
      return {
        position: 'absolute',
        top: this.leakLogTop + 'px', // 计算高度。
        left: '0px',
        width: (this.axisWidth - 100) + 'px',
        height: this.leakLogHeight + 'px'
      }
    },
    leakLogTop () {
      return 700
    },
    leakLogHeight () {
      return this.feature.leakData ? 100 : 0
    },
    blockLogStyle () {
      return {
        position: 'absolute',
        top: this.blockLogTop + 'px', // 计算高度。
        left: '0px',
        width: (this.axisWidth - 100) + 'px',
        height: this.blockLogHeight + 'px'
      }
    },
    blockLogTop () {
      return 700
    },
    blockLogHeight () {
      return this.feature.blockData ? 100 : 0
    },
    activityChartStyle () {
      return {
        // overcase类型，是绝对布局。
        position: 'absolute',
        top: this.activityChartTop + 'px', // 计算高度。
        left: '0px',
        width: (this.axisWidth - 100) + 'px',
        height: this.activityChartHeight + 'px'
      }
    },
    activityChartTop () {
      return 700
    },
    activityChartHeight () {
      return this.feature.activityData ? 1050 : 0
    },
    gpuChartStyle () {
      return {
        // overcase类型，是绝对布局。
        position: 'absolute',
        top: this.gpuChartTop + 'px', // 计算高度。
        left: '0px',
        width: (this.axisWidth - 100) + 'px',
        height: this.gpuChartHeight + 'px'
      }
    },
    gpuChartTop () {
      return this.activityChartTop + this.activityChartHeight
    },
    gpuChartHeight () {
      return this.feature.gpuData ? 350 : 0
    },
    networkChartStyle () {
      return {
        // overcase类型，是绝对布局。
        position: 'absolute',
        top: this.networkChartTop + 'px', // 计算高度。
        left: '0px',
        width: (this.axisWidth - 100) + 'px',
        height: this.networkChartHeight + 'px'
      }
    },
    networkChartTop () {
      return this.gpuChartTop + this.gpuChartHeight
    },
    networkChartHeight () {
      return this.feature.networkData ? 550 : 0
    },
    unSkippedScenarioList () {
      // 过滤跳过的测试。
      return this.data.scenarioList.filter(s => s.status !== 'skipped')
    }
  },
  methods: {
    getScenarioAreaStyle (scenario) {
      return {
        width: this.getScenarioWidth(scenario),
        background: this.getScenarioColor(scenario),
        left:  parseInt((scenario.startTime - this.data.startTime) * config.TIME_AXIS_MILLISECOND_WIDTH) + 'px'
      }
    },
    getScenarioColor (scenario) {
      // TODO warn 颜色， 错误颜色。
      return config.FEATURE_BACKGROUND_COLORS[ scenario.id % config.FEATURE_BACKGROUND_COLOR_COUNT]
    },
    getScenarioWidth (scenario) {
      return parseInt(scenario.duration * config.TIME_AXIS_MILLISECOND_WIDTH) + 'px'
    },
    showTimeInAxis(time) {
      // 在坐标系中显示时间。
      window.console.log(time)
      if (time) {
        this.$refs['timeaxis'].showTimePoint(time)
      } else {
        this.$refs['timeaxis'].hideTimePoint()
      }
    }
  },
  mounted () {
    // 通过$refs获取dom元素
    let topHead = this.$refs['top-head']
    let leftHead = this.$refs['left-head']
    let scroll = this.$refs['scroll']
    scroll.addEventListener('scroll', () => {
      let scrollTop = scroll.scrollTop
      let scrollLeft = scroll.scrollLeft
      // window.console.log(scrollTop, ' xx ' , scrollLeft)
      topHead.scrollLeft = scrollLeft
      leftHead.scrollTop = scrollTop
    }, false)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.body {
  height: 100%;
  width: 100%;
  position: relative;
}
.left-head {
  width: 60px;
  height: 100%;
  overflow: hidden;
}
.left-head-container {
  width: 100%;
  position: relative;
}
.top-head {
  overflow: hidden;
  position: absolute;
  left: 60px;
  top: 0;
  height: 50px;
  right: 0;
}
.scroll {
  position: absolute;
  bottom: 0;
  top: 50px;
  left: 60px;
  right: 0;
  box-sizing: border-box;
  overflow: auto; 
}
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: stretch;
}
.container {
  position: relative;
  display: flex;
  flex-direction: column;
}
.scenario-background {
  height: 100%;
  position: absolute;
}
.title {
  height: 60px;
  text-align: center;
  font-size: 22pt;
  font-weight: bolder;
  color: #333333;
}
.left-title {
  text-align: center;
  width: 100%;
  color: #333333;
  font-size: 12pt;
  position: absolute;
  left: 0;
}
.scenario-area {
  height: 100%;
  position: absolute;
  margin: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.screen-area {
  height: 240px;
  align-self: stretch;
  margin: 3px;
  margin-top: 35px;
}
.log-area {
  margin-top: 35px;
  align-self: stretch;
  height: 240px;
}
.detail-table {
  font-size: 0;
  max-width: 500px;
  /* min-width: 350px; */
  height: 80px;
}
.detail-table label {
  width: 90px;
  color: #99a9bf;
}
.detail-table .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 40%;
}
.speedscope {
  width: 95vw;
  height: 85vh;
}

</style>
