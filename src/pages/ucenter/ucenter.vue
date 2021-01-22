<template>
  <view>
    <view class="nav"
          @click="back()"
          :style="{top:navHeight,left:'25rpx'}">返回</view>
    <image class="head-bg"
           src="https://oss.ymeoo.cn/20201128160653247734811.jpg"></image>
    <view class="con-c">
      <view class="user-info">
        <image class="avatar"
               :src="userInfo.avatarUrl"></image>
        <view class="user-c">
          <view class="username">{{userInfo.nickName}}</view>
          <view class="num-box">
            <text>{{userInfo.attentions}} <text class="txt">关注</text></text>
            <text>{{userInfo.fans}} <text class="txt">粉丝</text></text>
            <text>Lv.1</text>
          </view>
          <text class="desc">{{userInfo.intro}}</text>
          <view class="btn-box"
                v-if="uid!=user.id">
            <u-button v-show="!isAttention"
                      @click="follow"
                      class="btn"
                      shape="circle"
                      type="error"
                      size="mini">
              <u-icon name="plus"></u-icon>
              <text>关注</text>
            </u-button>
            <u-button v-show="isAttention"
                      @click="cancelFollow"
                      class="btn"
                      shape="circle"
                      size="mini">
              <text>已关注</text>
            </u-button>
            <u-button shape="circle"
                      size="mini"
                      @click="toChat">
              <text style="margin: 0 15rpx;">私信</text>

            </u-button>
          </view>
        </view>
      </view>
      <!-- tab -->
      <view class="tab-box">
        <u-tabs bg-color="#f5f5f5"
                inactive-color="#999"
                name="tab_name"
                :list="tabs"
                active-color="#616161"
                :is-scroll="false"
                c
                :current="current"
                @change="tabChange"></u-tabs>
      </view>
      <!-- 主页 -->
      <view v-show="current === 0">
        <!-- 基本信息 -->
        <view class="f-wrap">
          <view class="title">基本信息</view>
          <view class="info-c">
            <text>性别：{{userInfo.gender==0?'男':'女'}}</text>
            <text>地区：{{userInfo.province}} {{userInfo.city}}</text>
            <text>个人简介：{{userInfo.intro}}</text>
          </view>
        </view>
        <!-- 创建的圈子 -->
        <view v-if="userInfo.create_topic_list.length > 0"
              class="f-wrap">
          <view class="title">创建的圈子</view>
          <topic-list :list="userInfo.create_topic_list"
                      loadStatus="none"></topic-list>
        </view>
        <!-- 个人标签 -->
        <view class="f-wrap">
          <view class="title">标签</view>
          <view class="tag-box">
            <view v-for="(item,index) in userInfo.tag_str"
                  :key="index"
                  class="tag">{{item}}</view>
          </view>
        </view>
      </view>
      <!-- 帖子 -->
      <view v-show="current === 1">
        <post-list :list="postList"
                   :loadStatus="loadStatus"></post-list>
      </view>
      <!-- 加入的圈子 -->
      <view v-show="current === 2">
        <topic-list :list="topicList"></topic-list>
      </view>
    </view>
  </view>
</template>

<script>
import postList from '../../components/post-list/post-list.vue';
import topicList from '../../components/topic-list/topic-list.vue';
import UButton from '../../uview-ui/components/u-button/u-button.vue';


export default {
  components: {
    postList,
    topicList,
    UButton

  },
  data () {
    return {
      tabs: [{
        tab_name: '主页'
      }, {
        tab_name: '帖子'
      },
      {
        tab_name: '加入圈子'
      }
      ],
      isAttention: false,
      current: 0,
      uid: 0,
      postList: [],
      topicList: [],
      userInfo: {},
      loadStatus: "loading",
      page: 1,
      limit: 2,
      navHeight: null,
      user: uni.getStorageSync("user")
    };
  },
  onLoad (options) {
    uni.getSystemInfo({
      success: (res) => {
        this.navHeight = res.statusBarHeight + "px";
      }
    })
    this.uid = options.uid;
    this.getUserInfo();
    this.getPostList();

  },
  onReachBottom () {
    console.log(this.loadStatus)
    if (this.loadStatus != "nomore" && this.current == 1) {
      this.page++;
      this.getPostList();
    }

  },
  methods: {
    back () {
      uni.navigateBack()
    },
    toChat () {
      uni.navigateTo({
        url: "/pages/chat/chat?user=" + JSON.stringify(this.userInfo)
      })

    },
    getIsAttention () {
      this.$H.post('/yj-grouping/attention/byFromId/byToId', {
        fromId: uni.getStorageSync("user").id,
        toId: this.userInfo.id
      }).then(res => {
        console.log(res)
        if (res.code == "00000") {
          this.isAttention = res.data;
        }

      })
    },
    follow () {
      this.$H.post('/yj-grouping/attention', {
        fromId: uni.getStorageSync("user").id,
        toId: this.userInfo.id
      }).then(res => {
        if (res.code === "00000") {
          this.isAttention = true;
        } else {
          this.$refs.uToast.show({
            title: res.msg,
            type: 'error'
          })
        }
      })

    },
    cancelFollow () {
      this.$H.post('/yj-grouping/attention', {
        fromId: uni.getStorageSync("user").id,
        toId: this.userInfo.id
      }).then(res => {
        if (res.code === "00000") {
          this.isAttention = false;
        } else {
          this.$refs.uToast.show({
            title: res.msg,
            type: 'error'
          })
        }
      })
    },
    tabChange (index) {
      this.current = index;
      if (index == 1) {
        this.getPostList();
      }
      if (index === 2) {
        this.getTopicList();
      }

    },
    getPostList () {
      this.loadStatus = "loading";
      this.$H.get('/yj-grouping/article/byUid/' + this.page + "/" + this.limit + "/" + this.userInfo.id)
        .then(res => {
          console.log(res)
          res.data.list.forEach(item => {
            item.media = JSON.parse(item.media)
          })
          this.postList = this.postList.concat(res.data.list);
          if (res.data.total <= this.page * this.limit) {
            this.loadStatus = "nomore";
          } else {
            this.loadStatus = "loadmore"
          }
        })
    },
    getTopicList () {
      this.$H.get('/yj-grouping/user-circle/byUid/' + this.userInfo.id).
        then(res => {
          console.log(res)
          this.topicList = res.data;
        })
    },
    getUserInfo () {
      this.$H.get("/yj-grouping/user/" + this.uid).then(res => {
        console.log(res)
        this.userInfo = res.data;
        uni.setNavigationBarTitle({
          title: this.userInfo.nickName
        });
        this.getIsAttention();
      })

    }
  }
}
</script>
<style>
page {
  background-color: #f5f5f5;
}
.nav {
  position: fixed;
  color: #f5f5f5;
}
</style>
<style scoped>
@import "ucenter.css";
</style>
