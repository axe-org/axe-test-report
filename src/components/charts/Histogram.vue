<template>
  <div>
    <v-chart :forceFit="true" :height="height" :data="data" :scale="scale" :padding="[ 10, 0, 30, 0]">
      <v-tooltip :crosshairs="false" :inPlot="false" position="top" :show-title="false"/>
      <v-axis :data-key="dataKey" :label="{offset: -10}"/>
      <v-bar :position="position" />
    </v-chart>
  </div>
</template>

<script>
  export default {
    name: 'histogram',
    props: {
      data: Array,
      dataKey: String
    },
    data() {
      return {
        scale: {
          dataKey: this.dataKey,
          formatter: val => val + this.unit
        },
        height: 250,
        position: `value*${this.dataKey}`
      };
    },
    computed: {
      unit () {
        if (this.dataKey === 'cpu') {
          return '%'
        } else if (this.dataKey === 'memory' || this.dataKey === 'read' || this.dataKey === 'write') {
          return 'MB'
        } else if (this.dataKey === 'bytesIn' || this.dataKey === 'bytesOut') {
          return 'KB'
        }
        return ''
      }
    }
  }
</script>