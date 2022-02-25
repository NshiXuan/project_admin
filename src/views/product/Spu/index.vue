<template>
  <div>
    <el-card style="margin:20px 0">
      <CategorySelect :show="scene!=0" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <div v-show="scene==0">
        <!-- 展示SPU列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 20px" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table :data="records" style="width: 100%" border>
          <el-table-column type="index" align="center" label="序号" width="80" />
          <el-table-column prop="spuName" label="SPU名称" width="width" />
          <el-table-column prop="description" label="SPU描述" width="width" />
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <hint-button type="success" icon="el-icon-plus" title="添加sku" @click="addSku(row)" />
              <hint-button type="warning" icon="el-icon-edit" title="修改spu" @click="updateSpu(row)" />
              <hint-button type="info" icon="el-icon-info" title="查看当前spu全部sku列表" @click="handler(row)" />
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <hint-button slot="reference" type="danger" icon="el-icon-delete" title="删除spu" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination style="text-align:center" :current-page="page" :page-sizes="[3, 5, 10]" :page-size="limit" layout="prev, pager, next, jumper,->,total, sizes" :total="total" @size-change="handleSizeChange" @current-change="getSpuList" />
      </div>
      <SpuForm v-show="scene==1" ref="spu" @changeScene="changeScene" />
      <SkuForm v-show="scene==2" ref="sku" @changeScenes="changeScenes" />
    </el-card>
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table v-loading="loading" :data="skuList" border>
        <el-table-column property="skuName" label="名称" width="width" />
        <el-table-column property="price" label="价格" width="width" />
        <el-table-column property="weight" label="重量" width="width" />
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'

export default {
  name: 'Spu',
  components: {
    SpuForm,
    SkuForm
  },
  data() {
    return {
      // 分类的id
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 分页器
      page: 1,
      limit: 3,
      total: 0,
      // spu列表数据
      records: [],
      // 0代表展示SPU列表 1添加SPU|修改SPU 2添加SKU
      scene: 0,
      // 控制对话框的显示与隐藏
      dialogTableVisible: false,
      // 存储spu信息
      spu: {},
      // 存储sku列表的数据
      skuList: [],
      loading: true
    }
  },
  methods: {
    // 三级联动的自定义事件 可以把子组件的相应的id传递给父组件
    getCategoryId({ categoryId, level }) {
      // categoryId 获取到一二三级id level 区分一二三级id
      if (level === 1) {
        this.category1Id = categoryId
        // 清除2 3 级id
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        // 获取 SPU 类的列表进行数据展示
        this.getSpuList()
      }
    },
    // 获取SPU列表数据
    async getSpuList(pages = 1) {
      this.page = pages
      // 携带三个参数 page limit category3Id
      const { page, limit, category3Id } = this
      const result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (result.code === 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    // 当分页器的某一个数据条数发送变化的回调
    handleSizeChange(limit) {
      this.limit = limit
      // 再次发请求
      this.getSpuList()
    },
    // 添加spu按钮的回调
    addSpu() {
      this.scene = 1
      // 通知子组件spuForm发请求
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 修改SPU
    updateSpu(row) {
      this.scene = 1
      this.$refs.spu.initSpuData(row)
    },
    // 修改scene的值用来显示切换列表
    changeScene({ scene, flag }) {
      // flage 这个形参为了区分保存按钮是添加还是修改
      this.scene = scene
      // 切换场景重新发请求
      if (flag === '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
    },
    // 删除SPU按钮
    async deleteSpu(row) {
      const result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '删除成功' })
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
      }
    },
    // 添加Sku按钮的回调
    addSku(row) {
      // 切换场景2
      this.scene = 2
      // 父组件调用子组件方法 让子组件发请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    // SkuForm通知父组件修改场景
    changeScenes(scene) {
      this.scene = scene
    },
    // 查看sku按钮的回调
    async handler(spu) {
      this.dialogTableVisible = true
      this.spu = spu
      // 获取sku列表的数据进行展示
      const result = await this.$API.spu.reqSkuList(spu.id)
      if (result.code === 200) {
        this.skuList = result.data
        // loading隐藏
        this.loading = false
      }
    },
    // 关闭对话框的回调
    close(done) {
      this.loading = true
      // 清除数据
      this.skuList = []
      // 关闭对话框
      done()
    }
  }
}
</script>

<style></style>
