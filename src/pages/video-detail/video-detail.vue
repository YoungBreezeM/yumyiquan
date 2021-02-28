<template>
  <view>
    <view class="page"
          :style="{ height: height }">
      <swiper class="swiper"
              :vertical="true"
              @animationfinish="animationfinish"
              :current="current">
        <swiper-item v-for="(item, idx) in videoList"
                     :key="idx"
                     class="swiper-item">
          <video class="video_"
                 :id="'video'+idx"
                 :enable-danmu="true"
                 show-play-btn="false"
                 :danmu-list="danmuList"
                 :autoplay="current==idx?true:false"
                 :enable-play-gesture="true"
                 :controls="false"
                 :show-fullscreen-btn="false"
                 :loop="true"
                 :show-center-play-btn="false"
                 :enable-progress-gesture="true"
                 object-fit="cover"
                 @timeupdate="onProgress"
                 :src="item.media[0]"></video>
          <view class="home-btn"
                @click="toBack">
            <u-icon name="arrow-left"
                    color="#ccc"
                    size="38"></u-icon>
          </view>
          <view class="play-control"
                @click="playVideo(idx)">
            <view class="play-btn"
                  v-if="!playStatus">
              <u-icon color="#fff"
                      size="40"
                      name="play-right-fill"></u-icon>
            </view>
          </view>
          <view class="view-left">
            <view class="left-view">
              <text class="left-text">#{{item.content}}#</text>
            </view>
            <view class="left-view">
              <text class="left-text">{{item.createTime}}</text>
            </view>
          </view>
          <view class="view-right">
            <view class="right-item">
              <u-avatar :src="item.user.avatarUrl"
                        show-sex="true"
                        @click="toUserDetail(item)"
                        :sex-icon="item.user.gender==0?'man':'woman'"></u-avatar>
            </view>
            <view class="right-item"
                  @click="toComment(item)">
              <u-icon name="chat"
                      size="52"></u-icon>
              <text>{{item.comments?item.comments.length:0}}</text>
            </view>
            <view class="right-item">
              <u-icon name="share"
                      size="52"></u-icon>
            </view>
          </view>
          <view class="bottom-show"
                :style="{width:processWidth}">
          </view>
        </swiper-item>
      </swiper>
      <u-toast ref="uToast" />

    </view>
    <u-popup v-model="show"
             mode="bottom"
             class="comments"
             :closeable="true"
             border-radius="14"
             height="1000">
      <view class="comment-box">
        <view class="title">评论（{{comments?comments.length:0}}）</view>
        <block v-if="comments&&comments.length> 0">
          <view class="comment-item"
                v-for="(item, index) in comments"
                :key="index">
            <image class="avatar"
                   :src="item.user.avatarUrl"
                   @click="toUserDetail(item)"></image>
            <view class="c-content">
              <text>{{item.user.nickName}}</text>
              <text class="c-txt">{{item.content}}</text>
            </view>
            <text class="time">{{$f.timeago(item.createTime)}}</text>
          </view>
        </block>
        <block v-else>
          <u-empty text="暂无评论"
                   mode="message"></u-empty>
        </block>
      </view>
      <view style="height: 100rpx;"></view>
      <!-- 评论输入框 -->
      <view class="comment-tool">
        <textarea placeholder="评论..."
                  fixed="true"
                  cursor-spacing="10"
                  v-model="cTxt"
                  auto-height="true"
                  placeholder-class="txt-placeholder"></textarea>
        <u-button type="error"
                  @click="addComment"
                  :disabled="isSubmitD"
                  style="border-radius: 0;">发布</u-button>
      </view>
    </u-popup>

  </view>
</template>
<script>
import UIcon from '../../uview-ui/components/u-icon/u-icon.vue';
import UNavbar from '../../uview-ui/components/u-navbar/u-navbar.vue';
import uToast from '../../uview-ui/components/u-toast/u-toast.vue';
import { getArticleByCid } from '../../api/article.js';
import UPopup from '../../uview-ui/components/u-popup/u-popup.vue';
export default {
  components: { uToast, UNavbar, UIcon, UPopup },
  data () {
    return {
      videoList: [
      ],
      customStyle: {
        background: "rgba(238, 232, 232, 0.575)"
      },
      show: false,
      page: 1,
      limit: 3,
      playList: [],
      total: 0,
      oldCurrent: 0,
      playStatus: true,
      isReachBottom: 0,
      current: 0,
      height: '667px',
      item: {},
      articleId: "",
      cTxt: "",
      isSubmitD: false,
      danmuList: [],
      user: uni.getStorageSync("user"),
      processWidth: '0%',
      comments: [],
    };
  },
  onLoad (options) {
    this.height = `${uni.getSystemInfoSync().windowHeight}px`;
    this.articleId = options.id;
    this.oldCurrent = this.current;
    this.getMoreVideo();
  },
  methods: {
    toBack () {
      uni.switchTab({
        url: "/pages/index/index"
      })
    },
    toComment (item) {
      this.show = true;
      this.comments = item.comments;
      console.log(this.comments)
    },
    addComment () {
      this.isSubmitD = true;
      if (this.cTxt == "") {
        this.$u.toast('评论不能为空');
        this.isSubmitD = false;
        return;
      }
      let cTxt = this.$f.utf16toEntities(this.cTxt)
      this.$H.post('/yj-grouping/comment', {
        content: cTxt,
        userId: uni.getStorageSync("user").id,
        articleId: this.articleId
      }).then(res => {
        console.log(res)
        if (res.code == "00000") {
          this.cTxt = "";
          this.$u.toast('评论成功');
          this.getPostDetail();
        }
        this.isSubmitD = false;
      });

    },
    getPostDetail () {

      this.$H.get('/yj-grouping/article/' + this.articleId)
        .then(res => {
          console.log(res)
          res.data.content = this.$f.entitiesToUtf16(res.data.content);
          let danmuList = [];
          res.data.comments.forEach((item, index) => {
            item.content = this.$f.entitiesToUtf16(item.content);
            let obj = {
              text: item.content,
              color: '#fff',
              time: index + 2
            }
            danmuList.push(obj);
          })
          this.comments = res.data.comments;
          this.danmuList = danmuList;

        });
    },
    getMoreVideo () {
      getArticleByCid({
        articleId: this.articleId,
        page: this.page,
        limit: this.limit,
        type: 2
      }).then(res => {
        if (res.code === "00000") {
          res.data.forEach(item => {
            item.media = JSON.parse(item.media)
            item.content = this.$f.entitiesToUtf16(item.content);
            this.videoList.push(item)
          })
          this.total = res.total || 0;
        }
        console.log(res)
      })
    },
    animationfinish (e) {
      let current = e.detail.current;
      let oldVideo = uni.createVideoContext("video" + this.oldCurrent);
      let newVideo = uni.createVideoContext("video" + current);
      this.processWidth = "0%"
      console.log(current, this.oldCurrent)
      if (current == this.oldCurrent) {

        if (this.videoList.length < this.total) {
          this.getMoreVideo();
          this.page++;
        } else {
          this.$refs.uToast.show({
            title: '视频已经到底了...',
            type: 'error',
          })
        }
      } else {
        this.playStatus = true;
        oldVideo.stop();
        newVideo.play();

        this.oldCurrent = current
      }


    },
    toUserDetail (item) {
      uni.navigateTo({
        url: "/pages/ucenter/ucenter?uid=" + item.user.id
      })
    },
    playVideo (index) {
      console.log(index)
      let video = uni.createVideoContext("video" + index);
      video.pause();
      if (this.playStatus) {
        video.pause()
      } else {
        video.play()
      }
      this.playStatus = !this.playStatus;

    },
    onProgress (e) {
      this.processWidth = (e.detail.currentTime / e.detail.duration) * 100 + "%"

    }
  },

  onShareAppMessage (res) {
    if (res.from === 'button') { // 来自页面内分享按钮
      console.log(res.target)
    }
    let imgURL;
    if (this.item.media.length > 0) {
      imgURL = this.item.media[0];
    }
    return {
      title: this.item.content,
      path: '/pages/video-detail/video-detail?id=' + this.articleId
    }
  },
  onShareTimeline () {
    let imgURL = imgURL = this.item.media[0];;
    return {
      title: this.item.content,
      query: 'id=' + this.articleId
    }
  },

}
</script>

<style lang="scss" scoped>
.video_ {
  width: 100%;
  height: 100vh;
  display: block;
}
.play-btn {
  width: 100rpx;
  height: 100rpx;
  text-align: center;
  line-height: 100rpx;
  position: absolute;
  border-radius: 50rpx;
  background: #ebe7e7a6;
  top: 10%;
  left: 45%;
}
/* 评论tool */
.comment-tool {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: rgba(238, 232, 232, 0.575);
  padding: 20rpx;
  display: flex;
  z-index: 999;
}

.comment-tool textarea {
  padding: 20rpx;
  border-radius: 10rpx;
  min-height: 40rpx;
}

.comment-tool .u-btn {
  margin-left: 10rpx;
}

.swiper {
  flex: 1;
  background-color: #000;
}
.swiper-item {
  flex: 1;
}
.video {
  flex: 1;
}
.bottom-show {
  position: absolute;
  bottom: 40rpx;
  height: 2rpx;
  background: #a5a2a2;
}
.video-box {
  flex: 1;
  width: 750rpx;
}
.play-control {
  width: 100%;
  height: 500rpx;
  position: absolute;
  top: 45%;
}
.home-btn {
  position: absolute;
  width: 50rpx;
  height: 50rpx;
  border-radius: 50rpx;
  top: 120rpx;
  left: 25rpx;
  background: #f3eceaa9;
  text-align: center;
  line-height: 50rpx;
}
.view-center {
  position: absolute;
  justify-content: center;
  align-items: center;
  opacity: 0.1;
  z-index: 999;
}

.view-left {
  position: absolute;
  margin-left: 20upx;
  width: 500upx;
  bottom: 120upx;
  z-index: 9999;
  font-size: 16px;
  color: #ffffff;
  white-space: pre-wrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.left-view {
  margin-bottom: 20upx;
}
.left-text {
  font-size: 16px;
  color: #ffffff;
}

.view-right {
  position: absolute;
  bottom: 500upx;
  right: 20upx;
  display: flex;
  flex-direction: column;
  z-index: 9999;
}

.right-item {
  margin: auto;
  margin-top: 50rpx;
  height: 120rpx;
  width: 120rpx;
  text-align: center;
  color: #ffffff;
}

.page {
  /* #ifndef APP-PLUS-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  flex: 1;
}
.comments {
  position: fixed;
  bottom: 10px;
  background: rebeccapurple;
}

/*评论列表*/
.divider {
  margin: 40rpx;
}

.comment-item {
  display: flex;
  margin-bottom: 40rpx;
}

.comment-item .c-content {
  display: flex;
  flex-direction: column;
}

.comment-item .c-content .c-txt {
  font-size: 12px;
  color: #616161;
}

.comment-item .time {
  margin-left: auto;
  color: #999;
  font-size: 10px;
}

.comment-item .avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  border: 1px solid #dd524d;
  margin-right: 20rpx;
}

/*底部操作*/
.p-footer {
  margin-top: 20rpx;
  display: flex;
}

.p-footer .topic-name {
  font-size: 20rpx;
  color: #8687fd;
  background-color: #e6e6ff;
  border-radius: 10rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10rpx 20rpx;
}

.p-footer .btn {
  border: 1px solid #f5f5f5;
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
}

.p-footer .btn text {
  margin: 0 5rpx;
}

.m-left-auto {
  margin-left: auto;
}
.m-right-20 {
  margin-right: 20rpx;
}
/*评论*/
.comment-box {
  padding: 20rpx;
  background-color: #ffffff;
  margin-top: 20rpx;
}

.comment-box > .title {
  margin-bottom: 20rpx;
}

/*文章图片*/
.img-style-1 {
  display: block;
  width: 100%;
  max-height: 600rpx;
  border-radius: 5px;
}

.img-style-2 {
  display: flex;
}

.img-style-2 image {
  margin: 5rpx;
  border-radius: 5px;
  width: 100%;
  height: 294rpx;
}

.img-style-3 {
  display: flex;
  flex-wrap: wrap;
}

.img-style-3 image {
  width: 31.3%;
  height: 200rpx;
  margin: 1%;
  border-radius: 5px;
}

/* 评论tool */
.comment-tool {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  padding: 20rpx;
  display: flex;
  z-index: 999;
}

.comment-tool textarea {
  background-color: #f5f5f5;
  padding: 20rpx;
  border-radius: 10rpx;
  min-height: 40rpx;
}

.comment-tool .u-btn {
  margin-left: 10rpx;
}
</style>
