<template>
  <div>
    <v-chart :forceFit="true" :height="height" :data="data" :scale="scale" :padding="[ 10, 0, 30, 0]">
      <v-tooltip :crosshairs="false" :inPlot="false" position="top" :show-title="false"/>
      <v-axis position="right" dataKey="gpu" :label="{offset: -10}" :grid="null"></v-axis>
      <v-axis position="left" dataKey="fps" :label="{offset: -10}"></v-axis>
      <v-legend position="top-left" :offset-y="40" :offset-x="20"/>
      <v-area shape="smooth" position="value*fps" color="green"/>
      <v-area shape="smooth" position="value*gpu" color="red"/>
    </v-chart>
  </div>
</template>

<script>
export default {
  name: 'histogram',
  props: {
    data: Array
  },
  data() {
    return {
      scale: [{
        dataKey: 'gpu',
        max: 100,
        min: 0,
        formatter: val => val + '%'
      },{
        dataKey: 'fps',
        max: 60,
        min: 0,
        formatter: val => val + 'fps'
      }],
      height: 310
    };
  }
  // computed: {
  //   unit () {
  //     if (this.dataKey === 'cpu') {
  //       return '%'
  //     } else if (this.dataKey === 'memory' || this.dataKey === 'read' || this.dataKey === 'write') {
  //       return 'MB'
  //     }
  //   }
  // }
  // data() {
  //   return {
  //     data,
  //     scale: [{
  //       dataKey: 'value',
  //       min: 10000,
  //     }, {
  //       dataKey: 'year',
  //       min: 0,
  //       max: 1,
  //     }],
  //     height: 400,
  //   };
  // }
};
</script>