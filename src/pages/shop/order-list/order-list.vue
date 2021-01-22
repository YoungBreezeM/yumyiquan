<template>
	<view>
		<u-tabs :list="tabsList" :is-scroll="false" active-color="#00b264" :current="current" @change="tabChange"></u-tabs>
		<block v-for="(item,index) in orderList" :key="index">
			<view class="order-item">
				<view class="head-wrap">
					<text class="status">{{item.status}}</text>
				</view>
				<navigator v-for="(item2,index2) in item.goods_list" :key="index2" class="goods-info" :url="'/pages/shop/order-detail/order-detail?id='+item.id" hover-class="none">
					<image mode="aspectFill" :src="item2.cover_img"></image>
					<view class="info-c">
						<view class="goods-title">{{item2.title}}</view>
						<view class="specs-list">
							<view class="item">
								<text>￥{{item.goods_info[index2].price}} x {{item.goods_info[index2].num}}</text>
							</view>
						</view>
					</view>
				</navigator>
				<view class="total-amount">
					<text class="tip">结算金额</text>
					<text class="money">￥{{item.total_money}}</text>
				</view>
			</view>
			<!-- 付款方式弹窗 -->
			<u-popup v-model="isPay" mode="bottom">
				<view style="padding: 100rpx;">
					<u-button style="margin-bottom: 50rpx;" @click="payment(item.pay_sn)" type="success">微信支付</u-button>
				</view>
			</u-popup>
		</block>
		<!-- 加载状态 -->
		<block v-if="loadStatus == 'nomore' && orderList.length === 0">
			<view style="margin-top: 30%;">
				<u-empty text="暂无订单" mode="favor"></u-empty>
			</view>
		</block>
		<block v-else>
			<view style="margin: 30rpx 0;">
				<u-loadmore bg-color="#f5f5f5" icon-color="#00b264" :status="loadStatus" />
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loadStatus: "loadmore",
				tabsList: [{
						name: '全部'
					}, {
						name: '待付款'
					}, {
						name: '待发货'
					},
					{
						name: '待收货'
					},
					{
						name: '已完成'
					}
				],
				current: 0,
				orderList: [],
				page: 1
			};
		},
		onLoad(options) {
			this.getOrderList();
		},
		onReachBottom() {
			this.page++;
			this.getOrderList();
		},
		methods: {
			jumpRefund(url) {
				uni.navigateTo({
					url: url
				})
			},
			jumpComment(id) {
				uni.navigateTo({
					url: "/pages/goods-comment-add/goods-comment-add?id=" + id
				})
			},

			cancelOrder(id, index) {
				id = parseInt(id);
				this.$H.post("shop.order/order_cancel.html", {
					key: uni.getStorageSync("sessionKey"),
					order_id: id
				}).then(res => {
					if (res.code === 200) {
						let arr = this.orderList
						arr.splice(index, 1);

						this.orderList = arr;
					}
				})
			},
			confirmOrder(id, index) {
				id = parseInt(id);
				let that = this;
				this.$H.post("shop.order/order_receive.html", {
					key: uni.getStorageSync("sessionKey"),
					order_id: id
				}).then(res => {
					if (res.code === 200) {
						this.$u.toast('已成功确认收货');

						setTimeout(function() {
							let arr = that.orderList
							arr.splice(index, 1);

							that.orderList = arr;
						}, 1000)
					}
				})
			},
			tabChange(index) {
				this.current = index;
				this.orderList = []
				this.page = 1;
				this.getOrderList();
			},
			getOrderList() {
				this.loadStatus = 'loading';

				let status = "";
				switch (this.current) {
					case 1:
						status = 0;
						break;
					case 2:
						status = 1;
						break;
					case 3:
						status = 2;
						break;
					case 4:
						status = 5;
						break;
				}
				this.$H.get("order/list", {
					page: this.page,
					status: status
				}).then(res => {
					this.orderList = this.orderList.concat(res.result.data);
					if (res.result.current_page >= res.result.last_page) {
						this.loadStatus = "nomore";
					}
				})
			}
		}
	}
</script>
 
<style lang="scss">
	@import 'order-list.scss';
</style>