<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" style="margin:10px 0px" @click="showDialog">添加
    </el-button>
    <!-- 表格组件 data: 表格组件将来要展示的数据 -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center" />
      <el-table-column prop="tmName" label="品牌名称" width="width" />
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" alt="" style="width:100px;height:100px">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" @click="updateTradeMark(row)">
            修改
          </el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--
       分页器
       :current-page 当前第几页
       :page-size 每一页展示的个数
       :page-sizes 设置每一展示多少条数据
       :total 数据总条数
       :pager-count 连续页码器 默认为7 中间5条 可以修改但要大于5小于21的奇数
       layout 为布局样式 可以调换位置 -> 可以让布局为最右边
       @size-change="handleSizeChange" @current-change="handleCurrentChange"
     -->
    <el-pagination style="margin-top:20px;textAlign:center" :current-page="page" :page-sizes="[3, 5, 10]" :page-size="limit" :total="total" :pager-count="5" layout="prev, pager, next, jumper,->, total, sizes" @current-change="getPageList" @size-change="handleSizeChange" />

    <!-- 对话框 -->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!-- form 表单 -->
      <el-form ref="ruleform" style="width:80%" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    return {
      // 当前第几页
      page: 1,
      // 当前页数显示条数
      limit: 3,
      // 总数据条数
      total: 0,
      // 列表展示的数据
      list: [],
      // 控制添加对话框的显示与隐藏
      dialogFormVisible: false,
      // 收集品牌信息
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      rules: {
        // 品牌名称的验证规则
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        // 品牌logo的验证规则
        logoUrl: [{ required: true, message: '请选择品牌图片' }]
      }
    }
  },
  mounted() {
    this.getPageList()
  },
  methods: {
    // 获取品牌列表数据
    async getPageList(pager = 1) {
      this.page = pager
      // 解构出参数
      const { page, limit } = this
      // 获取品牌列表数据的接口
      // 这个函数带参数，所以在data中初始化两个字段，代表给服务器传递的参数
      const result = await this.$API.trademark.reqTradeMarkList(page, limit)
      if (result.code === 200) {
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    // 当分页器某一页的数据展示条数发生变化时触发
    handleSizeChange(limit) {
      this.limit = limit
      this.getPageList()
    },
    // 上传图片相关的图片
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 点击添加按钮(
    showDialog() {
      // 显示对话框
      this.dialogFormVisible = true
      // 清除数据
      this.tmForm = { tmName: '', logoUrl: '' }
    },
    // 点击确定按钮发请求
    addOrUpdateTradeMark() {
      // 当表单的验证通过才发请求
      this.$refs.ruleform.validate(async success => {
        if (success) {
          this.dialogFormVisible = false
          // 发请求
          const result = await this.$API.trademark.reqAddorUpdateTradeMark(this.tmForm)
          if (result.code === 200) {
            this.$message({ type: 'success', message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功' })
            // 如果添加品牌 留在第一页
            // 如果修改品牌 留在当前页
            this.getPageList(this.tmForm.id ? this.page : 1)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 修改品牌
    updateTradeMark(row) {
      this.dialogFormVisible = true
      // 将已有的品牌赋值给 tmForm 进行展示
      // {...row} 浅拷贝
      this.tmForm = { ...row }
    },
    // 删除品牌
    deleteTradeMark(row) {
      this.$confirm(`你确定删除${row.tmName}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          // 向服务器发请求
          const result = await this.$API.trademark.reqDeleteTradeMark(row.id)
          if (result.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
