<template>
  <el-card class="box-card" style="margin:10px 0">
    <div slot="header" class="clearfix">
      <!-- 头部左侧内容 -->
      <el-tabs v-model="activeName" class="tab">
        <el-tab-pane label="销售额" name="sale" />
        <el-tab-pane label="访问量" name="visite" />
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <!-- v-model="value1" -->
        <el-date-picker v-model="date" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" class="date" value-format="yyyy-MM-dd" />
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <!-- Echarts容器 -->
          <div ref="charts" class="charts" />
        </el-col>
        <el-col :span="6">
          <div>
            <h3>门店{{ title }}排名</h3>
            <ul>
              <li><span class="rindex">1</span><span>肯德基</span><span class="rvalue">123</span></li>
              <li><span class="rindex">2</span><span>肯德基</span><span class="rvalue">123</span></li>
              <li><span class="rindex">3</span><span>肯德基</span><span class="rvalue">123</span></li>
              <li><span>4</span><span>肯德基</span><span class="rvalue">123</span></li>
              <li><span>5</span><span>肯德基</span><span class="rvalue">123</span></li>
              <li><span>6</span><span>肯德基</span><span class="rvalue">123</span></li>
              <li><span>7</span><span>肯德基</span><span class="rvalue">123</span></li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
// 引入Echarts
import * as echarts from 'echarts'
import dayjs from 'dayjs'

export default {
  name: '',
  data() {
    return {
      activeName: 'sale',
      myCharts: null,
      // 收集日历的数据
      date: []
    }
  },
  computed: {
    // 计算属性 标题
    title() {
      return this.activeName === 'sale' ? '销售额' : '访问量'
    }
  },
  // 监听属性
  watch: {
    title() {
      // 查询修改图标的配置数据
      // 图标配置数据可以再次移动 如果有新的数值 使用新的数值 没有新的数值 还是使用以前的
      this.myCharts.setOption({
        title: {
          text: this.title + '趋势'
        }
      })
    }
  },
  mounted() {
    // 初始化echarts实例
    this.myCharts = echarts.init(this.$refs.charts)
    // 配置项
    this.myCharts.setOption({
      title: {
        text: '销售额趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220, 110, 98, 167, 123, 44],
          color: 'yellowgreen'
        }
      ]
    })
  },
  methods: {
    // 本天
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      console.log(day)
      this.date = [day, day]
    },
    // 本周
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start, end]
    },
    // 本月
    setMonth() {
      // 本月第一天
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      // 本月最后一天
      const end = dayjs().startOf('month').format('YYYY-MM-DD')
      this.date = [start, end]
    },
    // 本年
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start, end]
    }
  }
}
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.right span {
  margin: 0 10px;
}
.date {
  width: 250px;
  margin: 0 20px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
ul li {
  height: 8%;
  margin: 10px 0;
}
ul li span {
  margin-left: 10px;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: black;
  color: #fff;
  line-height: 20px;
  text-align: center;
}
.rvalue {
  float: right;
}
</style>
