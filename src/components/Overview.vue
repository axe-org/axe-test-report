<template>
  <div class="container">
    <el-form class="left scroll" label-width="120px" style="width:100%; align-self:flex-start;">
      <el-form-item label="测试类型">
        <div>{{ overview.type }}</div>
      </el-form-item>
      <el-form-item label="测试时间" style="margin-top: -17px;">
        <div>{{ overview.time }}</div>
      </el-form-item>
      <el-form-item label="耗时" style="margin-top: -17px;">
        <div>{{ overview.duration }}</div>
      </el-form-item>
      <el-form-item label="设备数量" style="margin-top: -17px;">
        <div>{{ overview.deviceNumber }}</div>
      </el-form-item>
      <el-form-item label="测试次数" style="margin-top: -17px;">
        <div>{{ overview.suiteNumber }}</div>
      </el-form-item>
      <el-form-item label="通过测试数量" style="margin-top: -17px;">
        <div>{{ overview.passedSuite }}</div>
      </el-form-item>
      <el-form-item label="测试用例总数" style="margin-top: -17px;">
        <div>{{ overview.caseNumber }}</div>
      </el-form-item>
      <el-form-item label="通过测试用例" style="margin-top: -17px;">
        <div>{{ overview.passedCase }}</div>
      </el-form-item>
      <el-form-item label="测试情况" style="margin-top: -17px;">
        <el-progress type="circle" :percentage="testProgress" :status="testProgress == 100 ? 'success' :'exception'"></el-progress>
      </el-form-item>
    </el-form>
    <el-table :data="suites" class="right scroll">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="设备udid">
              <span style="font-size: 11px;">{{ props.row.udid }}</span>
            </el-form-item>
            <el-form-item label="用例情况">
              <span>{{ props.row.progressText }}</span>
            </el-form-item>
            <el-form-item label="开始时间">
              <span>{{ props.row.startTimeText }}</span>
            </el-form-item>
            <el-form-item label="结束时间">
              <span>{{ props.row.endTimeText }}</span>
            </el-form-item>
            <el-form-item v-if="props.row.profile" label="性能测试">
              <span>{{ props.row.profile }}</span>
            </el-form-item>
            <el-form-item v-if="props.row.profile" label="性能日志">
              <span><a :href="urlPrefix + props.row.profileDownloadPath" :download="props.row.startTime" target="_blank">Download</a></span>
            </el-form-item>
            <el-form-item v-if="props.row.timeSpeedScopeFile" label="SpeedScope">
              <el-button v-if="props.row.timeSpeedScopeFile" @click="openTimeSpeedScope(props.row, false)" type="primary" size="mini" plain>time</el-button>
            </el-form-item>
            <el-form-item v-if="props.row.filteredTimeSpeedScopedFile" label="SpeedScope(Hide System Library)">
              <el-button v-if="props.row.filteredTimeSpeedScopedFile" @click="openTimeSpeedScope(props.row, true)" type="primary" size="mini" plain>filtered-time</el-button>
            </el-form-item>
            <el-form-item v-if="props.row.allocationsSpeedScopeFile" label="SpeedScope">
              <el-button v-if="props.row.allocationsSpeedScopeFile" @click="openMemorySpeedScope(props.row, false)" type="primary" size="mini" plain>calltree</el-button>
            </el-form-item>
            <el-form-item v-if="props.row.filteredAllocationsSpeedScopedFile" label="SpeedScope(Hide System Library)">
              <el-button v-if="props.row.filteredAllocationsSpeedScopedFile" @click="openMemorySpeedScope(props.row, true)" type="primary" size="mini" plain>filtered</el-button>
            </el-form-item>
            <el-form-item v-if="props.row.status === 'crashed'" label="崩溃日志">
              <span><a :href="urlPrefix + props.row.crashLogPath" :download="props.row.startTime" target="_blank">Download</a></span>
            </el-form-item>
          </el-form>
          <el-table :data="props.row.featureList" @row-click="openFeature" border :row-class-name="tableRowClassName">
            <el-table-column style="cursor: pointer;"  label="测试场景" prop="title"/>
            <el-table-column label="状态" prop="status"/>
            <el-table-column label="用例情况" prop="progressText"/>
            <el-table-column label="开始时间" prop="startTimeText"/>
            <el-table-column label="耗时" prop="durationText"/>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" prop="deviceName"/>
      <el-table-column label="设备型号" prop="model"/>
      <el-table-column label="系统版本" prop="platformVersion"/>
      <el-table-column label="测试状态" prop="status"/>
      <el-table-column label="测试耗时" prop="durationText"/>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Overview',
  props: {
    overview: Object,
    suites: Array
  },
  data () {
    return {
      urlPrefix: window.urlPrefix
    }
  },
  computed: {
    testProgress () {
      return this.overview.passedCase / 1.0 / this.overview.caseNumber * 100
    }
  },
  methods: {
    tableRowClassName({row}) {
      if (row.status === 'passed') {
        return 'success-row';
      } else if (row.status === 'skipped') {
        return 'warning-row';
      }
      return 'error-row';
    },
    openFeature (row) {
      // 如果是 skipped ,则不进行跳转。
      if (row.status !== 'skipped') {
        this.$emit('open', {
          type: 'feature',
          data: row
        })
      }
    },
    openTimeSpeedScope (row, filter) {
      // 打开 时间
      let option = {
        type: 'speedscope',
        title: `${row.id}.${filter ? 'Time Profiler(HS)' : 'Time Profiler'}`,
        fragement: ''
      }
      let title = escape(option.title)
      const protocol = window.location.protocol
      const canUseXHR = protocol === 'http:' || protocol === 'https:'
      if (canUseXHR) {
        let path = filter ? row.filteredTimeSpeedScopedFile : row.timeSpeedScopeFile
        let relativedLocation = window.urlPrefix === '' ? window.location.href : window.urlPrefix
        let profileURL = new URL(path, relativedLocation).href
        profileURL = escape(profileURL)
        option.fragment = `#profileURL=${profileURL}&title=${title}`
      } else {
        let path = filter ? row.filteredTimeSpeedScopedJSFile : row.timeSpeedScopeJSFile
        let profileURL = new URL(path, window.location.href).href
        profileURL = escape(profileURL.substring(7)) // 过滤掉 file://
        option.fragment = `#localProfilePath=${profileURL}&title=${title}`
      }
      this.$emit('open', option)
      window.console.log(JSON.stringify(option))
    },
    openMemorySpeedScope (row, filter) {
      // 打开 时间
      let option = {
        type: 'speedscope',
        title: `${row.id}.${filter ? 'Allocations CallTree(HS)' : 'Allocations CallTree'}`,
        fragement: ''
      }
      let title = escape(option.title)
      const protocol = window.location.protocol
      const canUseXHR = protocol === 'http:' || protocol === 'https:'
      if (canUseXHR) {
        let path = filter ? row.filteredAllocationsSpeedScopedFile : row.allocationsSpeedScopeFile
        let relativedLocation = window.urlPrefix === '' ? window.location.href : window.urlPrefix
        window.console.log(path)
        let profileURL = new URL(path, relativedLocation).href
        profileURL = escape(profileURL)
        option.fragment = `#profileURL=${profileURL}&title=${title}`
      } else {
        let path = filter ? row.filteredAllocationsSpeedScopedJSFile : row.allocationsSpeedScopeJSFile
        let profileURL = new URL(path, window.location.href).href
        profileURL = escape(profileURL.substring(7)) // 过滤掉 file://
        option.fragment = `#localProfilePath=${profileURL}&title=${title}`
      }
      this.$emit('open', option)
      window.console.log(JSON.stringify(option))
    }
  }
}
</script>
<style>
.el-table .warning-row {
  background: #FFF68F;
}
.el-table .error-row {
  background: #EE7600;
  cursor: pointer;
}
.el-table .success-row {
  background: #00FA9A;
  cursor: pointer;
}
.hmid {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  /* justify-content: center; */
}
.space-between {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
}
.container {
  width: 100%;
  height: 100%;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.scroll {
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.left {
  min-width: 300px;
  max-width: 450px;
  height: 100%;
  margin-left: 10vh;
}
.right {
  min-width: 450px;
  max-width: 750px;
  height: 100%;
  margin-right: 10vh;
}
.hmid {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}
.container {
  width: 100%;
  min-width: 600px;
  height: 100%;
  min-height: 500px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
