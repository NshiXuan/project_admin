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
          type: 'line',
          data: [10, 7, 33, 12, 48, 9, 29, 10, 44],
          // 拐点样式的透明度
          itemStyle: {
            opacity: 0
          },
          // 线条的颜色
          lineStyle: {
            color: 'purple'
          },
          // 填充颜色设置
          areaStyle: {
            // 渐变颜色
            color: {
              type: 'line',
              x: 0,
              y: 0,
              r: 0,
              colorStops: [
                {
                  offset: 0,
                  color: 'purple' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#fff' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
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
