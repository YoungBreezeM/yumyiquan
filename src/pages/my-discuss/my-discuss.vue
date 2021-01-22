<!--
 * @Author: your name
 * @Date: 2020-12-23 16:07:36
 * @LastEditTime: 2021-01-22 09:17:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /yj-project/src/pages/my-discuss/my-discuss.vue
-->
<template>
  <view>
    <discuss-list :list="discussList"
                  :loadStatus="loadStatus"></discuss-list>
  </view>
</template>

<script>
import discussList from '../../components/discuss-list/discuss-list.vue';
export default {
  components: {
    discussList
  },
  data () {
    return {
      discussList: [],
      loadStatus: "loadmore",
      page: 1,
      limit: 10,
      user: uni.getStorageSync("user")
    };
  },
  onLoad () {
    this.getDiscussList();
  },
  onReachBottom () {
    this.page++;
    this.getDiscussList();
  },
  methods: {
    getDiscussList () {
      this.loadStatus = "loading";
      this.$H.get("/yj-grouping/topic/byUid/pages/" + this.page + "/" + this.limit + "/" + this.user.id)
        .then(res => {
          this.discussList = this.discussList.concat(res.data);
          if (res.total <= this.page * this.limit) {
            this.loadStatus = "nomore";
          } else {
            this.loadStatus = "loadmore"
          }
        })
    }
  }
}
</script>

<style lang="scss">
</style>
