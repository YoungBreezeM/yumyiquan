/*
 * @Author: your name
 * @Date: 2021-02-03 18:13:12
 * @LastEditTime: 2021-02-04 16:32:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /yj-project/src/api/gua.js
 */
import request from '@/utils/request'

export function getArticleByCid ({ page, limit, articleId, type }) {
  return request({
    url: '/yj-grouping/article/getArticleByCid/' + page + "/" + limit + "/" + articleId + "/" + type,
    method: 'get'
  })
}

