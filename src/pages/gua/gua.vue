<template>
  <view>
    <view :class="content?'gua':'gua center'"
          @click="toBuGua">
      <u-circle-progress active-color="#2979ff"
                         bg-color="none"
                         :percent="16.7*computeBody.count">
        <view class="u-progress-content">
          <view class="u-progress-dot"></view>
          <text class='u-progress-info'>卜卦</text>
        </view>
      </u-circle-progress>
    </view>
    <view v-if="content"
          class="gua">
      <u-button type="primary"
                ripple="true"
                @click="toResolve">解卦</u-button>
    </view>
    <u-picker v-model="show"
              mode="selector"
              :default-selector="params[0]"
              :range="params"
              @confirm="toGetText"
              range-key="categoryName"></u-picker>
    <view v-if="content"
          style="width:90%;margin:auto">
      <u-parse :html="content"></u-parse>
    </view>
    <view v-if="contentYao"
          style="width:90%;margin:auto">
      <u-parse :html="contentYao"></u-parse>
    </view>
    <view v-if="predictionText"
          style="width:90%;margin:auto">
      <u-parse :html="predictionText"></u-parse>
    </view>
    <u-modal v-model="showM"
             show-cancel-button="true"
             content="每次解挂需要消耗相应积分，是否继续？"
             @cancel="cancelComputeGua"
             @confirm="confirmCompute"></u-modal>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import uButton from '../../uview-ui/components/u-button/u-button.vue';
import createdOneGua from '../../utils/bugua'
import { computedGua, getGuaComputeText, getPredictionCategory } from '../../api/gua'
import UCircleProgress from '../../uview-ui/components/u-circle-progress/u-circle-progress.vue';
import UParse from '../../uview-ui/components/u-parse/u-parse.vue';
import UToast from '../../uview-ui/components/u-toast/u-toast.vue';
import UModal from '../../uview-ui/components/u-modal/u-modal.vue';
export default {
  components: { uButton, UCircleProgress, UParse, UToast, UModal },

  data () {
    return {
      gua: ["乾", "坎", "艮", "震", "巽", "离", "坤", "兑"],
      show: false,
      showM: false,
      params: [],
      guaGraph: [
        [1, 1, 1],
        [0, 1, 0],
        [1, 0, 0],
        [0, 0, 1],
        [1, 1, 0],
        [1, 0, 1],
        [0, 0, 0],
        [0, 1, 1]
      ],
      content: null,
      contentYao: null,
      predictionText: null,
      baseGua: null,
      yao: null,
      computeBody: {
        top: null,
        bottom: null,
        cacheGuaList: [],//本卦
        cacheGua: [],//变卦
        count: 0,
        cacheGuaBottom: [],
        cacheGuaTop: []
      },
      user: uni.getStorageSync("user")

    }
  },
  watch: {
    uid (n) {
      this.topicUid = n;
    }
  },
  created () {

  },
  methods: {
    cancelComputeGua () {
      this.$refs.uToast.show({
        title: '您已取消解卦',
        type: 'warning',
      })
    },
    confirmCompute () {
      if (this.user.integral > 5) {
        getPredictionCategory()
          .then(res => {
            this.params = res.data
            this.show = !this.show;
          })
      } else {
        this.$refs.uToast.show({
          title: '您目前的积分不够',
          type: 'warning',
        })
      }

    },
    toGetText (e) {
      getGuaComputeText({
        baseGuaId: this.baseGua.id,
        yaoId: this.yao ? this.yao.id : null,
        categoryId: this.params[e.length > 0 ? e[0] : 0].id
      }, this.user.id)
        .then(res => {
          if (res.data.length > 0) {
            this.predictionText = res.data[0].predictionText;
            this.content = null;
            this.contentYao = null;
          } else {
            this.$refs.uToast.show({
              title: '无文本解析',
              type: 'error',
            })
          }


        })
    },
    toResolve () {
      this.showM = true;

    },
    reSetData () {
      this.content = null;
      this.contentYao = null;
      this.baseGua = null;
      this.yao = null;
      this.predictionText = null;
      this.computeBody = {
        top: null,
        bottom: null,
        cacheGuaList: [],//本卦
        cacheGua: [],//变卦
        count: 0,
        cacheGuaBottom: [],
        cacheGuaTop: []
      }
    },
    playSound (src) {
      const innerAudioContext = wx.createInnerAudioContext()
      innerAudioContext.autoplay = true
      //这两句话话一定要在一起，不然ios手机上会有时间放不出声音
      innerAudioContext.src = src
      innerAudioContext.onPlay(() => {

      });
      innerAudioContext.onError((res) => {
        console.log(res)
      })
    },
    toBuGua () {
      console.log(this.computeBody)
      if (this.computeBody.count === 0) {
        this.reSetData();
      }

      this.computeBody.count++;
      this.playSound('/static/audio/coin.mp3');
      let oneGua = createdOneGua();
      console.log(oneGua)

      this.computeBody.cacheGuaList.unshift(oneGua.Type);
      this.computeBody.cacheGua.unshift(oneGua.TF);

      if (this.computeBody.cacheGuaBottom.length < 3) {
        this.computeBody.cacheGuaBottom.unshift(oneGua.TF);
      } else {
        this.computeBody.cacheGuaTop.unshift(oneGua.TF)
      }
      if (this.computeBody.count > 5) {
        this.computeBody.count = 0;
        console.log(this.computeBody.cacheGuaTop, this.computeBody.cacheGuaBottom);

        this.guaGraph.forEach((item, index) => {
          if (item.toString() === this.computeBody.cacheGuaTop.toString()) {
            this.computeBody.top = index;
          }

          if (item.toString() === this.computeBody.cacheGuaBottom.toString()) {
            this.computeBody.bottom = index;
          }

        })

        this.drawLots();

      }
    },
    //抽签
    drawLots () {
      computedGua({
        top: this.guaGraph[this.computeBody.top],
        bottom: this.guaGraph[this.computeBody.bottom],
        changeGua: this.computeBody.cacheGuaList
      }).then(res => {
        if (res.code === '00000') {
          let { baseGua, yao } = res.data;
          this.content = baseGua.guaText;
          this.contentYao = yao && yao.yaoText;
          this.yao = yao;
          this.baseGua = baseGua;
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.u-progress-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.u-progress-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background-color: #fb9126;
}

.u-progress-info {
  font-size: 28rpx;
  padding-left: 16rpx;
  letter-spacing: 2rpx;
}
.gua {
  width: 200rpx;
  margin: auto;
}
.center {
  margin-top: 600rpx;
}
</style>
