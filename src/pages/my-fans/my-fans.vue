<!--
 * @Author: your name
 * @Date: 2020-12-23 16:07:36
 * @LastEditTime: 2021-01-22 21:36:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /yj-project/src/pages/my-fans/my-fans.vue
-->
<template>
  <view>
    <user-list :list="userList"></user-list>
  </view>
</template>

<script>
import userList from '../../components/user-list/user-list.vue';
export default {
  components: {
    userList,
  },
  data () {
    return {
      userList: [],
      page: 1,
      loadStatus: "loadmore",
      user: uni.getStorageSync("user")
    };
  },
  onLoad () {
    this.getUserList();
  },
  methods: {
    getUserList () {
      this.loadStatus = "loading";
      this.$H.get('/yj-grouping/attention/' + this.user.id + "/0").then(res => {
        this.userList = this.userList.concat(res.data);
        this.loadStatus = "nomore";

      })
    }
  }
}
</script>

<style lang="scss">
</style>
