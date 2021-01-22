<template>
  <view>
    <view class="discussInfo">
      <view class="user">
        <u-avatar class="avatar"
                  :src="user.avatarUrl"></u-avatar>
        <view class="user-c">
          <text>{{user.nickName}}</text>
          <text>发起</text>
        </view>
      </view>
      <view class="count">
        <text>{{total}} 篇内容</text>
        <text>{{topic.glance||0}} 次浏览</text>
      </view>
      <view class="discuss-desc">{{topic.topicName}}</view>
    </view>
    <post-list :list="postList"
               :loadStatus="loadStatus"></post-list>
    <!-- 发布按钮 -->
    <uni-fab :content="fabList"
             direction="vertical"
             horizontal="right"
             @trigger="onTrigger"></uni-fab>
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
      disId: 0,
      loadStatus: "loading",
      postList: [],
      user: {

      },
      page: 1,
      limit: 3,
      total: 0,
      topic: null,
      fabList: [{
        iconPath: "/static/images/img-icon.png",
        selectedIconPath: "/static/images/img-icon.png",
        text: "图文",
        url: "/pages/plus-post/plus-post?type=1"
      },
      {
        iconPath: "/static/images/video-icon.png",
        selectedIconPath: "/static/images/video-icon.png",
        text: "视频",
        url: "/pages/plus-post/plus-post?type=2"
      }
      ]
    };
  },
  onLoad (options) {
    this.disId = options.id;
    // this.getDiscussInfo();
    this.getPostList();

    //#ifdef MP-WEIXIN
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    //#endif
  },
  onShareAppMessage (res) {
    if (res.from === 'button') { // 来自页面内分享按钮
      console.log(res.target)
    }
    return {
      title: this.discussInfo.introduce,
      path: '/pages/discuss/discuss?id=' + this.disId,
    }
  },
  onShareTimeline () {
    let imgURL = "";
    return {
      title: this.discussInfo.introduce,
      imageUrl: imgURL,
      query: 'id=' + this.disId
    }
  },
  methods: {
    onTrigger (e) {
      console.log(this.topic)
      uni.navigateTo({
        url: e.item.url + "&topic_id=" + this.topic.circleId + "&discuss_id=" + this.topic.id
      })
    },
    // getDiscussInfo () {
    //   this.$H.get('/yj-grouping/byTid/', {
    //     id: this.disId
    //   }).then(res => {
    //     this.discussInfo = res.result;
    //   })
    // },
    getPostList () {
      this.loadStatus = "loading";
      this.$H.get('/yj-grouping/article/byTid/' + this.page + "/" + this.limit + "/" + this.disId)
        .then(res => {
          console.log(res)
          res.data.list.forEach(item => {
            item.media = JSON.parse(item.media)
          });
          this.postList = this.postList.concat(res.data.list);
          this.user = res.data.user;
          this.total = res.data.total;
          this.topic = res.data.topic;
          if (this.total <= this.page * this.limit) {
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
@import "discuss.css";
</style>
