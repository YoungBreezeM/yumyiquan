<!--
 * @Author: your name
 * @Date: 2020-12-23 16:07:36
 * @LastEditTime: 2021-01-21 18:27:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /yj-project/src/pages/article-detail/article-detail.vue
-->
<template>
  <view class="container">
    <view class="title">{{articleDetail.title}}</view>
    <view class="author">
      <text class="name">{{articleDetail.userInfo.username}}</text>
      <text class="time">{{time | timeFrom}}</text>
    </view>
    <u-parse :html="articleDetail.content"
             :selectable="true"></u-parse>
  </view>
</template>

<script>
export default {
  data () {
    return {
      articleDetail: {},
      articleId: "",
      time: ""
    };
  },
  onLoad (options) {
    this.articleId = options.id;
    this.time = options.time;
    this.getArticleDetail();
  },
  methods: {
    getArticleDetail () {

      this.$H.get('/yj-grouping/bulletin/' + this.articleId)
        .then(res => {
          this.articleDetail = res.data;
        });
    }
  }
}
</script>
<style>
page {
  background-color: #ffffff;
}
</style>
<style lang="scss" scoped>
.container {
  padding: 30rpx;
  line-height: 2;
}

.title {
  font-size: 40rpx;
  color: #000;
  margin-bottom: 20rpx;
}

.author {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;

  .name {
    color: #2979ff;
  }

  .time {
    margin-left: 20rpx;
    color: #999;
    font-size: 20rpx;
  }
}
</style>
