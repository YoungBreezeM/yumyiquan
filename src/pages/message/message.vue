<template>
  <view>
    <u-grid :col="3"
            :border="false"
            @click="toNav">
      <u-grid-item index="1">
        <u-badge :count="msgNum.favoritesAndThumb"
                 :offset="[10, 50]"></u-badge>
        <image class="nav-icon"
               src="/static/images/icon/souc.png"></image>
        <view class="grid-text">赞和收藏</view>
      </u-grid-item>
      <u-grid-item index="2">
        <u-badge :count="msgNum.follow"
                 :offset="[10, 50]"></u-badge>
        <image class="nav-icon"
               src="/static/images/icon/gz.png"></image>
        <view class="grid-text">新增关注</view>
      </u-grid-item>
      <u-grid-item index="3">
        <u-badge :count="msgNum.comment"
                 :offset="[10, 50]"></u-badge>
        <image class="nav-icon"
               src="/static/images/icon/pl.png"></image>
        <view class="grid-text">评论</view>
      </u-grid-item>
    </u-grid>
    <view class="msg-wrap">
      <view class="title">
        <view class="left">私信</view>
      </view>
      <block v-if="msgNum.bulletins&&msgNum.bulletins.length > 0">
        <navigator @longpress="onPressArticle(item.m_id,index)"
                   :url="'/pages/article-detail/article-detail?id='+item.id+'&time='+item.createTime"
                   class="msg-item"
                   v-for="(item,index) in msgNum.bulletins"
                   :key="index">
          <u-avatar class="avatar"
                    :src="avatar"></u-avatar>
          <view class="right">
            <view>
              <text style="margin-right: 10rpx;">易圈小助手</text>
              <u-tag text="官方"
                     type="primary"
                     size="mini"
                     mode="dark" />
            </view>
            <view class="desc">
              <text>{{item.title}}</text>
              <text class="time">{{$f.timeago(item.createTime)}}</text>
            </view>
          </view>
        </navigator>
      </block>
      <block v-if="msgNum.messages&&msgNum.messages.length > 0">
        <navigator @longpress="onPressChat(item.user.id,index)"
                   :url="'/pages/chat/chat?user='+ JSON.stringify(item.user)"
                   class="msg-item"
                   v-for="(item,index) in msgNum.messages"
                   :key="index">
          <u-avatar class="avatar"
                    :src="item.user.avatarUrl"></u-avatar>
          <view class="right">
            <view>
              <text style="margin-right: 10rpx;">
                {{item.user.nickName}}
              </text>
              <u-tag v-if="!item.isRead"
                     text="未读"
                     type="error"
                     size="mini"
                     mode="dark" />
            </view>
            <view class="desc">
              <text>{{item.content}}</text>
              <text class="time">{{$f.timeago(item.createTime)}}</text>
            </view>
          </view>
        </navigator>
      </block>
      <block v-else>
        <view class="msg-empty">
          <image class="img"
                 mode="widthFix"
                 src="/static/empty.png"></image>
          <text class="txt">暂无新消息</text>
        </view>
      </block>
    </view>
    <!-- 删除弹窗 -->
    <u-action-sheet :list="sheetList"
                    v-model="showSheet"
                    @click="onSheetItem"></u-action-sheet>
  </view>
</template>

<script>
export default {
  data () {
    return {
      avatar: "http://127.0.0.1:9000/default/%E5%85%AB%E5%8D%A62.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20210120%2F%2Fs3%2Faws4_request&X-Amz-Date=20210120T070137Z&X-Amz-Expires=432000&X-Amz-SignedHeaders=host&X-Amz-Signature=669bf6971c5146cb3f72ada8eb13a11e7f879d3169943d06268fcf950cb0cd65",
      showSheet: false,
      showChatSheet: false,
      sheetList: [{
        text: '删除',
        color: 'red'
      }],
      msgNum: {
        thumb_collect: 0,
        follow: 0,
        comment: 0,
        article_msg_list: []
      },
      checkedMsgId: "",
      checkedIndex: ""
    };
  },
  onShow () {
    this.getMsgNum();

  },
  methods: {
    onPressArticle (id, index) {
      this.showSheet = true;
      this.checkedMsgId = id;
      this.checkedIndex = index;
    },
    // 长按私信
    onPressChat (uid, index) {
      this.showChatSheet = true;
      this.checkedIndex = index;
      this.checkedMsgUid = uid;
    },
    onSheetItem (index) {
      if (index == 0) {
        this.$H.post("message/delMsg", {
          id: this.checkedMsgId
        }).then(res => {
          if (res.code == 200) {
            this.msgNum.article_msg_list.splice(this.checkedIndex, 1)
          }
        })
      }
    },
    getMsgNum () {
      this.$H.get("/yj-grouping/message/num/" + uni.getStorageSync('user').id).then(res => {

        this.msgNum = res.data;

        let num = res.data;
        let msgIsRead = 0;
        num.messages.forEach(item => {
          if (!item.isRead) {
            msgIsRead++;
          }
        })
        let numCount = num.comment + num.follow + num.favoritesAndThumb + msgIsRead;
        if (numCount > 0) {
          uni.setTabBarBadge({
            index: 2,
            text: numCount.toString()
          })
        } else {
          uni.removeTabBarBadge({
            index: 2
          })
        }
      })
    },
    toNav (e) {
      uni.navigateTo({
        url: "/pages/message-list/message-list?type=" + (e - 1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "message.scss";
</style>
