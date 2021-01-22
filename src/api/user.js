/*
 * @Author: your name
 * @Date: 2021-01-03 18:53:28
 * @LastEditTime: 2021-01-03 18:53:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /yj-project/src/api/user.js
 */
/**
* 用户相关api
*/
import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/yj-auth/oauth/token',
    method: 'post',
    params: data
  })
}

export function getUserInfo () {
  return request({
    url: '/yj-grouping/user/me',
    method: 'get'
  })
}

export function logout () {
  return request({
    url: '/youlai-auth/oauth/logout',
    method: 'delete',
    headers: {
      'auth': true // 需要认证
    }
  })
}

