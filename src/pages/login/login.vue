<!--
 * @Author: your name
 * @Date: 2020-12-26 15:34:54
 * @LastEditTime: 2021-02-13 09:11:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /yj-project/src/pages/login/login.vue
-->
<template>
  <view class="login">
    <image class="logo"
           src="http://121.36.100.85:3389/default/%E5%85%AB%E5%8D%A6.jpeg"></image>
    <text class="txt1">申请获取以下权限</text>
    <text class="txt2">获取你的公开信息（昵称、头像等）</text>
    <u-button type="success"
              open-type="getUserInfo"
              lang="zh_CN"
              @getuserinfo="userLogin"
              shape="circle">授权登录</u-button>
  </view>
</template>

<script>
import { login } from '@/api/user'
export default {
  data () {
    return {
      domain: this.$H.domain,
      grant_type: "password",
      client_id: "wx_mini_app",
      client_secret: "123456",
      scope: "all",
      username: "admin",
      password: "123456"
    };
  },
  onLoad () {

  },
  onShow () {

  },
  methods: {
    userLogin (e) {
      let userInfo = e.detail.userInfo;
      console.log(e)
      uni.login({
        success: (res) => {
          console.log(res)
          if (res.code) {

            login({
              code: res.code,
              grant_type: this.grant_type,
              client_id: this.client_id,
              client_secret: this.client_secret,
              scope: this.scope,
              username: this.username,
              password: this.password,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv

            }).then(res => {
              console.log(res)
              uni.setStorageSync("hasLogin", true);
              if (res.data.token) {
                uni.setStorageSync("token", res.data.token);
                this.getUserInfo();
              }

              uni.navigateBack();
            })
          }
        }
      });
    },
    getUserInfo () {
      this.$H.get("/yj-grouping/user/me").then(res => {
        uni.setStorageSync('user', res.data);
      })
    }
  }
}
</script>

<style lang="scss">
@import "login.css";
</style>
