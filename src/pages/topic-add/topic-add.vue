<template>
  <view class="container">
    <view class="f-wrap">
      <u-form ref="uForm">
        <u-form-item label="类别">
          <u-input input-align="right"
                   v-model="categoryName"
                   @click="show = true"
                   placeholder="请选择"
                   type="select" />
        </u-form-item>
        <u-form-item label="圈子名称"
                     label-width="auto">
          <u-input input-align="right"
                   v-model="form.circleName"
                   placeholder="请填写圈子名称" />
        </u-form-item>
        <u-form-item label="圈子描述"
                     label-position="top">
          <u-input type="textarea"
                   v-model="form.dsc"
                   placeholder="请填写圈子描述" />
        </u-form-item>
        <u-form-item label="圈子封面"
                     label-position="top">
          <u-upload ref="uUpload"
                    name="file"
                    :header="header"
                    :action="uploadImgUrl"
                    max-count="1"
                    @on-uploaded="onUploaded1"></u-upload>
        </u-form-item>
        <u-form-item label="圈子背景"
                     label-position="top">
          <u-upload ref="uUpload"
                    name="file"
                    :header="header"
                    :action="uploadImgUrl"
                    max-count="1"
                    @on-uploaded="onUploaded2"></u-upload>
        </u-form-item>
      </u-form>
    </view>
    <!-- 分类选择器 -->
    <u-select v-model="show"
              value-name='id'
              label-name='categoryName'
              mode="single-column"
              :list="cateList"
              @confirm="confirm"></u-select>
    <!-- 提交按钮 -->
    <view style="height: 120rpx;"></view>
    <view class="f-fixed">
      <u-button @click="submit"
                type="error"
                shape="circle">提交</u-button>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      show: false,
      cateList: [],
      categoryName: '',
      uploadImgUrl: this.$c.domain+'/yj-resource/files',
      header: {
        Authorization: 'Bearer ' + uni.getStorageSync("token")
      },
      form: {
        id: null,
        userId: uni.getStorageSync('user').id,
        categoryId: "",
        circleName: "",
        dsc: "",
        cover: "",
        bg: "",
      }
    };
  },
  onLoad () {
    this.getCate();
    console.log(uni.getStorageSync('user'))
  },
  methods: {
    onUploaded1 (e) {
      console.log(e)
      this.form.cover = e[0].response.data;
    },
    onUploaded2 (e) {
      this.form.bg = e[0].response.data;
    },
    submit () {

      this.$H.post('/yj-grouping/circle', this.form).then(res => {
        console.log(res)
        if (res.code == "00000") {
          this.$u.toast('成功创建圈子');
          uni.redirectTo({
            url: '/pages/topic-detail/topic-detail?id=' + res.data.id
          })
        }
      })
    },
    getCate () {
      this.$H.get('/yj-grouping/category').then(res => {
        console.log(res)
        this.cateList = res.data;
      })
    },
    confirm (e) {
      this.form.categoryId = e[0].value;
      this.categoryName = e[0].label;
    }
  }
}
</script>

<style lang="scss">
@import "topic-add.css";
</style>
