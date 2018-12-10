<template>
  <div>
    <el-dialog :visible.sync="axeLogDetailVisible">
      <el-form v-if="selectedLog" class="log-detail" label-width="120px" label-position="left">
        <el-form-item label="类型">
          <div>{{ selectedLog.typeText }}</div>
        </el-form-item>
        <el-form-item v-if="selectedLog.routeURL" label="URL" style="margin-top: -15px;">
          <div>{{ selectedLog.routeURL }}</div>
        </el-form-item>
        <el-form-item v-if="selectedLog.dataKey" label="Key" style="margin-top: -15px;">
          <div>{{ selectedLog.dataKey }}</div>
        </el-form-item>
        <el-form-item v-if="selectedLog.eventName" label="Event" style="margin-top: -15px;">
          <div>{{ selectedLog.eventName }}</div>
        </el-form-item>
        <el-form-item label="时间" style="margin-top: -15px;">
          <div>{{ selectedLog.timeText }}</div>
        </el-form-item>
        <el-form-item v-if="selectedLog.dataItem" label="值" style="margin-top: -15px;">
          <data-item :data="selectedLog.dataItem"/>
        </el-form-item>
        <el-form-item v-if="selectedLog.payload" label="payload" style="margin-top: -15px;">
          <el-form class="log-detail" label-width="100px" size="small" label-position="left" style="background:#FFDAB9; padding: 5px;">
            <el-form-item v-for="dataItem in selectedLog.payloadItemList" :key="dataItem[0]" :label="dataItem[0]">
              <data-item :data="dataItem[1]"/>
            </el-form-item>
          </el-form>
        </el-form-item>
        
      </el-form>
    </el-dialog>
    <div class="scroll">
      <div class="lane route">
        <el-popover v-for="item in logList.routeList" :key="item.id" placement="top-start" :title="item.operation === 'route_view'? 'View Router' : 'Jump Router'"
         width="160" trigger="hover" :content="'URL :   ' + item.routeURL">
          <div class="point" slot="reference" @mouseover="mouseover(item)" @mouseout="mouseout(item)" @click="showDetailLog(item)">{{ item.operation === 'route_view' ? 'Rv' : 'Rj' }}</div>
        </el-popover>
      </div>
      <div class="lane event">
        <el-popover v-for="item in logList.eventList" :key="item.id" placement="top-start" title="Event"
         width="160" trigger="hover" :content="'Name :   ' + item.eventName">
          <div class="point" slot="reference" @mouseover="mouseover(item)" @mouseout="mouseout(item)" @click="showDetailLog(item)">E</div>
        </el-popover>
      </div>
      <div class="lane data">
        <el-popover v-for="item in logList.dataList" :key="item.id" placement="top-start" :title="dataTitle(item)"
         width="160" trigger="hover" :content="'Key :   ' + item.dataKey">
          <div class="point" slot="reference" @mouseover="mouseover(item)" @mouseout="mouseout(item)" @click="showDetailLog(item)">{{ dataAbbr(item) }}</div>
        </el-popover>
      </div>
    </div>
  </div>
  
</template>

<script>
import DataItem from './DataItem'

export default {
  name: 'Loglane',
  props: {
    // log 数据分为4类 route, event, data , other . other中包括 asset , 日志， 崩溃等。
    logList: Object
  },
  components: {
    'data-item': DataItem
  },
  data () {
    return {
      laneTypes: ['route', 'event', 'data', 'other'],
      axeLogDetailVisible: false,
      selectedLog: undefined,
    }
  },
  computed: {

  },
  methods: {
    dataTitle (item) {
      let dataTitles = {
        'data_set': 'Data Set',
        'data_get': 'Data Get',
        'data_remove': 'Data Remove'
      }
      return dataTitles[item.operation]
    },
    dataAbbr (item) {
      let dataAbbrs = {
        'data_set': 'Ds',
        'data_get': 'Dg',
        'data_remove': 'Dr'
      }
      return dataAbbrs[item.operation]
    },
    mouseover (item) {
      this.$emit('selecttime', item.time)
    },
    mouseout () {
      this.$emit('selecttime', 0)
    },
    showDetailLog (info) {
      if (info.payload) {
        info.payloadItemList = Object.entries(info.payload)
      }
      this.selectedLog = info
      this.axeLogDetailVisible = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.scroll {
  height: 160px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: hidden;
}
.lane {
  display: flex;
  width: 100%;
  height: 40px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.point {
  flex-shrink: 1;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  color:white;
  text-align: center;
  font-size: 15px;
  line-height: 30px;
  cursor: pointer;
}
.route {
  background-color: #FFEC8B;
}
.route .point {
  background-color: #8470FF;
}
.event {
  background-color: #00E5EE;
}
.event .point {
  background-color: #8470FF;
}
.data {
  background-color: #00CD66;
}
.data .point {
  background-color: #8470FF;
}
.other {
  background-color: #FF8247;
}
.other .point {
  background-color: #8470FF;
}
.log-detail {
  width: 80%;
  margin-left: 10%;
}
</style>
