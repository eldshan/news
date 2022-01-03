<template>
	<view class="navbar">
		<view class="navbar-fixed">
			<!-- 状态栏 -->
			<view :style="{height: statusBarHeight+'px;'}"></view>
			<!-- 导航栏 -->
			<view class="narbar-content" :class="{search:isSearch}" :style="{height:navBarHeight+'px;',width:windowWidth+'px;'}"  @click.stop="open">
				<!-- 返回键 -->
				<view v-if="isSearch" class="narbar-content__search-icons" @click="back">
					<uni-icons type="back" size="22" color="#fff"></uni-icons>
				</view>
				<view v-if="!isSearch" class="navbar-serach">
					<!-- 非搜索页显示 -->
					<view class="navbar-search_icon">
						<uni-icons type="search" size="16" color="#999"></uni-icons>
					</view>
					<view class="navbar-serach_text">uni-app、vue</view>
				</view>
				<view v-else class="navbar-serach">
					<!-- 搜索页显示 -->
					<input class="navbar-serach_text" type="text" v-model="val" placeholder="搜素内容" @input="inputChange"	/>
				</view>
			</view>
		</view>
		<view :style="{height:occupiedHeight+'px'}"></view>
	</view>
</template>

<script>
	
	export default {
		props: {
			value:{
			  type:[String.Number],
			  default:''
			},
			isSearch: {
				type: Boolean,
				default: false
				
			}
		},
		data() {
			return {
				statusBarHeight: 20,
				windowWidth: 375,
				navBarHeight: 45,
				occupiedHeight:45,
				val: ''
			}
		},
		watch:{
			value(newVal) {
				this.val = newVal
			}
		},
		computed:{
			occupiedNav() {	
				return this.occupiedHeight = this.statusBarHeight + this.navBarHeight
			}
		},
		created() {
			//获取手机系统信息
			const info = uni.getSystemInfoSync()
			// console.log(info)
			//设置状态栏高度
			this.statusBarHeight = info.statusBarHeight
			//书写条件编译 
			// #ifndef H5 || APP-PLUS || MP-ALIPAY
			//获取胶囊的位置---(胶囊底部高度-状态栏高度) + （胶囊顶部高度-状态栏高度）
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			this.navBarHeight = (menuButtonInfo.bottom - info.statusBarHeight) + (menuButtonInfo.top - info.statusBarHeight)
			this.windowWidth = menuButtonInfo.left
			// #endif
		},
		methods:{
			open() {
				if(this.isSearch) return
				uni.navigateTo({
					url:'/pages/home-search/home-search'
				})
			},
			inputChange(e) {
				const {value} = e.detail
				// console.log(value)
				this.$emit('input',value)
			},
			back() {
				// uni.navigateBack({
					
				// })
				uni.switchTab({
					url:'/pages/tabbar/index/index'
				})
			}
		}
	}
</script>

<style lang="scss">
.navbar{
	.navbar-fixed{
		position: fixed;
		top:0;
		left: 0;
		z-index: 99;
		width: 100%;
		background-color: $mk-base-color;
		.narbar-content{
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 15px;	
			box-sizing: border-box;
			.navbar-serach{
				display: flex;
				align-items: center;
				height: 30px;
				background-color: #fff;
				padding:0 10px;
				width: 100%;
				border-radius: 30px;
				.navbar-search_icon{
					margin-right: 10px;
				}
				.navbar-serach_text{
					width: 100%;
					font-size: 14px;
					color: #999;
				}
			}
			&.search{
				padding-left: 0;
				.narbar-content__search-icons{
					margin-left: 15px;
					margin-right: 10px;
				}
				.navbar-serach{
					border-radius: 5px;
				}
			}
		}
	}
	
}
</style>
