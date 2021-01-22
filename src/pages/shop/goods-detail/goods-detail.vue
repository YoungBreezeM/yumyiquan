<template>
	<view>
		<u-swiper :height="sysInfo.screenWidth*2" mode="number" indicator-pos="bottomRight" img-mode="aspectFill" :list="goodsInfo.album"></u-swiper>
		<view class="container">
			<view class="goods-title">
				<text class="title">{{goodsInfo.title}}</text>
				<u-icon size="45" class="icon-share" name="share"></u-icon>
			</view>
			<view class="price">
				<text>￥</text>
				<text>{{goodsInfo.price}}</text>
				<text>/件</text>
			</view>
		</view>
		<!-- 商品详情 -->
		<view class="goods-wrap">
			<view class="title">商品描述</view>
			<rich-text :nodes="goodsInfo.introduce | formatRichText"></rich-text>
		</view>
		<view style="height: 150rpx;"></view>
		<view class="tool">
			<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
		</view>
		<!-- 立即购买弹窗 -->
		<u-popup v-model="showPopup" mode="bottom" height="50%">
			<view class="container">
				<view class="goods-info">
					<u-image class="cover-img" width="150rpx" height="150rpx" :src="goodsInfo.cover_img"></u-image>
					<view class="goods-price">
						<view class="price">
							<text>￥</text>
							<text>{{goodsInfo.price}}</text>
						</view>
					</view>
				</view>
				<u-form :model="form" ref="uForm" label-width="auto">
					<u-form-item label="购买数量">
						<view class="number-box">
							<u-number-box class="number" v-model="form.goods_num"></u-number-box>
						</view>
					</u-form-item>
					<u-form-item label="地址" right-icon="arrow-right">
						<u-input :disabled="true" @click="$f.jump('/pages/shop/address-choose/address-choose')" input-align="right" :placeholder="addresTxt" v-model="form.region" />
					</u-form-item>
					<u-form-item>
						<u-input v-model="form.remark" type="textarea" placeholder="给商家留言" />
					</u-form-item>
				</u-form>
				<view style="height: 120rpx;"></view>
				<view class="f-fixed">
					<u-button type="success" @click="wxPay">立即付款</u-button>
				</view>
			</view>
		</u-popup>
		<u-top-tips z-index="9999999" ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addresTxt:"请选择",
				showAddress: false,
				goodsId: "",
				goodsInfo: {},
				sysInfo: this.$u.sys(),
				options: [{
						icon: 'headphones',
						text: '客服'
					},
					{
						icon: 'star',
						text: '种草',
						info: 0
					},
				],
				buttonGroup: [
					// {
					// 	text: '加入购物车',
					// 	backgroundColor: '#ff0000',
					// 	color: '#fff'
					// },
					{
						text: '立即购买',
						backgroundColor: '#ffa200',
						color: '#fff'
					}
				],
				showPopup: false,
				address: {},
				form: {
					goods_id: "",
					goods_num: 1,
					address_id: "",
					remark: ""
				}
			}
		},
		onLoad(options) {
			this.goodsId = options.id;
			this.getGoodsInfo();
		},
		methods: {
			onAddress(e) {
				this.form.region = e.province.label + e.city.label + e.area.label
			},
			onClick(e) {
				if (e.index == 0) {
					uni.makePhoneCall({
						phoneNumber: '18888888888'
					});
				}
				if (e.index == 1) {}
			},
			getCartNum() {
				this.$H.get("goods/cartGoodsList").then(res => {
					if (res.data.length > 0) {
						this.options[1].info = res.data.length
					}
				})
			},
			buttonClick(e) {
				if (e.index === 0) {
					this.showPopup = true;
				}
			},
			wxPay() {
				let that = this;

				if (!this.form.address_id) {
					this.$refs.uTips.show({
						title: '请选择地址',
						type: 'warning'
					})
					uni.hideLoading();
					return;
				}

				uni.showLoading({
					title: "加载中",
					mask: true
				})

				this.$H.post("order/create", this.form).then(res => {
					let payInfo = res.result;
					uni.requestPayment({
						provider: 'wxpay',
						timeStamp: String(payInfo.timeStamp),
						nonceStr: payInfo.nonceStr,
						package: payInfo.package,
						signType: payInfo.signType,
						paySign: payInfo.sign,
						success: function(res) {
							that.showPopup = false;
							uni.navigateTo({
								url: "/pages/jump/jump?order_id=" + payInfo.orderId
							})
						},
						fail: function(err) {
							that.$u.toast("已取消支付或支付失败");
						}
					});
					uni.hideLoading();
				})
			},
			getGoodsInfo() {
				this.$H.get("goods/detail", {
					id: this.goodsId
				}).then(res => {
					this.goodsInfo = res.result;
					this.form.goods_id = this.goodsInfo.goods_id;
				})
			}
		},
		filters: {
			//控制富文本中图片大小
			formatRichText(html) {
				let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
					if (match.search(/style=/gi) == -1) {
						match = match.replace(/\<img/gi, '<img style=""');
					}
					return match;
				});

				newContent = newContent.replace(/style="/gi, '$& max-width:100% !important; ');
				newContent = newContent.replace(/<br[^>]*\/>/gi, '');
				return newContent;
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "goods-detail.scss";
</style>
