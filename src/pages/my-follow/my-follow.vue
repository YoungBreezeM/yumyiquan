<!--
 * @Author: your name
 * @Date: 2020-12-23 16:07:36
 * @LastEditTime: 2021-01-22 21:41:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /yj-project/src/pages/my-follow/my-follow.vue
-->
<template>
  <view>
    <user-list :list="userList"
               :loadStatus="loadStatus"></user-list>
  </view>
</template>

<script>
import userList from '../../components/user-list/user-list.vue';
export default {
  components: {
    userList,
    page: 1
  },
  data () {
    return {
      userList: [],
      loadStatus: "loadmore",
      user: uni.getStorageSync("user")
    };
  },
  onLoad () {
    this.getUserList();
  },
  onReachBottom () {
    this.page++;
    this.getUserList();
  },
  methods: {
    getUserList () {
      this.loadStatus = "loading";
      console.log(this.user)
      this.$H.get('/yj-grouping/attention/' + this.user.id + "/1").then(res => {
        this.userList = this.userList.concat(res.data);
        this.loadStatus = "nomore";

      })
    }
  }
}
</script>

<style lang="scss">
</style>