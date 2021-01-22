<!--
 * @Author: your name
 * @Date: 2020-12-23 16:07:36
 * @LastEditTime: 2021-01-22 17:28:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /yj-project/src/pages/my-collection/my-collection.vue
-->
<template>
  <view>
    <post-list :list="postList"
               :loadStatus="loadStatus"></post-list>
  </view>
</template>

<script>
import postList from '../../components/post-list/post-list.vue';
export default {
  components: {
    postList
  },
  data () {
    return {
      postList: [],
      loadStatus: "loading",
      page: 1,
      limit: 2,
      user: uni.getStorageSync("user")
    };
  },
  onLoad () {
    this.getPostList();
  },
  onReachBottom () {
    this.page++;
    this.getPostList();

  },
  methods: {
    getPostList () {
      this.loadStatus = "loading";
      this.$H.get('/yj-grouping/favorites/byUid/' + this.page + "/" + this.limit + "/" + this.user.id)
        .then(res => {
          let postList = [];
          res.data.forEach(item => {
            item.article.media = JSON.parse(item.article.media);
            postList.push(item.article)
          })
          this.postList = this.postList.concat(postList);
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
page {
  background-color: #f5f5f5;
}
</style>
