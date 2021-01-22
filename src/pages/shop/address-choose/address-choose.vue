<template>
	<view class="container">
		<block v-if="addressList.length > 0">
			<view @click="onChooseAddress(item)" class="address-item" v-for="(item, index) in addressList" :key="index">
				<view class="user-txt">
					<text>{{item.name}}</text>
					<text>{{item.moblie}}</text>
				</view>
				<view class="address-txt">
					<text v-if="item.is_default == 1" class="default">[默认地址]</text>
					<text>{{item.region}}{{item.address}}</text>
				</view>
			</view>
		</block>
		<block v-else>
			<u-empty text="暂无收货地址" mode="address"></u-empty>
		</block>
		<view style="height: 120rpx;"></view>
		<view class="f-fixed">
			<u-button @click="jump">新增地址</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addressList: []
			};
		},
		onShow() {
			this.getAddress();
		},
		methods: {
			onChooseAddress(address) {
				let pages = getCurrentPages(); //获取所有页面栈实例列表
				let nowPage = pages[pages.length - 1]; //当前页页面实例
				let prevPage = pages[pages.length - 2]; //上一页页面实例
				prevPage.$vm.address = address;
				prevPage.$vm.addresTxt = address.region + address.address;
				prevPage.$vm.form.address_id = address.id;
				uni.navigateBack();
			},
			getAddress() {
				this.$H.post("user/addressList").then(res => {
					this.addressList = res.result;
				})
			},
			jump() {
				uni.navigateTo({
					url: "/pages/shop/address-add/address-add"
				})
			}
		}
	}
</script>
<style>
	page {
		background-color: #FFFFFF;
	}
</style>
<style lang="scss" scoped>
	@import 'address-choose.scss';
</style>
