<template>
  <div>
    <!-- 表格 -->
    <el-table :data="records" style="width: 100%" border>
      <el-table-column type="index" label="序号" align="center" width="80" />
      <el-table-column prop="skuName" label="名称" width="width" />
      <el-table-column prop="skuDesc" label="描述" width="width" />
      <el-table-column prop="prop" label="默认图片" width="110">
        <template slot-scope="{row,$index}">
          <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="80" />
      <el-table-column prop="price" label="价格(元)" width="80" />
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.isSale==0" type="success" icon="el-icon-bottom" @click="sale(row)" />
          <el-button v-else type="success" icon="el-icon-top" @click="cancel(row)" />
          <el-button type="primary" icon="el-icon-edit" @click="edit()" />
          <el-button type="info" icon="el-icon-info" @click="getSkuInfo(row)" />
          <el-button type="danger" icon="el-icon-delete" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页  -->
    <el-pagination :current-page="1" :page-sizes="[3, 5, 10]" :page-size="10" layout=" prev, pager, next, jumper,->,total, sizes" :total="total" style="text-align:center" @current-change="getSkuList" @size-change="handleSizeChange" />
    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">
          名称
        </el-col>
        <el-col :span="16">
          {{ skuInfo.skuName }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          描述
        </el-col>
        <el-col :span="16">
          {{ skuInfo.skuDesc }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          价格
        </el-col>
        <el-col :span="16">
          {{ skuInfo.price }} 元
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          平台属性
        </el-col>
        <el-col :span="16">
          <template>
            <el-tag v-for="(attr,index) in skuInfo.skuAttrValueList" :key="attr.id" type="success" style="margin-right:10px">{{ attr.attrId }}-{{ attr.valueId }}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          商品图片
        </el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      // 代表当前第几页
      page: 1,
      // 代表每页有几条数据
      limit: 10,
      // 存储sku列表的数据
      records: [],
      // 分页器一共多少条数据
      total: 0,
      // 存储sku的详情信息
      skuInfo: {},
      show: false
    }
  },
  // 组件挂在完毕
  mounted() {
    // 获取sku列表的方法
    this.getSkuList()
  },
  methods: {
    async getSkuList(pages = 1) {
      this.page = pages
      // 解构处默认参数
      const { page, limit } = this
      // 发请求
      const result = await this.$API.sku.reqSkuList(page, limit)
      if (result.code === 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    },
    // 上架
    async sale(row) {
      const result = await this.$API.sku.reqSale(row.id)
      if (result.code === 200) {
        row.isSale = 1
        this.$message({ type: 'success', message: '上架成功' })
      }
    },
    // 下架
    async cancel(row) {
      const result = await this.$API.sku.reqCancel(row.id)
      if (result.code === 200) {
        row.isSale = 0
        this.$message({ type: 'success', message: '下架成功' })
      }
    },
    edit() {
      this.$message({ type: 'info', message: '正在开发中' })
    },
    // 获取SKU详情
    async getSkuInfo(row) {
      // 展示抽屉
      this.show = true
      // 获取SKU数据
      const result = await this.$API.sku.reqSkuById(row.id)
      if (result.code === 200) {
        this.skuInfo = result.data
      }
    }
  }
}
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.el-carousel__button {
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
}
</style>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}
</style>
