<!--
 * @Author: your name
 * @Date: 2021-02-02 20:49:55
 * @LastEditTime: 2021-02-02 21:44:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /yj-project/src/pages/swiper-vidwo/swiper-video.vue
-->
<template>
  <view>
    <view class="page"
          :style="{ height: height }">
      <swiper class="swiper"
              :vertical="true"
              @change="changeCurrent"
              @animationfinish="animationFinish"
              :current="index">
        <swiper-item v-for="(item, idx) in videoList"
                     :key="idx"
                     class="swiper-item">
          <view style="background:red">
            sd
          </view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
export default {
  components: {

  },
  data () {
    return {
      sysheight: 0,
      playCount: 2,//剩余多少视频加载视频列表
      videoList: [
        1, 2, 3
      ],
      height: '667px',
      index: 0,
      width: '',
      oldIndex: 0
    }
  },
  created () {
    this.height = `${uni.getSystemInfoSync().windowHeight}px`
    let width = uni.getSystemInfoSync().windowWidth




  },
  // async mounted () {

  // },
  // onHide () {
  //   for (let item of this.videoList) {
  //     item.flag = false
  //   }
  // },
  // methods: {
  //   animationFinish (e) {
  //     //#ifdef APP-PLUS
  //     //this.changeCurrent(e)
  //     //#endif
  //   },
  //   changeCurrent (e) {
  //     this.index = e.detail.current;

  //     // this.$nextTick(() => {

  //     //   for (let item of this.videoList) {
  //     //     item.flag = false
  //     //   }

  //     //   this.videoList[this.index].flag = true

  //     // })

  //   },
  //   pushVideoList () {
  //     this.videoList = [1, 2, 3]
  //   },
  //   tapLove () {
  //     this.videoList[this.index].check = !this.videoList[this.index].check
  //     this.videoList = [...this.videoList]

  //   },
  //   tapAvater () {
  //     uni.showToast({
  //       icon: 'none',
  //       title: `点击索引为${this.index}的头像`
  //     })
  //   },
  //   tapMsg (item) {
  //     //#ifndef APP-NVUE
  //     uni.showToast({
  //       icon: 'none',
  //       title: `查看索引为${this.index}的评论`
  //     })
  //     //#endif
  //     //#ifdef APP-NVUE
  //     uni.getSubNVueById('comment').show('none', 0, () => {
  //       uni.$emit('showComment', item.content)
  //     });
  //     //#endif
  //   },
  //   tapShare () {
  //     uni.showToast({
  //       icon: 'none',
  //       title: `分享索引为${this.index}的视频`
  //     })
  //   },
  //   videoPlay (index) {
  //     let promise = new Promise((resolve, reject) => {
  //       resolve()
  //     })
  //     promise.then(res => {
  //       this.$set(this.videoList[index], 'flag', !this.videoList[index].flag)
  //     })
  //   },
  //   pauseVideo (val) {
  //     if (typeof this.videoList[this.oldIndex].initialTime != 'undefined') this.videoList[this.oldIndex].initialTime = val
  //   },
  //   clickVideo () {
  //     this.oldIndex = this.index
  //     this.videoList[this.index].flag = !this.videoList[this.index].flag
  //   }
  // },
  // watch: {
  //   index (newVal, oldVal) {
  //     let len = this.videoList.filter(item => item.src).length
  //     //加载视频
  //     if (len - this.index - 1 <= this.playCount) {
  //       this.pushVideoList()
  //     }
  //     this.oldIndex = oldVal
  //   }
  // }
}
</script>

<style scoped>
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
.video-box {
  flex: 1;
  width: 750rpx;
}
.cover-view-center {
  position: absolute;
  justify-content: center;
  align-items: center;
  opacity: 0.1;
  z-index: 999;
}
.cover-view-left {
  position: absolute;
  margin-left: 10upx;
  width: 500upx;
  bottom: 120upx;
  z-index: 9999;
  font-size: 16px;
  color: #ffffff;
  /* #ifndef APP-PLUS */
  white-space: pre-wrap;
  text-overflow: ellipsis;
  overflow: hidden;
  /* #endif */
}
.left-view {
  margin-bottom: 20upx;
}
.left-text {
  font-size: 16px;
  color: #ffffff;
}
.avater {
  border-radius: 50upx;
  border-color: #fff;
  border-style: solid;
  border-width: 2px;
}

.cover-view-right {
  position: absolute;
  bottom: 160upx;
  right: 20upx;
  /* #ifndef APP-PLUS-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  z-index: 9999;
}

.right-text-avater {
  position: absolute;
  font-size: 14px;
  top: 80upx;
  left: 30upx;
  height: 40upx;
  width: 40upx;
  background-color: #dd524d;
  color: #ffffff;
  border-radius: 50%;
  text-align: center;
  line-height: 40upx;
  z-index: 999;
}
.avater-icon {
  height: 40upx;
  width: 40upx;

  color: #fff;
  background-color: #dd524d;
  border-radius: 50%;
  position: absolute;
  left: 30upx;
  top: -20upx;
}

.right-text {
  text-align: center;
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 50upx;
  height: 20px;
}
.img {
  height: 100upx;
  width: 100upx;
  opacity: 0.9;
}
.page {
  /* #ifndef APP-PLUS-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  flex: 1;
}
</style>
