/*
 * @Author: your name
 * @Date: 2021-02-03 18:13:12
 * @LastEditTime: 2021-02-13 10:06:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /yj-project/src/api/gua.js
 */
import request from '@/utils/request'

export function computedGua (data) {
  return request({
    url: '/yj-grouping/gua/computed/',
    method: 'post',
    data: data
  })
}

export function getPredictionCategory () {
  return request({
    url: '/yj-grouping/prediction-category',
    method: 'get'
  })
}

export function getGuaComputeText (data, userId) {
  return request({
    url: '/yj-grouping/prediction/getGuaComputeText/' + userId,
    method: 'post',
    data: data
  })
}
