<template>
  <view class="wrap">
    <u-waterfall v-model="list"
                 ref="uWaterfall">
      <template v-slot:left="{leftList}">
        <view @click="jump(item)"
              class="demo-warter"
              v-for="(item, index) in leftList"
              :key="index">
          <block v-if="item.type == 1">
            <u-lazy-load threshold="-450"
                         border-radius="10 10 0 0"
                         :image="item.media[0]"
                         :index="index"></u-lazy-load>
          </block>
          <block v-else>
            <video class="post-video"
                   :controls="false"
                   :show-center-play-btn="false"
                   :src="item.media[0]"></video>
            <view class="video-tag">
              <u-icon color="#fff"
                      size="40"
                      name="play-right-fill"></u-icon>
            </view>
          </block>
          <view class="footer-wrap">
            <view class="p-title">{{item.content}}</view>
            <view class="p-user">
              <u-avatar size="35"
                        :src="item.user.avatarUrl"></u-avatar>
              <text class="username">{{item.user.nickName}}</text>
              <view class="distance">
                <view v-if="item.distance">
                  <u-icon name="map"></u-icon>
                  <text>{{item.distance}}km</text>
                </view>
                <view v-if="item.commentCount>=0">
                  <u-icon name="chat"></u-icon>
                  <text>{{item.commentCount}}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>
      <template v-slot:right="{rightList}">
        <view @click="jump(item)"
              class="demo-warter"
              v-for="(item, index) in rightList"
              :key="index">
          <block v-if="item.type == 1">
            <u-lazy-load threshold="-450"
                         border-radius="10 10 0 0"
                         :image="item.media[0]"
                         :index="index"></u-lazy-load>
          </block>
          <block v-else>
            <video class="post-video"
                   :controls="false"
                   :show-center-play-btn="false"
                   :src="item.media[0]"></video>
            <view class="video-tag">
              <u-icon color="#fff"
                      size="40"
                      name="play-right-fill"></u-icon>
            </view>
          </block>
          <view class="footer-wrap">
            <view class="p-title">{{item.content}}</view>
            <view class="p-user">
              <u-avatar size="35"
                        :src="item.user.avatarUrl"></u-avatar>
              <text class="username">{{item.user.nickName}}</text>
              <view class="distance">
                <view v-if="item.distance">
                  <u-icon name="map"></u-icon>
                  <text>{{item.distance}}km</text>
                </view>
                <view v-if="item.commentCount>=0">
                  <u-icon name="chat"></u-icon>
                  <text>{{item.commentCount}}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>
    </u-waterfall>
    <u-loadmore v-if="loadStatus != 'none'"
                bg-color="rgb(240, 240, 240)"
                :status="loadStatus"
                @loadmore="addRandomData"></u-loadmore>
  </view>
</template>

<script>
export default {
  props: {
    list: Array,
    loadStatus: {
      type: String,
      default: 'loadmore'
    }
  },
  methods: {
    jump (item) {
      console.log(item)
      if (item.type == 1) {
        uni.navigateTo({
          url: "/pages/post-detail/post-detail?id=" + item.id
        })
      }
      if (item.type == 2) {
        uni.navigateTo({
          url: "/pages/video-detail/video-detail?id=" + item.id
        })
      }
    },
    clear () {
      this.$refs.uWaterfall.clear();
    }
  }
}
</script>
<style>
/* page不能写带scope的style标签中，否则无效 */
page {
  background-color: rgb(240, 240, 240);
}
</style>

<style scoped>
.demo-warter {
  border-radius: 8px;
  margin: 5px;
  background-color: #ffffff;
  position: relative;
  overflow: hidden;
}

.demo-title {
  font-size: 30rpx;
  margin-top: 5px;
  color: $u-main-color;
}

.footer-wrap {
  padding: 20rpx;
  color: #616161;
}

.footer-wrap .p-title {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.footer-wrap .p-user {
  display: flex;
  align-items: center;
  line-height: 20rpx;
  font-size: 22rpx;
  margin-top: 20rpx;
}

.footer-wrap .p-user .username {
  font-size: 20rpx;
  margin-left: 10rpx;
}

.footer-wrap .p-user .distance {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.post-video {
  width: 100%;
}

.video-tag {
  position: absolute;
  left: 35%;
  top: 30%;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 20rpx;
  border-radius: 50%;
  width: 100rpx;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
