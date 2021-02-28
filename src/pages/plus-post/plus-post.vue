<template>
  <view class="container">
    <view class="head">
      <!-- 图文 -->
      <block v-if="form.type == 1">
        <u-button class="plus-btn"
                  type="error"
                  :disabled="btnDisabled"
                  :loading="btnLoading"
                  @click="uploadImg">发布</u-button>
      </block>
      <!-- 视频 -->
      <block v-if="form.type == 2">
        <u-button class="plus-btn"
                  type="error"
                  :disabled="btnDisabled"
                  :loading="btnLoading"
                  @click="submit">发布</u-button>
      </block>
    </view>
    <textarea placeholder="这一刻的想法..."
              :auto-height="true"
              maxlength="-1"
              v-model="form.content"
              class="post-txt"></textarea>
    <!-- 上传图片 -->
    <block v-if="form.type == 1">
      <u-upload ref="uUpload"
                name="file"
                :max-count="9"
                :header="header"
                :action="uploadImgUrl"
                @on-uploaded="submit"
                :auto-upload="false"></u-upload>
    </block>
    <block v-if="form.type == 2">
      <block v-if="form.media.length > 0">
        <video class="upload-video"
               :src="form.media[0]"></video>
      </block>
      <block v-else>
        <view @click="chooseVideo"
              class="upload-wrap">
          <u-icon name="plus"></u-icon>
        </view>
      </block>
    </block>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
export default {
  data () {
    return {
      btnDisabled: false,
      btnLoading: false,
      uploadImgUrl: this.$c.domain + '/yj-resource/files',
      form: {
        id: "",
        content: "",
        topicId: "",
        userId: uni.getStorageSync("user").id,
        images: "",
        video: "",
        media: [],
        circleId: "",
        glance: "",
        longitude: 0,
        latitude: 0,
        type: ""
      },
      header: {
        Authorization: 'Bearer ' + uni.getStorageSync("token")
      },
    };
  },
  onLoad (options) {
    if (options.topic_id) {
      this.form.circleId = options.topic_id;
    }
    if (options.discuss_id) {
      this.form.topicId = options.discuss_id;
    }
    this.form.type = options.type;

    let location = uni.getStorageSync("location_info");
    this.form.longitude = location.longitude;
    this.form.latitude = location.latitude;
  },
  methods: {
    chooseVideo () {
      let that = this;
      uni.chooseVideo({
        success: (res) => {
          console.log(res)
          const tempFilePaths = res.tempFilePath;
          uni.uploadFile({
            url: this.uploadImgUrl,
            filePath: tempFilePaths,
            name: 'file',
            header: {
              Authorization: 'Bearer ' + uni.getStorageSync("token")
            },
            success: (res2) => {
              console.log(res2)
              let rs = JSON.parse(res2.data)
              if (rs.code == "00000") {
                that.form.media.push(rs.data);
              }
            }
          });
        }
      });
    },
    uploadImg () {
      this.btnDisabled = true;
      this.btnLoading = true;

      if (!this.form.content) {
        this.$refs.uToast.show({
          title: "内容不能为空",
          type: 'error'
        })
        this.btnDisabled = false;
        this.btnLoading = false;
        return;
      }

      this.$refs.uUpload.upload();
    },
    submit (e) {
      if (this.form.type == 1) {
        let mediaList = [];
        e.forEach(function (item, index) {
          console.log(item)
          mediaList.push(item.response.data)
        })
        this.form.media = mediaList;
      }

      this.form.media = JSON.stringify(this.form.media)

      this.$H.post("/yj-grouping/article", this.form).then(res => {
        console.log(res)
        if (res.code == "00000") {
          uni.redirectTo({
            url: "/pages/post-detail/post-detail?id=" + res.data.id
          })
        } else {
          this.$refs.uToast.show({
            title: res.msg,
            type: 'error'
          })
        }
        this.btnDisabled = false;
        this.btnLoading = false;
      })
    }
  }
}
</script>

<style lang="scss">
@import "plus-post.css";
</style>
