<template>
  <!-- 容器 -->
  <div ref="charts" class="charts" />
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: '',
  mounted() {
    // 初始化echarts实例
    const lineCharts = echarts.init(this.$refs.charts)
    lineCharts.setOption({
      xAxis: {
        // 隐藏
        show: false,
        type: 'category'
      },
      yAxis: {
        show: false
      },
      // 系列
      series: [
        {
          type: 'bar',
          data: [10, 7, 33, 12, 48, 9, 29, 10, 44, 22, 33, 8]
        }
      ],
      // 布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      tooltip: {}
    })
  }
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
