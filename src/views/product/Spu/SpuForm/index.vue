<template>
  <div>
    <el-form label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option v-for="(tm, index) in tradeMarkList" :key="tm.id" :label="tm.tmName" :value="tm.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" type="textarea" rows="4" placeholder="SPU描述" />
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="spuImageList" :on-success="handlerSuccess">
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="attrIdAndAttrName" :placeholder="`还有${unSelectSaleAttr.length}项未选`">
          <el-option v-for="(unSelete, index) in unSelectSaleAttr" :key="unSelete.id" :label="unSelete.name" :value="`${unSelete.id}:${unSelete.name}`" />
        </el-select>
        <el-button type="primary" icon="el-icon-plus" style="margin: 0 0 20px 10px" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <el-table :data="spu.spuSaleAttrList" style="width: 100%" border>
          <el-table-column type="index" label="序列" width="80" align="center" />
          <el-table-column prop="saleAttrName" label="属性名" width="width" />
          <el-table-column prop="" label="属性值名称列表" width="width">
            <template slot-scope="{row,$index}">
              <!-- @close="handleClose(tag)" -->
              <el-tag v-for="(tag,index) in row.spuSaleAttrValueList" :key="tag.id" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 地下的结构可以当作之前的span与input的切换 -->
              <!-- @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" -->
              <el-input v-if="row.inputVisible" ref="saveTagInput" v-model="row.inputValue" class="input-new-tag" size="small" @blur="handleInputConfirm(row)" />
              <!-- @click="showInput" -->
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" @click="spu.spuSaleAttrList.splice($index,1)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      // 存储SPU的信息属性 spu属性初始化的时候是一个空对象 在修改SPU的时候 会向服务器发请求 返回SPU信息 在修改的时候可以利用服务器返回的对象收集到最新的数据提交给服务器
      // 添加SPU 如果添加SPU的时候没有向服务器发请求 数据收集到哪里？ 收集数据的时候有那些字段？ 看文档
      spu: {
        // 三级分类id
        category3Id: 0,
        // 描述
        description: '',
        // spu名称
        spuName: '',
        // 平台id
        tmId: '',
        // 收集SPU图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: 'string',
          //   imgUrl: 'string',
          //   spuId: 0
          // }
        ],
        // 平台属性与属性值的数组
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: 'string',
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: 'string',
          //       saleAttrName: 'string',
          //       saleAttrValueName: 'string',
          //       spuId: 0
          //     }
          //   ]
          // }
        ]
      },
      // 存储品牌信息
      tradeMarkList: [],
      // 存储SPU图片的数据
      spuImageList: [],
      // 存储销售属性数据
      saleAttrList: [],
      // 收集未选择的销售属性的id
      attrIdAndAttrName: ''
    }
  },
  computed: {
    // 计算出还未选择的销售属性
    unSelectSaleAttr() {
      // 整个平台的销售属性就三个: 颜色 尺寸 版本
      // 当前的SPU拥有的属于自己的销售属性SPU.spuSaleAttrList
      const result = this.saleAttrList.filter(item => {
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name !== item1.saleAttrName
        })
      })
      return result
    }
  },
  methods: {
    // 照片墙删除某个图片触发
    handleRemove(file, fileList) {
      // file: 代表的是删除的那张图片
      // fileList: 照片墙删除某一张图片后剩余的其他图片
      // console.log(file, fileList)
      // 收集照片墙的数据
      // 对于已有的图片(照片墙中显示的图片: 有 name、url 字段的) 因为照片墙显示数据务必要有这两个属性
      // 对于服务器而言 可能不需要name、url字段 将来对于有的图片的数据在提交给服务器的时候需要处理
      this.spuImageList = fileList
    },
    // 照片墙图片预览回调
    handlePictureCardPreview(file) {
      // 将图片的地址赋值给这个属性
      this.dialogImageUrl = file.url
      // 对话框显示
      this.dialogVisible = true
    },
    // 初始化SpuForm的数据
    async initSpuData(spu) {
      // 获取SPU数据
      const spuResult = await this.$API.spu.reqSpu(spu.id)
      if (spuResult.code === 200) {
        this.spu = spuResult.data
      }
      // 获取品牌的信息
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 获取spu图片数据
      const spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
      if (spuImageResult.code === 200) {
        // 由于element-ui照片墙显示图片的数据需要数组 数组里面的元素需要有name与url字段
        // 需要把服务器返回的数据进行修改
        const listArr = spuImageResult.data
        listArr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        // 把整理号的数据赋值给自定义的spuImageList用来给照片墙渲染
        this.spuImageList = listArr
      }
      // 获取品牌全部的销售属性
      const saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    },
    // 照片墙图片上传成功的回调
    handlerSuccess(response, file, fileList) {
      // response 是成功与失败的响应
      // file 是上传的这张图片
      // fileList 为全部的图片
      this.spuImageList = fileList
    },
    // 添加新的销售属性
    addSaleAttr() {
      // 已经收集需要添加的销售属性的信息
      // 把收集的到销售属性数据进行分割
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
      const newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrList: [] }
      // 添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr)
    },
    // 添加按钮的回调
    addSaleAttrValue(row) {
      // 点击销售属性值当中的添加按钮的时候，需要把 button 变为 input 通过当前的销售属性的inputVisble 控制
      // 挂载在销售属性身上的响应式数据inputVisible 控制button与input切换
      this.$set(row, 'inputVisible', true)
      // 通过响应式数据inputValue自动收集新增的销售属性
      this.$set(row, 'inputValue', '')
    },
    // 失去焦点的事件
    handleInputConfirm(row) {
      // 解构出销售属性收集到的数据
      const { baseSaleAttrId, inputValue } = row
      if (inputValue.trim() === '') {
        return this.$message('属性值不能为空！')
      }
      // 属性值不能重复
      const result = row.spuSaleAttrValueList.every(item => item.saleAttrValueName !== inputValue)
      if (!result) return
      // 新增的销售属性值
      const newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      // 把新增的销售属性值赋值给
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      // 修改 inputVisible 字段显示button
      row.inputVisible = false
    },
    // 保存按钮的回调
    async addOrUpdateSpu() {
      // 整理参数: 需要整理照片墙的数据
      // 携带参数：对于图片，需要携带imageName与imageUrl字段
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url
        }
      })
      // 发请求
      const result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if (result.code === 200) {
        // 提示
        this.$message({ type: 'success', message: '保存成功' })
        // 通知父组件回到场景0
        this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
      }
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 点击添加SPU按钮的时候发请求
    async addSpuData(category3Id) {
      // 添加SPU的时候收集三级分类的id
      this.spu.category3Id = category3Id
      // 获取品牌的信息
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 获取品牌全部的销售属性
      const saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    },
    // 取消按钮的回调
    cancle() {
      // 通知父组件切换场景0
      this.$emit('changeScene', { scene: 0, flag: '' })
      // 清除数据
      // 组件实例this._data 可以操作data当中的响应式数据
      // this.$options 可以获取配置对象(生命周期，父组件等等),配置对象的data函数返回的响应式数据为空
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
