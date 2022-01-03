<template>
	<view class="scroll">
		<scroll-view class="list-scroll" scroll-y @scrolltolower="loadmore">
			<view>
				<slot></slot>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name:"list-scroll",
		data() {
			return {
				
			};
		},
		methods:{
			loadmore() {
				this.$emit('loadmore')
			}
		}
	}
</script>

<style lang="scss">
.scroll{
	flex:1;
	height: 100%;
	overflow: hidden;
	box-sizing: border-box;
	.list-scroll {
		display: flex;
		height: 100%;
		flex-direction: column;
	}
}
</style>
