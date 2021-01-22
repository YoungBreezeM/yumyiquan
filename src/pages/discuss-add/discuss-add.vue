<!--
 * @Author: your name
 * @Date: 2020-12-23 16:07:36
 * @LastEditTime: 2021-01-15 16:19:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /yj-project/src/pages/discuss-add/discuss-add.vue
-->
<template>
  <view class="container">
    <u-form>
      <u-form-item>
        <input class="dis-title"
               placeholder="话题名称"
               v-model="form.topicName" />
      </u-form-item>
      <u-form-item :border-bottom="false">
        <textarea placeholder="一句话介绍要讨论的话题"
                  v-model="form.dsc"
                  class="post-txt"></textarea>
      </u-form-item>
    </u-form>
    <view class="f-fixed">
      <u-button class="plus-btn"
                type="error"
                shape="circle"
                :disabled="btnDisabled"
                :loading="btnLoading"
                @click="disAdd">创建话题</u-button>
    </view>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
export default {
  data () {
    return {
      btnDisabled: false,
      btnLoading: false,
      form: {
        circleId: "",
        dsc: "",
        topicName: "",
        userId: uni.getStorageSync("user").id
      },
      header: {
        token: uni.getStorageSync("token")
      }
    };
  },
  onLoad (options) {
    this.form.circleId = options.topicId;
  },
  methods: {
    disAdd () {
      this.btnDisabled = true;
      this.btnLoading = true;

      if (!this.form.topicName) {
        this.$refs.uToast.show({
          title: "标题不能为空",
          type: 'error'
        })
        this.btnDisabled = false;
        this.btnLoading = false;
        return;
      } else if (!this.form.dsc) {
        this.$refs.uToast.show({
          title: "内容不能为空",
          type: 'error'
        })
        this.btnDisabled = false;
        this.btnLoading = false;
        return;
      } else {
        this.$H.post("/yj-grouping/topic", this.form).then(res => {
          console.log(res)
          if (res.code == "00000") {
            this.$refs.uToast.show({
              title: res.msg,
              type: 'success'
            })
            setTimeout(() => {
              uni.navigateBack();
            }, 1000);
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
    },
  }
}
</script>

<style lang="scss">
@import "discuss-add.css";
</style>
