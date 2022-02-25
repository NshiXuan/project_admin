<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select v-model="cForm.category1Id" placeholder="请选择" :disabled="show" @change="handler1">
          <el-option v-for="(c1,index) in list1" :key="c1.id" :label="c1.name" :value="c1.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.category2Id" placeholder="请选择" :disabled="show" @change="handler2">
          <el-option v-for="(c2, index) in list2" :key="c2.id" :label="c2.name" :value="c2.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.category3Id" placeholder="请选择" :disabled="show" @change="handler3">
          <el-option v-for="(c3, index) in list3" :key="c3.id" :label="c3.name" :value="c3.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: ['show'],
  data() {
    return {
      // 一级分类数据
      list1: [],
      // 二级分类数据
      list2: [],
      // 三级分类数据
      list3: [],
      // 收集相应的一级二级三级分类的id
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  // 组件挂载完毕，向服务器发请求获取相应的一级分类的数据
  mounted() {
    // 获取一级分类数据
    this.getCategory1List()
  },
  methods: {
    // 获取一级分类数据
    async getCategory1List() {
      // 获取一级分类的请求不需要携带参数
      const result = await this.$API.attr.reqCategory1List()
      if (result.code === 200) {
        this.list1 = result.data
      }
    },
    // 一级分类的 select 事件回调(当一级分类的option发生了变化的时候获取数据相应二级分类的数据)
    async handler1() {
      // 清除数据
      this.list2 = []
      this.list3 = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      // 解构出一级分类的id
      const { category1Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
      // 通过一级分类的id获取二级分类的数据
      const result = await this.$API.attr.reqCategory2List(category1Id)
      if (result.code === 200) {
        this.list2 = result.data
      }
    },
    // 二级分类的 select 事件回调(当二级分类的option发生了变化的时候获取数据相应三级分类的数据)
    async handler2() {
      // 清除数据
      this.list3 = []
      this.cForm.category3Id = ''
      // 解构出数据
      const { category2Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })
      const result = await this.$API.attr.reqCategory3List(category2Id)
      if (result.code === 200) {
        this.list3 = result.data
      }
    },
    // 三级分类事件的回调
    handler3() {
      // 解构出数据
      const { category3Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })
    }
  }
}
</script>

<style>
</style>
