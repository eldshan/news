'use strict';
const db = uniCloud.database()
//聚合的操作符
const $ = db.command.aggregate
exports.main = async (event, context) => {
	
	// const list = await db.collection('article')
	// .field({
	// 	//false表示不返回这个字段
	// 	content:false
	// })
	// .get()
	const {
		user_id,
		name,
		page =1,
		pageSize = 10
		
		} = event
		
		let matchObj = {}
		if(name !== '全部') {
			matchObj = {
				classify: name
			}
		}
	const userinfo = await db.collection('user').doc(user_id).get()
	const article_likes_ids = userinfo.data[0].article_likes_ids
	
	//聚合：更精细化的处理数据 求和、分组、指定哪些字段
	const list = await db.collection('article')
		.aggregate()
		//追加字段
		.addFields({
			is_like: $.in(['$_id',article_likes_ids])
		})
		.match( matchObj)
		.project({
			content: false
		})
		.skip(pageSize*(page-1))
		.limit(pageSize)
		.end()
	
	//返回数据给客户端
	return { 
		code: 200,
		msg: '数据请求成功',
		data:list.data
	}
};
