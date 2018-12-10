<template>
  <el-tabs style="margin-top: 15px;" type="card" @tab-remove="removeTab" v-model="selectedTab">
    <el-tab-pane v-if="data" label="测试概述" name="main">
      <overview :overview="data.overview" :suites="data.suites" ref="overview" class="mainview" @open="handleOpen"/>
    </el-tab-pane>
    <el-tab-pane closable v-for="item in tabList" :key="item.title" :label="item.title" :name="item.title">
      <feature v-if="item.type === 'feature'" class="mainview" :data="item.data" @open="handleOpen"/>
      <speed-scope v-if="item.type === 'speedscope'" class="mainview" :fragment="item.fragment"/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Overview from './components/Overview'
import Feature from './components/Feature'
import SpeedScope from './components/charts/SpeedScope'
export default {
  components: {
    'overview': Overview,
    'feature': Feature,
    'speed-scope': SpeedScope
  },
  data () {
    return {
      selectedTab: 'main',
      data: window.reporterData,
      tabList: [] // {title: 标题 唯一: ,type ：类型 , data: {数据}}
    }
  },
  name: 'App',
  methods: {
    handleOpen (option) {
      if (option.type === 'feature') {
        option.title = option.data.id + '. ' + option.data.title
      } else if (option.type === 'speedscope') {
        //
      } else {
        window.console.error('错误类型: ' + JSON.stringify(option))
      }
      // 先检查本地是否有相应的页面.
      for (let tab of this.tabList) {
        if (tab.title === option.title) {
          this.selectedTab = option.title
          return
        }
      }
      this.tabList.push(option)
      this.selectedTab = option.title
    },
    removeTab (name) {
      this.selectedTab = 'main'
      this.tabList = this.tabList.filter(tab => tab.title !== name)
    }
  }
}

</script>

<style scoped>
.mainview {
  height: calc(100vh - 90px);
  width: 100%;
  box-sizing: border-box;
  overflow: auto;
}
</style>
