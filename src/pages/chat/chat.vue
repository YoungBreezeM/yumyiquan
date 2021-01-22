<!--
 * @Author: your name
 * @Date: 2021-01-20 15:35:53
 * @LastEditTime: 2021-01-20 17:33:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /yj-project/src/pages/chat/chat.vue
-->
<template>
  <view>
    <!-- 顶部 -->
    <u-navbar back-text="返回">
      <view class="navbar-center">
        <text>{{user.nickName}}</text>
      </view>
    </u-navbar>
    <!-- 页面主体 -->
    <view class="page-body">
      <block v-for="(item,index) in msgList"
             :key="index">
        <!-- 左边消息 -->
        <view v-if="item.senderId== user.id"
              class="chat-item chat-item-left">
          <u-avatar :src="user.avatarUrl"
                    class="avatar"></u-avatar>
          <view class="conent">{{item.content}}</view>
        </view>
        <!-- 右边消息 -->
        <view v-else
              class="chat-item chat-item-right">
          <u-avatar class="avatar"
                    :src="userInfo.avatarUrl"></u-avatar>
          <view class="conent">{{item.content}}</view>
        </view>
      </block>
      <!-- 发送消息栏 -->
      <view style="height: 130rpx;"></view>
      <view class="msg-fad">
        <input type="text"
               v-model="mTxt"
               placeholder="请输入消息" />
        <u-button @click="sendMessage"
                  type="success">发送</u-button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      mTxt: "",
      msgList: [],
      userInfo: uni.getStorageSync("user"),
      user: {},
      page: 1
    };
  },
  onLoad (options) {
    this.user = JSON.parse(options.user);
    console.log(this.user)
    this.getMessage();
  },
  methods: {
    getMessage () {
      this.$H.get("/yj-grouping/message/chatList/" + this.user.id + "/" + this.userInfo.id)
        .then(res => {
          this.msgList = res.data;

        })
    },
    sendMessage () {
      this.$H.post("/yj-grouping/message", {
        senderId: this.userInfo.id,
        receiverId: this.user.id,
        content: this.mTxt
      }).then(res => {
        if (res.code == "00000") {
          this.getMessage();
          this.mTxt = "";
        }
      })
    },
    // 更新阅读状态
    updateChatStatus () {
      this.$H.post("message/updateChatStatus", {
        uid: this.user.uid
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "chat.scss";
</style>
