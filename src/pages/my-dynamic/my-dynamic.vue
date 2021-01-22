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
      this.$H.get('/yj-grouping/article/byUid/' + this.page + "/" + this.limit + "/" + this.user.id)
        .then(res => {
          res.data.list.forEach(item => {
            item.media = JSON.parse(item.media)
          })
          this.postList = this.postList.concat(res.data.list);
          if (res.data.total <= this.page * this.limit) {
            this.loadStatus = "nomore";
          } else {
            this.loadStatus = "loadmore"
          }
        })
    }
  }
}
</script>

<style>
page {
  background-color: #f5f5f5;
}
</style>
