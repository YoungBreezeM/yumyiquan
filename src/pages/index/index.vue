<template>
  <view>
    <view class="head">
      <view class="tab-box">
        <u-tabs name="tab_name"
                font-size="35"
                bg-color="#fff"
                :list="tabs"
                active-color="#616161"
                :is-scroll="false"
                :current="current"
                @change="tabChange"></u-tabs>
      </view>
    </view>
    <view style="height: 80rpx;"></view>
    <view>
      <view v-show="current === 0">
        <post-list :list="followPost"
                   :loadStatus="loadStatus"></post-list>
      </view>
      <view v-show="current === 1">
        <!-- 推荐内容 -->
        <view class="post-list">
          <post-waterfall ref="postwaterfall"
                          :list="postList"
                          :type="like"
                          :loadStatus="loadStatus"></post-waterfall>
        </view>
      </view>
      <view v-show="current === 2">
        <view v-if="showOpenLocation"
              style="margin:100rpx 30rpx 30rpx 30rpx;">
          <u-button type="success"
                    shape="circle"
                    @click="getLocation">开启定位</u-button>
        </view>
        <view v-else
              class="post-waterfall">
          <post-waterfall ref="waterfall"
                          :list="nearbyPostList"
                          :loadStatus="loadStatus"></post-waterfall>
        </view>
      </view>
    </view>
    <!-- 返回顶部 -->
    <u-back-top :scroll-top="scrollTop"></u-back-top>
  </view>
</template>

<script>
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
import postList from '../../components/post-list/post-list.vue';
import topicList from '../../components/topic-list/topic-list.vue';
import postWaterfall from '../../components/post-waterfall/post-waterfall.vue';
export default {
  components: {
    postList,
    topicList,
    postWaterfall
  },
  data () {
    return {
      tabs: [{
        tab_name: '关注'
      }, {
        tab_name: '推荐'
      },
      {
        tab_name: uni.getStorageSync("district") || '同城'
      }
      ],
      current: 1,
      myTopic: [],
      scrollTop: 0,
      postList: [],
      followPost: [],
      nearbyPostList: [],
      loadStatus: "loadmore",
      storageTopicList: [],
      page1: 1,
      page2: 1,
      page3: 1,
      limit: 10,
      shareCover: "",
      showOpenLocation: false
    }
  },
  onShareAppMessage (res) {
    if (res.from === 'button') { // 来自页面内分享按钮
      console.log(res.target)
    }
    return {
      title: this.$c.miniappName,
      path: '/pages/index/index',
      imageUrl: this.shareCover
    }
  },
  onLoad () {


  },
  onShow () {
    this.$H.get("/yj-grouping/user/me").then(res => {
      if (res.code === "00000") {
        this.getPostList();

        //#ifdef MP-WEIXIN
        wx.showShareMenu({
          withShareTicket: true,
          menus: ['shareAppMessage', 'shareTimeline']
        })
        //#endif

        if (!uni.getStorageSync("location_info")) {
          this.showOpenLocation = true;
        }
      } else {
        uni.navigateTo({
          url: '/pages/login/login'
        })
      }
    })
  },
  onPullDownRefresh () {
    this.page1 = 1;
    this.page2 = 1;
    this.page3 = 1;
    this.postList = [];
    this.nearbyPostList = [];
    this.followPost = [];
    console.log("刷新")
    if (this.current === 0) {
      this.getFollowPost();

    }

    if (this.current === 1) {
      this.$refs.postwaterfall.clear();
      this.getPostList();
    }

    if (this.current === 2) {
      if (!this.showOpenLocation) {
        this.$refs.waterfall.clear();
        this.getNearbyPost();
      }

    }

    uni.stopPullDownRefresh();
  },
  onPageScroll (e) {
    this.scrollTop = e.scrollTop;
  },
  onReachBottom () {
    console.log("触底")
    console.log(this.current)
    if (this.current === 0 && this.loadStatus != "nomore") {
      this.page2++
      this.getFollowPost();

    }

    if (this.current === 1 && this.loadStatus != "nomore") {
      this.page1++
      this.getPostList();
    }

    if (this.current === 2 && this.loadStatus != "nomore") {
      if (!this.showOpenLocation) {
        this.page3++
        this.getNearbyPost();
      }

    }
  },
  watch: {
    showOpenLocation () {
      this.getNearbyPost();
    }
  },
  methods: {
    getNearbyPost () {
      this.loadStatus = "loading";
      if (!this.showOpenLocation) {
        this.$H.get('/yj-grouping/article/pages/' + this.page2 + "/" + this.limit)
          .then(res => {
            console.log(res)
            res.data.forEach(item => {
              item.media = JSON.parse(item.media)
              item.distance = 10;
            })
            this.nearbyPostList = this.nearbyPostList.concat(res.data);
            console.log(this.page1 * this.limit)
            if (res.total <= this.page1 * this.limit) {
              this.loadStatus = "nomore";
            } else {
              this.loadStatus = "loadmore"
            }
          });
      }
    },
    getLocation () {
      let that = this;
      uni.getLocation({
        type: 'wgs84',
        success: function (res) {
          var qqmapsdk = new QQMapWX({
            key: 'BMYBZ-GV464-JESUX-DZL53-Z6LNH-U6BIA' // 必填
          });

          qqmapsdk.reverseGeocoder({
            location: res,
            success: function (res2) {
              that.tabs[2].tab_name = res2.result.ad_info.district;
              uni.setStorageSync("district", res2.result.ad_info.district);
            },
            fail: function (error) {
              // console.error(error);
            },
            complete: function (res) {
              // console.log(res);
            }
          })

          uni.setStorageSync("location_info", res);
          that.showOpenLocation = false;
        }
      });
    },
    getSysInfo () {
      this.$H.get("system/miniConfig").then(res => {
        this.shareCover = res.result.intro;
      })
    },
    tabChange (index) {
      this.page1 = 1;
      this.page2 = 1;
      this.page3 = 1;

      this.current = index;
      if (index === 0) {
        this.followPost = [];
        this.getFollowPost();
      }
      if (index === 1) {
        this.$refs.postwaterfall.clear();
        this.postList = [];
        this.getPostList();
      }

      if (index == 2) {
        if (!this.showOpenLocation) {
          this.$refs.waterfall.clear();
          this.nearbyPostList = [];
          this.getNearbyPost();
        }

      }
    },
    getPostList () {
      this.loadStatus = "loading";
      this.$H.get('/yj-grouping/article/pages/' + this.page1 + "/" + this.limit)
        .then(res => {
          console.log(res)
          res.data.forEach(item => {
            item.media = JSON.parse(item.media)
          })
          this.postList = this.postList.concat(res.data);
          console.log(this.page1 * this.limit)
          if (res.total <= this.page1 * this.limit) {
            this.loadStatus = "nomore";
          } else {
            this.loadStatus = "loadmore"
          }
        });
    },
    getFollowPost () {
      this.loadStatus = "loading";
      this.$H.get('/yj-grouping/article/getAttentionArticle/' + uni.getStorageSync("user").id)
        .then(res => {
          console.log(res)
          res.data.forEach(item => {
            item.media = JSON.parse(item.media)
          })
          this.followPost = this.followPost.concat(res.data);

          this.loadStatus = "nomore";

        });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "index.scss";
</style>
