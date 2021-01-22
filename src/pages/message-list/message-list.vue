<!--
 * @Author: your name
 * @Date: 2020-12-23 16:07:36
 * @LastEditTime: 2021-01-21 12:02:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /yj-project/src/pages/message-list/message-list.vue
-->
<template>
  <view>
    <view class="read-tips">
      <text @click="readStatus">标记已读</text>
    </view>
    <block v-for="(item,index) in msgList"
           :key="index">
      <view class="comment-msg-item">
        <navigator :url="'/pages/ucenter/ucenter?uid='+ item.user.id"
                   hover-class="none">
          <u-avatar class="avatar"
                    :src="item.user.avatarUrl"></u-avatar>
        </navigator>
        <view class="msg-c">
          <view class="msg-c-t">
            <text class="username">{{item.user.nickName}}</text>
            <text class="time">{{$f.timeago(item.createTime) }}</text>
          </view>
          <view class="msg-c-txt">
            <text>{{item.content}}</text>
            <text v-if="!item.isRead"
                  class="dot"></text>
          </view>
          <navigator v-if="msgType != 1"
                     :url="'/pages/post-detail/post-detail?id='+item.article.id"
                     hover-class="none">
            <view class="post-c">
              <view class="post-c-txt">{{item.article.content}}</view>
            </view>
          </navigator>
        </view>
      </view>
    </block>
  </view>
</template>

<script>
export default {
  data () {
    return {
      msgType: 0,
      msgList: [],
      user: uni.getStorageSync("user")

    };
  },
  onLoad (options) {
    this.msgType = options.type;
    this.getMsgList();
  },
  methods: {
    getMsgList () {
      this.$H.get("/yj-grouping/notify/" + this.user.id + "/" + this.msgType)
        .then(res => {
          this.msgList = res.data;
        })
    },
    readStatus () {
      let that = this;
      this.$H.get("/yj-grouping/notify/status/" + this.user.id + "/" + this.msgType)
        .then(res => {
          if (res.code == "00000") {
            this.msgList.forEach(function (item, index) {
              that.msgList[index].isRead = true;
            });
          }

        })
    }
  }
}
</script>

<style lang="scss">
@import "message-list.css";
</style>
