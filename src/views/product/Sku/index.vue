<template>
  <div>
    <!-- 表格 -->
    <el-table :data="data" style="width: 100%">
      <el-table-column type="index" label="序号" align="center" width="80" />
      <el-table-column prop="prop" label="名称" width="width" />
      <el-table-column prop="prop" label="描述" width="width" />
      <el-table-column prop="prop" label="默认图片" width="110" />
      <el-table-column prop="prop" label="重量(KG)" width="80" />
      <el-table-column prop="prop" label="价格(元)" width="80" />
      <el-table-column prop="prop" label="操作" width="width" />
    </el-table>
    <!-- 分页 @size-change="handleSizeChange" @current-change="handleCurrentChange" -->
    <el-pagination :current-page="1" :page-sizes="[3, 5, 10]" :page-size="10" layout=" prev, pager, next, jumper,->,total, sizes" :total="20" style="text-align:center" />
  </div>
</template>

<script>
export default {
  name: 'Sku'
}
</script>

<style></style>
