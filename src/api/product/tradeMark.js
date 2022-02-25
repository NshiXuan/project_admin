// 这个模块获取品牌管理数据
import request from '@/utils/request'

// 获取品牌列表的接口
export const reqTradeMarkList = (page, limit) => request({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method: 'get'
})

// 添加品牌 携带俩个参数 品牌名称 品牌logo
// 修改品牌 携带三个参数 id 品牌名称 品牌logo
export const reqAddorUpdateTradeMark = (tradeMark) => {
  if (tradeMark.id) {
    return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark })
  } else {
    return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark })
  }
}

// 删除品牌
export const reqDeleteTradeMark = (id) => request({
  url: `/admin/product/baseTrademark/remove/${id}`,
  method: 'delete'
})
