<template>
	<view>
		<view class="container head">
			<u-search class="search" placeholder="搜索" :show-action="false" @search="search" @custom="search" v-model="keyword"></u-search>
		</view>
		<view class="container">
			<u-swiper name="img" img-mode="widthFix" mode="none" height="380" :list="swiperList"></u-swiper>
			<view class="grid">
				<u-grid @click="jump" :col="4" :border="false">
					<u-grid-item index="/pages/goods-cate-list/goods-cate-list" v-for="(item,index) in menuList" :key="index">
						<u-image border-radius="10" class="grid-img" width="100rpx" height="100rpx" :src="item.img"></u-image>
						<view class="grid-text">{{item.title.substring(0,5)}}</view>
					</u-grid-item>
				</u-grid>
			</view>
			<!-- 分类 -->
			<u-tabs :list="goodsClassList" name="class_name" bg-color="#f5f5f5" active-color="#00b264" :current="current"
			 @change="change"></u-tabs>
			<!-- 商品列表 -->
			<goods-waterfall ref="waterfall" :list="goodsList" :loadStatus="loadStatus"></goods-waterfall>
		</view>
	</view>
</template>

<script>
	import goodsWaterfall from '@/components/goods-waterfall/goods-waterfall';
	export default {
		components: {
			goodsWaterfall
		},
		data() {
			return {
				current: 0,
				swiperList: [],
				menuList: [],
				loadStatus: 'loadmore',
				goodsList: [],
				goodsClassList: [{
					class_id: "",
					class_name: "推荐"
				}],
				goodsClassId: "",
				page: 1,
				keyword: "",
				navList: []
			}
		},
		onLoad() {
			this.getGoodsClass();
			this.getGoodsList();
			this.getLinkList();
		},
		onReachBottom() {
			this.page++;
			this.getGoodsList();
		},
		methods: {
			search() {
				uni.navigateTo({
					url: "/pages/shop/goods-list/goods-list?keyword=" + this.keyword
				})
			},
			jump(url) {
				uni.navigateTo({
					url: "/pages/goods-cate-list/goods-cate-list"
				})
			},
			getLinkList() {
				let that = this;
				this.$H.post("link/listAll").then(res => {
					res.result.forEach((item, index) => {
						if (item.type == 1) {
							that.swiperList.push(item)
						}

						if (item.type == 2) {
							that.menuList.push(item)
						}
					})
				})
			},
			change(index) {
				this.current = index;
				this.goodsList = [];
				this.goodsClassId = this.goodsClassList[index].class_id;
				this.page = 1;
				this.$refs.waterfall.clear();
				this.getGoodsList();
			},
			getGoodsClass() {
				this.$H.get("goods/goodsClass").then(res => {
					this.goodsClassList = this.goodsClassList.concat(res.result);
				})
			},
			getGoodsList() {
				this.loadStatus = "loading";
				this.$H.get("goods/list", {
					class_id: this.goodsClassId,
					page: this.page
				}).then(res => {
					this.goodsList = this.goodsList.concat(res.result.data);
					if (res.result.current_page >= res.result.last_page) {
						this.loadStatus = "nomore";
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import 'index.scss';
</style>
