<template>
	<view class="container">
		<block v-if="addressList.length > 0">
			<view class="address-item" v-for="(item, index) in addressList" :key="index">
				<view class="user-txt">
					<text>{{item.name}}</text>
					<text>{{item.moblie}}</text>
				</view>
				<view class="address-txt">
					<text v-if="item.is_default == 1" class="default">[默认地址]</text>
					<text>{{item.region}}{{item.address}}</text>
					<view class="btn-wrap">
						<u-button @click="editDefault(item.id)" v-if="item.is_default != 1" type="error" size="mini" plain>设为默认</u-button>
						<u-button @click="jumpEdit(item.id)" style="margin-left: 10rpx;" plain size="mini">编辑</u-button>
					</view>
				</view>
			</view>
		</block>
		<block v-else>
			<u-empty text="暂无收货地址" mode="address"></u-empty>
		</block>

		<view style="height: 120rpx;"></view>
		<view class="f-fixed">
			<u-button @click="$f.jump('/pages/shop/address-add/address-add')">新建收货地址</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addressValue: 0,
				addressList: []
			};
		},
		onShow() {
			this.getAddress();
		},
		methods: {
			jumpEdit(id) {
				uni.navigateTo({
					url: "/pages/shop/address-edit/address-edit?id=" + id
				})
			},
			getAddress() {
				this.$H.post("user/addressList.html").then(res => {
					this.addressList = res.result;
				})
			},
			editDefault(id) {
				this.$H.post("user/setAddressEdit", {
					address_id: id
				}).then(res => {
					if (res.code === 200) {
						this.$u.toast('修改默认地址成功');
						this.getAddress();
					}
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
	@import 'address-list.scss';
</style>
