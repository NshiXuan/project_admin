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
        min: 0,
        max: 100
      },
      yAxis: {
        type: 'category',
        show: false
      },
      // 系列
      series: [
        {
          type: 'bar',
          data: [78],
          // 柱状图宽度
          barWidth: 10,
          color: 'yellowgreen',
          // 背景颜色设置
          showBackground: true,
          backgroundStyle: {
            color: '#eee'
          },
          // 展示文本
          label: {
            show: true,
            // 改变文本内容，默认为 data 的数据
            formatter: '|',
            position: 'right',
            color: '#666'
          }
        }
      ],
      // 布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
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
