<template>
  <div>
    <el-card style="margin:20px 0">
      <CategorySelect :show="!isShowTable" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom:20px" :disabled="!category3Id" @click="addAttr">
          添加属性
        </el-button>
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column prop="prop" label="序号" width="80" type="index" align="center" />
          <el-table-column prop="attrName" label="属性名称" width="150" />
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{row,$index}">
              <el-tag v-for="(attrValue,index) in row.attrValueList" :key="attrValue.id" type="success" style="margin: 0 20px">{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{row,$index}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)" />
              <el-button type="danger" icon="el-icon-delete" size="mini" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性 修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form ref="form" :inline="true" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table style="width: 100%;margin:20px 0" border :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="prop" label="属性值名称">
            <template slot-scope="{row,$index}">
              <el-input v-if="row.flag" :ref="$index" v-model="row.valueName" placeholder="请输入属性值名称" @blur="toLook(row)" @keyup.native.enter="toLook(row)" />
              <span v-else style="display:block" @click="toEdit(row,$index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="prop" label="操作">
            <template slot-scope="{row,$index}">
              <el-popconfirm :title="`确定删除${row.valueName}`" @onConfirm="deleteAttrValue($index)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="attrInfo.attrValueList.length<1" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 接收平台属性字段
      attrList: [],
      // 控制table表格的属性与隐藏的
      isShowTable: true,
      // 收集新增属性 修改属性使用的
      attrInfo: {
        attrName: '', // 属性名
        attrValueList: [
          // 属性值 因为属性值可以有多个因此使用数组 每一个属性值都是一个对象 需要 attrId valueName
          // {
          //   attrId: 0, // 相应的属性名id
          //   valueName: ''
          // }
        ],
        categoryId: 0, // 三级分类id
        categoryLevel: 3 // 因为服务器也需要区分几级id 所以需要这个字段
      }
    }
  },
  methods: {
    // 自定义事件的回调
    getCategoryId({ categoryId, level }) {
      // 区分三级分类的id 一级父组件进行存储
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        // 代表三级分类的id有了
        this.category3Id = categoryId
        // 发请求获取品牌属性
        this.getAttrList()
      }
    },
    // 获取平台属性的数据
    // 当用户确定三级分类的数据时间 可以向服务器发请求获取平台属性进行展示
    async getAttrList() {
      // 获取分类的id
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
      if (result.code === 200) {
        this.attrList = result.data
      }
    },
    // 添加属性值
    addAttrValue() {
      // 给属性值数据里面添加元素
      this.attrInfo.attrValueList.push({
        // attrId 相应属性值的id 目前我们是添加属性值操作 没有相应的id 所以带给服务器一个 undefined
        // valueName 相应的属性值名称
        attrId: this.attrInfo.id,
        valueName: '',
        // flag属性：给每一个属性添加一个标记 flag 用户切换查看模式与编辑模式 好处：每一个属性值可以控制自己的模式切换
        flag: true
      })
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 添加属性按钮的回调
    addAttr() {
      // 切换table显示与隐藏
      this.isShowTable = false
      // 清除数据
      // 收集三级分类id
      this.attrInfo = {
        attrName: '', // 属性名
        attrValueList: [
          // 属性值 因为属性值可以有多个因此使用数组 每一个属性值都是一个对象 需要 attrId valueName
          // {
          //   attrId: 0, // 相应的属性名id
          //   valueName: ''
          // }
        ],
        categoryId: this.category3Id, // 三级分类id
        categoryLevel: 3 // 因为服务器也需要区分几级id 所以需要这个字段
      }
    },
    // 修改某一个属性
    updateAttr(row) {
      // isShowTable变为false
      this.isShowTable = false
      // 将选中的属性赋值给attrInfo
      // 由于数据结构当中存在对象里面套数组 数组里面套对象 因此需要使用lodash深拷贝来解决这个问题
      this.attrInfo = cloneDeep(row)
      // 在修改某一属性的时候将相应的属性值元素添加flag这个标记
      this.attrInfo.attrValueList.forEach(item => {
        // 这样书写也可以给属性值添加flag,但是视图不会跟着变化(因为flag不是响应式数据)
        // 因为Vue无法探测普通的性值 property 这样属性的属性并非响应式属性
        // item.flag = false
        // 想要响应式属性可以使用$set
        // 第一个参数: 对象
        // 第二个参数: 添加新的响应式属性
        // 第三个参数: 新的属性的属性值
        this.$set(item, 'flag', false)
      })
    },
    // 失去焦点和回车事件
    toLook(row) {
      if (row.valueName.trim() === '') {
        this.$message('请你输入一个正常的属性值')
        return
      }
      // 新增的属性值不能与已有的属性值重复
      const isRepat = this.attrInfo.attrValueList.some(item => {
        // row 最新新增的属性值(数组的最后一项元素)
        // 判断的时候需要把已有的数组当中新增的这个属性值去除
        if (row !== item) {
          return row.valueName === item.valueName
        }
      })
      if (isRepat) return
      // row 为当前用户添加最新的属性值
      // flag 用来把当前编辑模式变为查看模式(让input消失 显示span)
      row.flag = false
    },
    // 点击span的回调 变为编辑模式
    toEdit(row, index) {
      row.flag = true
      // 获取input节点 世轩自动聚焦
      // 需要注意：点击span的时候变为编辑模式input 但是对于浏览器而言 页面重绘与重拍需要时间
      // 点击span的时候 重绘重拍一个Input它是需要耗费时间 因此我们不可能一点击span就立马收到input
      // $nextTick 当节点渲染完毕了 会执行一次
      this.$nextTick(() => {
        // 获取相应的Input表单元素实现自动聚焦
        console.log(this.$refs[index])
        this.$refs[index].focus()
      })
    },
    // 气泡确认框按钮的回调
    deleteAttrValue(index) {
      // 当前删除的属性值不需要发请求
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 保存按钮 进行添加属性或者修改属性的操作
    async addOrUpdateAttr() {
      // 整理参数
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        if (item.valueName !== '') {
          // 删除掉 flag 属性
          delete item.flag
          return true
        }
      })
      try {
        // 发请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        this.$message({ type: 'success', message: '保存成功' })
        // 保存成功以后需要在获取平台数据渲染
        this.getAttrList()
        this.isShowTable = true
      } catch (error) {
        this.$message({ type: 'error', message: '保存失败' })
      }
    }
  }
}
</script>

<style></style>
