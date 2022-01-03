<template>
	<swiper class="home-swiper" :current="activeIndex" @change="change">
		<swiper-item v-for="(item,index) in tab" :key="index" class="swiper-item">
			<list-item :list="listCatchData[index]" :load="load[index]" @loadmore="loadmore"></list-item>
		</swiper-item>
	</swiper>
</template>

<script>
	import listItem from './list-item.vue'
	export default {
		name:"list",
		props:{
			tab:{
				type: Array,
				default() {
					return []
				}
			},
			activeIndex: {
				type: Number,
				default: 0
			}
		},
		components:{
			listItem
		},
		data() {
			return {
				list:[],
				listCatchData:{},
				load:{},
				pageSize:10
			};
		},
		created() {
			// this.getList(0)
			uni.$on('update_article',(e) => {
				if(e === 'follow') { 
					this.listCatchData = {}
					this.load = {}
					this.getList(this.activeIndex)
				}
			})
		},
		watch: {
			tab(newVal) {
				if(newVal.length === 0) return
				this.listCatchData = {}
				this.load = {}
				this.getList(this.activeIndex)
			}
		},
		methods:{
			change(e) {
				const {current} = e.detail
				this.$emit('change',current)
				// console.log(this.tab[current].name)
				
				if(!this.listCatchData[current] || this.listCatchData[current].length === 0){
					this.getList(current)
				}
			},
			getList(current) {
				if(!this.load[current]){
					this.load[current] = {
						page: 1,
						loading: 'loading'
					}
				}
				this.$api.get_list({
						name: this.tab[current].name,
						page:this.load[current].page,
						pageSize:this.pageSize
					})
					.then(res => {
					const {data} = res
					if(data.length === 0){
						let oldLoad = {} 
						oldLoad.loading = 'noMore'
						oldLoad.page = this.load[current].page
						this.$set(this.load,current,oldLoad)
						//强制渲染页面
						this.$forceUpdate()
						return 
					}
					let oldList = this.listCatchData[current] || [ ]
					oldList.push(...data) 
					console.log(data)
					
					//懒加载
					this.$set(this.listCatchData,current,oldList)
				}).catch(err => {
					console.log(err)
				})
			},
			loadmore() {
				//判断状态阻止加载
				if(this.load[this.activeIndex].loading === 'noMore') return 
				console.log('shangla')
				this.load[this.activeIndex].page++
				this.getList(this.activeIndex)
			}
		}
	}
</script>

<style lang="scss">
	.home-swiper {
		height: 100%;
		.swiper-item {
			height: 100%;
			overflow: hidden;
		}
	}
</style>
