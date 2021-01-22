<template>
  <view>
    <video class="video_"
           :enable-danmu="true"
           :danmu-btn="true"
           :danmu-list="danmuList"
           :autoplay="true"
           :enable-play-gesture="true"
           :controls="false"
           :show-fullscreen-btn="false"
           :loop="true"
           :src="postDetail.media[0]"></video>
    <!-- 评论输入框 -->
    <view class="comment-tool">
      <textarea placeholder="吐个槽..."
                fixed="true"
                cursor-spacing="10"
                v-model="cTxt"
                auto-height="true"
                style="color:#fff"
                placeholder-style="color:#fff"></textarea>
      <u-button @click="addComment"
                :disabled="isSubmitD"
                style="border-radius: 0;">发送</u-button>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      postDetail: {},
      postId: "",
      cTxt: "",
      isSubmitD: false,
      danmuList: [],
      user: uni.getStorageSync("user")
    };
  },
  onLoad (options) {
    this.postId = options.id;
    this.getPostDetail();
  },
  methods: {
    addComment () {
      this.isSubmitD = true;
      if (this.cTxt == "") {
        this.$u.toast('评论不能为空');
        this.isSubmitD = false;
        return;
      }
      let cTxt = this.utf16toEntities(this.cTxt)
      this.$H.post('/yj-grouping/comment', {
        content: cTxt,
        userId: uni.getStorageSync("user").id,
        articleId: this.postId
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
    //把utf16的emoji表情字符进行转码成八进制的字符
    utf16toEntities (str) {
      var patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则  
      return str.replace(patt, function (char) {
        var H, L, code;
        if (char.length === 2) {
          H = char.charCodeAt(0); // 取出高位  
          L = char.charCodeAt(1); // 取出低位  
          code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法  
          return "&#" + code + ";";
        } else {
          return char;
        }
      });
    },
    //将编码后的八进制的emoji表情重新解码成十六进制的表情字符
    entitiesToUtf16 (str) {
      return str.replace(/&#(\d+);/g, function (match, dec) {
        let H = Math.floor((dec - 0x10000) / 0x400) + 0xD800;
        let L = Math.floor(dec - 0x10000) % 0x400 + 0xDC00;
        return String.fromCharCode(H, L);
      });
    },
    getPostDetail () {
      this.$H.get('/yj-grouping/article/' + this.postId + "?fromId=" + this.user.id)
        .then(res => {
          console.log(res)
          res.data.content = this.entitiesToUtf16(res.data.content);
          let danmuList = [];
          res.data.comments.forEach((item, index) => {
            item.content = this.entitiesToUtf16(item.content);
            let obj = {
              text: item.content,
              color: '#fff',
              time: index + 2
            }
            danmuList.push(obj);
          })
          res.data.media = JSON.parse(res.data.media);
          this.postDetail = res.data;
          this.danmuList = danmuList;
        });
    },
  },
  onShareAppMessage (res) {
    if (res.from === 'button') { // 来自页面内分享按钮
      console.log(res.target)
    }
    let imgURL;
    if (this.postDetail.media.length > 0) {
      imgURL = this.postDetail.media[0];
    }
    return {
      title: this.postDetail.content,
      path: '/pages/video-detail/video-detail?id=' + this.postId
    }
  },
  onShareTimeline () {
    let imgURL = imgURL = this.postDetail.media[0];;
    return {
      title: this.postDetail.content,
      query: 'id=' + this.postId
    }
  }
}
</script>

<style lang="scss" scoped>
.video_ {
  width: 100%;
  height: 100vh;
  display: block;
}

/* 评论tool */
.comment-tool {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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
</style>
