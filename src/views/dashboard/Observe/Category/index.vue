<template>
  <div>
    <el-card>
      <div slot="header" class="head">
        <div class="category-header">
          <span>销售额类别占比</span>
          <el-radio-group v-model="value">
            <el-radio-button label="全部渠道" />
            <el-radio-button label="线上" />
            <el-radio-button label="门店" />
          </el-radio-group>
        </div>
      </div>
      <div>
        <div ref="charts" class="charts" />
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: '',
  data() {
    return {
      value: '全部渠道'
    }
  },
  mounted() {
    // 饼图
    const myCharts = echarts.init(this.$refs.charts)
    myCharts.setOption({
      title: {
        text: '视频',
        subtext: 1048,
        left: 'center',
        top: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outside'
          },
          labelLine: {
            show: true
          },
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ]
        }
      ]
    })
    // 绑定事件
    myCharts.on('mouseover', params => {
      // echarts 自动配置又 params 参数 为鼠标移动到某条数据的参数
      // params.data 含有标题 name 和子标题 value
      const { name, value } = params.data
      // 重新设置标题
      myCharts.setOption({
        title: {
          text: name,
          subtext: value
        }
      })
    })
  }
}
</script>

<style scoped>
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.head {
  border-bottom: 1px solid #eee;
}
.charts {
  width: 100%;
  height: 300px;
}
</style>
