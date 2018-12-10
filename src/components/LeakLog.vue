<template>
  <div>
    <el-dialog :visible.sync="axeLogDetailVisible" title="Leak by Instruments">
      <el-form v-if="selectedLog" class="log-detail" label-width="120px" label-position="left">
        <el-form-item label="time">
          <div>{{ selectedLog.time }}</div>
        </el-form-item>
        <el-form-item label="name" style="margin-top: -15px;">
          <div>{{ selectedLog.name }}</div>
        </el-form-item>
        <el-form-item label="address" style="margin-top: -15px;">
          <div>{{ selectedLog.address }}</div>
        </el-form-item>
        <el-form-item label="symbol" style="margin-top: -15px;">
          <div>{{ selectedLog.symbol }}</div>
        </el-form-item>
        <el-form-item label="library" style="margin-top: -15px;">
          <div>{{ selectedLog.library }}</div>
        </el-form-item>
        <el-form-item label="size" style="margin-top: -15px;">
          <div>{{ selectedLog.size + ' KB' }}</div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="lane leak">
      <el-popover v-for="item in leakList" :key="item.id" placement="top-start" title="Leak"
        width="160" trigger="hover" :content="item.name">
        <div class="point" slot="reference" @mouseover="mouseover(item)" @mouseout="mouseout(item)" @click="showDetailLog(item)">L</div>
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeakLog',
  props: {
    leakList: Array
  },
  data () {
    return {
      axeLogDetailVisible: false,
      selectedLog: undefined,
    }
  },
  computed: {

  },
  methods: {
    mouseover (item) {
      window.console.log(JSON.stringify(item))
      this.$emit('selecttime', item.time)
    },
    mouseout () {
      this.$emit('selecttime', 0)
    },
    showDetailLog (info) {
      this.selectedLog = info
      this.axeLogDetailVisible = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.lane {
  display: flex;
  width: 100%;
  height: 60px;
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
.leak {
  background-color: #FF8247;
}
.leak .point {
  background-color: #8470FF;
}
.log-detail {
  width: 80%;
  margin-left: 10%;
}
</style>
