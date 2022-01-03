<template>
	<view class="detail">
		<view class="detail-title">
			{{formData.title}}
		</view>
		<view class="detail-header">
			<view class="detail-header__logo">
				<image :src="formData.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="detail-header__content">
				<view class="detail-header__content-title">
					{{formData.author.author_name}}
				</view>
				<view class="detail-header__content-info">
					<text>{{formData.create_time}}</text>
					<text>{{formData.browse_count}} 浏览</text>
					<text>{{formData.thumbs_up_count}} 赞</text>
				</view>
			</view>
			<button class="detail-header__button" type="default" @click="follow(formData.author.id)">{{formData.is_author_like?'取消关注':'关注'}}</button>
		</view>
		<view class="detail-content">
			<view class="detail-html">
				<u-parse :content="formData.content" :noData="noData"></u-parse>
			</view>
			<view class="detail-comment">
				<view class="comment-title">最新评论</view>
				<view class="comment-content" v-for="item in commentsList" :key="item.comment_id">
					{{item.comment_id}}
					<comments-box :comments="item" @reply="reply"></comments-box>
				</view>
			</view>
		</view>
		<view class="detail-bottom">
			<view class="detail-bottom__input" @click="openComment">
				<text>谈谈你的看法</text>
				<uni-icons type="compose" size="16" color="#F07373"></uni-icons>
			</view>
			<view class="detail-bottom__icons">
				<view class="detail-bottom__icons-box" @click="open">
					<uni-icons type="chat" size="22" color="#F07373"></uni-icons>
				</view>
				<view class="detail-bottom__icons-box" @click="likeTap(formData._id)">
					<uni-icons :type="formData.is_like?'heart-filled':'heart'" size="22" color="#F07373"></uni-icons>
				</view>
				<view class="detail-bottom__icons-box" @click="thumbsup(formData._id)">
					<uni-icons :type="formData.is_thumbs_up?'hand-thumbsup-filled':'hand-thumbsup' " size="22" color="#F07373"></uni-icons>
				</view>
			</view>
		</view>
		<release ref="popup" @submit="submit"></release>
	</view>
</template>

<script>
	import uParse from '@/components/gaoyia-parse/parse.vue'
	export default {
		components: {
			uParse
		},
		data() {
			return {
				formData: {},
				commentsList:[],
				replyFormData:{},
				showPopup:false,
				noData: '<p style="text-align:center;color:#666;">详情加载中...</p>'
			}
		},
		onLoad(query) {
			this.formData = JSON.parse(query.params)
			this.getDetail()
			this.getComments()
		},
		methods: { 
			// 打开评论列表
			open() {
				uni.navigateTo({
					url:'../detail-comments/detail-comments?id='+this.formData._id
				})
			},
			// 点赞
			thumbsup(article_id) {
				this.setUpdateThumbs(article_id)
			},
			//收藏
			likeTap(article_id) {
				this.setUpdateLike(article_id)
			},
			//关注
			follow(author_id) {
				this.setUpdateAuthor(author_id)
			},
			//打开评论发布窗口
			openComment() {
				this.$refs.popup.open()
			},
			//关闭弹窗
			close() {
				this.$refs.popup.close()
			},
			//发布
			submit(content) {
				this.setUpdateComment({content,...this.replyFormData})
			},
			reply(e) {
				//存放回复的信息
				this.replyFormData = {
					"comment_id": e.comments.comment_id,
					"is_reply": e.is_reply
				}
				if(e.comments.reply_id) { 
					this.replyFormData.reply_id = e.comments.reply_id
				}
				this.openComment()
			},
			//关注文章
			setUpdateComment(content) {
				const formdata = {
					article_id: this.formData._id,
					...content 
				}
				uni.showLoading();
				this.$api.update_comment(formdata).then(res =>{
					//更新一个formData
					const {data} = res
					
					uni.hideLoading()
					uni.showToast({
						title: '评论发布成功',
						icon: 'none'
					})
					this.getComments()
					this.close()
					this.replyFormData = {}
				}).catch(e =>{
					this.close()
				})
			},
			//获取详细信息
			getDetail() {
				this.$api.get_detail({
					article_id: this.formData._id
				}).then(res =>{
					//更新一个formData
					const {data} = res
					this.formData = data
				}).catch(e =>{
					
				})
			},
			//请求评论
			getComments() {
				this.$api.get_comments({
					article_id: this.formData._id
				}).then(res =>{
					//更新一个formData
					const {data} = res
					this.commentsList = data
					console.log(data)
				}).catch(e =>{
					console.log(e)
				})
			},
			//关注作者
			setUpdateAuthor(author_id) {
				uni.showLoading()
				this.$api.update_author({
					author_id
				}).then(res => {
					uni.hideLoading()
					this.formData.is_author_like = !this.formData.is_author_like
					uni.$emit('update_author')
					uni.showToast({
						title: this.formData.is_author_like?'关注作者成功':'取消关注作者',
						icon: 'none'
					})
				}).catch(e => {
					
				})
			},
			//收藏文章
			setUpdateLike(article_id) {
				uni.showLoading()
				this.$api.update_like({
					article_id
				}).then(res => {
					uni.hideLoading()
					this.formData.is_like = !this.formData.is_like
					uni.$emit('update_article','follow')
					uni.showToast({
						title: this.formData.is_like?'收藏成功':'取消收藏',
						icon: 'none'
					})
				}).catch(e => {
					
				})
			},
			setUpdateThumbs(article_id) {
				uni.showLoading()
				this.$api.update_thumbsup({
					article_id
				}).then(res => {
					uni.hideLoading()
					this.formData.is_thumbs_up = true
					this.formData.thumbs_up_count++
					uni.showToast({
						title: res.msg
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.detail {
		padding: 15px 0;
		padding-bottom: 54px;
	}

	.detail-title {
		padding: 0 15px;
		font-size: 18px;
		font-weight: bold;
		color: #333;
	}

	.detail-header {
		display: flex;
		align-items: center;
		margin-top: 10px;
		padding: 0 15px;

		.detail-header__logo {
			flex-shrink: 0;
			width: 40px;
			height: 40px;
			border-radius: 50%;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.detail-header__content {
			width: 100%;
			padding-left: 10px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			font-size: 12px;

			.detail-header__content-title {
				font-size: 14px;
				color: #333;
			}

			.detail-header__content-info {
				color: #999;

				text {
					margin-right: 10px;
				}
			}
		}
		.detail-header__button {
			padding: 0 15px;
			flex-shrink: 0;
			height: 30px;
			line-height: 30px;
			border-radius: 5px;
			font-size: 12px;
			color: #fff;
			background-color: $mk-base-color;
		}
	}

	.detail-content {
		margin-top: 20px;
		min-height: 500px;
		.detail-html {
			padding:0 15px;
		}
		.detail-comment {
			margin-top: 30px;
			.comment-title {
				padding: 10px 15px;
				font-size: 14px;
				color: #666;
				border-bottom: 1px #f5f5ff solid;
			}
			.comment-content {
				padding: 0 15px;
				border-top: 1px #eee solid;
			}
		}
	}

	.detail-bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		width: 100%;
		height: 44px;
		border-top: 1px #f5f5f5 solid;
		background-color: #fff;
		box-sizing: border-box;

		.detail-bottom__input {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-left: 10px;
			padding: 0 10px;
			width: 100%;
			height: 30px;
			border: 1px #ddd solid;
			border-radius: 5px;

			text {
				font-size: 14px;
				color: #999;
			}
		}

		.detail-bottom__icons {
			display: flex;
			flex-shrink: 0;
			padding: 0 10px;

			.detail-bottom__icons-box {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 44px;
			}
		}
	}
	

</style>

