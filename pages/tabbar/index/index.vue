<template>
	<view class="home">
		<navbar></navbar>
		<tab :list="tabList" :tabIndex="tabIndex" @tab="tab" ></tab>
		<view class="home-list">
			<list :tab="tabList" :activeIndex="activeIndex" @change="change"></list>
		</view>
		
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				title: 'Hello',
				tabList:[],
				tabIndex: 0,
				activeIndex: 0
			}
		},
		onLoad() {
			uni.$on('labelChange',res => {
				this.tabList = []
				this.tabIndex = 0
				this.activeIndex = 0
				this.getLabel()
			})
			
		},
		computed:{
			...mapState(['userinfo'])
		},
		watch:{
			userinfo(newVal){
				this.getLabel()
			}
		},
		methods: {
			getLabel() {
				//调用云函数方法
				this.$api.get_label().then(res => {
					const {data} = res
					data.unshift({
						name: '全部'
					})
					this.tabList = data
					// console.log(this.tabList)
				}).catch(err => {
					console.log(err)
				})
			}, 
			tab({data,index}) {
				this.activeIndex = index
			},
			change(current) {
				this.tabIndex = current
				this.activeIndex = current
			}
		}
	}
</script>

<style lang="scss">
	page{
		height: 100%;
		display: flex;
	}
	.home{
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
		.home-list{
			flex:1;
			box-sizing: border-box;
		}
	}
</style>
