<template>
<view @click="open">
	<!-- 基础卡片 -->
	<view v-if="item.mode === 'base'" class="listcard">
		<view class="listcard-image">
			<image :src="item.cover[0]" mode="aspectFill"/>
		</view>
		<view class="listcard-content">
			<view class="listcard-content_title">
				<text>
					{{item.title}}
				</text>
				<likes :types="types" :item = "item"></likes>
			</view>	
			<view class="listcard-content_des">
				<view class="listcard-content__des-label">
					<view class="listcard-content__des-label-item">
						{{item.classify}}
					</view>
				</view>
				<view class="listcard-content__des-browse">
					{{item.browse_count}}人浏览
				</view>
			</view>
		</view>
	</view>

	<!-- 多图模式 -->
	<view v-if="item.mode === 'column'" class="listcard mode-column">
		<view class="listcard-content">
			<view class="listcard-content_title">
				<text>
					{{item.title}}
				</text>
				<likes :types="types" :item = "item"></likes>
			</view>
			<view class="listcard-image">
				<view v-for="imgitem in item.cover" :key="item._id" class="listcard-image__item">
					<image :src="imgitem" mode="aspectFill"/>
				</view>
			</view>
			<view class="listcard-content_des">
				<view class="listcard-content__des-label">
					<view class="listcard-content__des-label-item">
						{{item.classify}}
					</view>
				</view>
				<view class="listcard-content__des-browse">
					{{item.browse_count}}人浏览
				</view>
			</view>
		</view>
	</view>
	<!-- 大图模式 -->
	<view v-if="item.mode === 'image'" class="listcard mode-image">
		<view class="listcard-image">
			<image :src="item.cover[0]" mode="aspectFill"/>
		</view>
		<view class="listcard-content">
			<view class="listcard-content_title">
				<text>
					{{item.title}}
				</text>
				 <likes :types="types" :item = "item"></likes>
			</view>
			
			<view class="listcard-content_des">
				<view class="listcard-content__des-label">
					<view class="listcard-content__des-label-item">
						{{item.classify}}
					</view>
				</view>
				<view class="listcard-content__des-browse">
					{{item.browse_count}}人浏览
				</view>
			</view>
		</view>
	</view> 
</view>
</template>

<script>
	export default {
		name:"list-card",
		props:{
		  mode:{
			  type: String,
			  default: 'base'
		  },
		  item:{
			  type: Object,
			  default() {
				  return {}
			  }
		  },
		  types:{
			  type:String,
			  default:''
		  }
		},
		data() {
			return {
				
			};
		},
		methods: {
			open() {
				const item = this.item
				this.$emit('clickEvent',item)
				const params = {
					_id: item._id,
					title: item.title,
					author: item.author,
					create_item: item.create_item,
					thumbs_up_count: item.thumbs_up_count, 
					browse_count: item.browse_count
				}
				uni.navigateTo({
					url: '/pages/home-detail/home-detail?params='+JSON.stringify(params)
				})   
			}
		}
	}
</script>

<style lang="scss">
	.listcard{
		display: flex;
		margin: 10px;
		padding: 10px;
		border-radius: 5px;
		box-shadow: 0 0 5px 1px rgba($color: #000000, $alpha: 0.1);
		box-sizing: border-box;
		.listcard-image{
			flex-shrink: 0;
			width: 60px;
			height: 60px;
			border-radius: 5px;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
			} 
		}
		.listcard-content{
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding-left: 10px;
			width: 100%;
			.listcard-content_title{
				position: relative;
				padding-right: 30px;
				font-size:14px;
				color: #333;
				font-weight: 400;
				line-height: 1.2;
				text{
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient:vertical;
					-webkit-line-clamp:2;
				}
				
			}
			.listcard-content_des{
				display: flex;
				justify-content: space-between;
				font-size: 12px;
				.listcard-content__des-label{
					display:flex;
					.listcard-content__des-label-item{
						padding: 0 5px;
						margin-right: 5px;
						border-radius: 15px;
						color: $mk-base-color;
						border: 1px solid $mk-base-color;
					}
				}
				.listcard-content__des-browse{
					color: #999;
					line-height: 1.5;
				}
			}
		}
		&.mode-column{
			.listcard-content{
				width: 100%;
				padding-left:0 ;
			}
			.listcard-image{
			  display:flex;
			  margin-top:10px;
			  width: 100%;
			  height:70px;
			  .listcard-image__item{
				  margin-left: 10px;
				  width: 100%;
				  border-radius:5px;
				  overflow: hidden;
				  &:first-child{
					  margin-left: 0;
				  }
				  image{
					  width: 100%;
					  height: 100%;
				  }
			  }
			}
			.listcard-content_des{
				margin-top: 10px;
			}
		}
		&.mode-image{
			flex-direction: column;
			.listcard-image{
				width: 100%;
				height: 100px;
			}
			.listcard-content{
				padding-left: 0;
				margin-top: 10px;
				.listcard-content_des{
					display: flex;
					align-items: center;
					margin-top: 10px;
				}
			}
		}
	}
</style>
