<!--
 * @Author: your name
 * @Date: 2020-12-23 16:07:36
 * @LastEditTime: 2021-01-21 20:59:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /yj-project/src/pages/my-topic/my-topic.vue
-->
<template>
  <view class="container">
    <topic-list :list="topicList"
                :loadStatus="loadStatus"></topic-list>

    <!-- 创建圈子按钮 -->
    <view style="height: 120rpx;"></view>
    <view class="f-fixed">
      <u-button @click="jump"
                class="fixed-bottom"
                type="error"
                shape="circle">
        <u-icon name="plus"></u-icon>
        <text>创建圈子</text>
      </u-button>
    </view>
  </view>
</template>

<script>
import topicList from '../../components/topic-list/topic-list.vue';
export default {
  components: {
    topicList
  },
  data () {
    return {
      topicList: [],
      loadStatus: "loading",
      page: 1,
      limit: 10
    };
  },
  onLoad () {
    this.getMyTopic();
    console.log(this.$c.domain)
  },
  onReachBottom () {
    this.page++;
    this.getMyTopic();
  },
  methods: {
    getMyTopic () {
      this.loadStatus = "loading";
      console.log(uni.getStorageSync('user'))
      this.$H.get("/yj-grouping/circle/pages/" + this.page + "/" + this.limit + "/" + uni.getStorageSync('user').id).then(res => {
        console.log(res)
        this.topicList = this.topicList.concat(res.data);
        if (res.total <= this.limit * this.page) {
          this.loadStatus = "nomore";
        } else {
          this.loadStatus = "loadmore"
        }
      })
    },
    jump () {
      uni.navigateTo({
        url: '/pages/topic-add/topic-add'
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
