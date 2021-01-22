<template>
  <view>
    <view class="search-wrap">
      <u-search placeholder="搜索圈子"
                v-model="keyword"
                @search="search"
                :show-action="false"></u-search>
    </view>
    <view class="container">
      <!-- 圈子分类 -->
      <view class="class-wrap">
        <navigator :url="'/pages/topic-cate-list/topic-cate-list?class_id='+topicClassTop[0].id"
                   class="first-calss">
          <image class="img-wh100"
                 mode="aspectFill"
                 :src="topicClassTop[0].coverImage"></image>
          <text>{{topicClassTop[0].categoryName}}</text>
        </navigator>
        <view class="class-right">
          <navigator :url="'/pages/topic-cate-list/topic-cate-list?class_id='+item.id"
                     class="class-item"
                     v-if="item.isTop"
                     v-for="(item,index) in topicClassTop"
                     :key="index">
            <image class="img-wh100"
                   mode="aspectFill"
                   :src="item.coverImage"></image>
            <text>{{item.categoryName}}</text>
          </navigator>
          <navigator url="/pages/topic-cate-list/topic-cate-list"
                     class="class-item">
            <image class="img-wh100"
                   mode="aspectFill"
                   src="https://oss.ymeoo.cn/20201128160653507763323.jpg"></image>
            <text>所有分类</text>
          </navigator>
        </view>
      </view>
      <!-- 圈子列表 -->
      <view style="margin-bottom: 20rpx;">
        <u-tabs :list="tabList"
                bg-color="#f5f5f5"
                active-color="#616161"
                inactive-color="#999"
                :current="current"
                @change="tabChange"></u-tabs>
      </view>

      <!-- 推荐 -->
      <view v-show="current == 0"
            style="border-radius: 10rpx;overflow: hidden;">
        <list :list="topicList"
              :loadStatus="loadStatus"></list>
      </view>

      <!-- 热议圈子 -->
      <view class="f-wrap"
            v-show="current == 1">
        <discuss-list :list="disList"
                      :loadStatus="loadStatus"></discuss-list>
      </view>
    </view>
  </view>
</template>

<script>
import list from '../../components/topic-list/topic-list.vue';
import disList from '../../components/discuss-list/discuss-list.vue';
export default {
  components: {
    list
  },
  data () {
    return {
      keyword: "",
      myTopic: [],
      current: 0,
      tabList: [{
        name: "推荐"
      },
      {
        name: "热议圈子"
      }
      ],
      topicList: [],
      page: 1,
      loadStatus: "loadmore",
      topicClassTop: [],
      disList: [],
      limit: 10
    };
  },
  onLoad () {
    this.getTopicList();
    this.getTopClassList();
    this.getDisList();
  },
  onPullDownRefresh () {
    this.page = 1;
    this.topicList = [];
    this.topicClassTop = [];
    this.disList = [];
    this.getTopicList();
    this.getTopClassList();
    this.getDisList();
  },
  onReachBottom () {
    this.page++;
    this.getTopicList();
  },
  methods: {
    search () {
      uni.navigateTo({
        url: "/pages/topic-list/topic-list?keyword=" + this.keyword
      })
    },
    // 热议话题列表
    getDisList () {
      this.loadStatus = "loading";
      this.$H.get('/yj-grouping/topic/pages/' + this.page + "/" + this.limit)
        .then(res => {
          console.log(res)
          this.disList = this.disList.concat(res.data);
          if (res.total <= this.limit * this.page) {
            this.loadStatus = "nomore";
          } else {
            this.loadStatus = "loadmore"
          }

          uni.stopPullDownRefresh();
        })
    },
    //获取推荐圈子分类
    getTopClassList () {
      this.$H.get("/yj-grouping/category").then(res => {
        console.log(res)
        this.topicClassTop = res.data;
      })
    },
    tabChange (index) {
      this.current = index;
    },
    getTopicList () {
      this.loadStatus = "loading";
      this.$H.get('/yj-grouping/circle/pages/' + this.page + "/" + this.limit)
        .then(res => {
          console.log(res)
          this.topicList = this.topicList.concat(res.data);
          if (res.total <= this.limit + this.page) {
            this.loadStatus = "nomore";
          } else {
            this.loadStatus = "loadmore"
          }

          uni.stopPullDownRefresh();
        })
    },
  }
}
</script>

<style lang="scss">
@import "more.css";
</style>
