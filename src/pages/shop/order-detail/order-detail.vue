<template>
	<view>
		<view class="goods-info" v-for="(item,index) in orderInfo.goods_list" :key="index">
			<u-image width="150rpx" height="150rpx" :src="item.cover_img"></u-image>
			<view class="info-right">
				<text>{{item.title}}</text>
				<view class="price">
					<text>￥{{item.price}}</text>
					<text class="num"> x {{orderInfo.goods_info[index].num}}</text>
				</view>
			</view>
		</view>
		<view class="cell">
			<view class="cell-item">
				<text>订单状态</text>
				<text>{{orderInfo.status}}</text>
			</view>
			<view class="cell-item">
				<text>结算金额</text>
				<text>{{orderInfo.total_money}}</text>
			</view>
			<view class="cell-item">
				<text>联系电话</text>
				<text>{{orderInfo.mobile}}</text>
			</view>
			<view class="cell-item">
				<text>下单时间</text>
				<text>{{orderInfo.create_time | date}}</text>
			</view>
		</view>
		<view class="cell">
			<view class="cell-item">
				<text>联系人</text>
				<text>{{orderInfo.address_info.name}}</text>
			</view>
			<view class="cell-item">
				<text>电话</text>
				<text>{{orderInfo.address_info.moblie}}</text>
			</view>
			<view class="cell-item">
				<text>地址</text>
				<text>{{orderInfo.address_info.region}}{{orderInfo.address_info.address}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId: "",
				orderInfo: {}
			}
		},
		onLoad(options) {
			this.orderId = options.id;
			this.getOrderDetail();
		},
		methods: {
			getOrderDetail() {
				this.$H.get("order/detail", {
					id: this.orderId
				}).then(res => {
					this.orderInfo = res.result;
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "order-detail.scss";
</style>
