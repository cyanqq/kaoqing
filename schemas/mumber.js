var mongoose = require('mongoose');

var MumberSchema = new mongoose.Schema({
	name: String,
	type: String,
	duty: String,
	studentid: Number,
	imageUrl: String,
	summary:String,
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updataAt:{
			type:Date,
			default:Date.now()
		}
	},
})

MumberSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updataAt = Date.now()
	}else{
		this.meta.updataAt = Date.now();
	}

	next();
})

MumberSchema.statics = {
	fetch: function(cb){
		return this
			.find({})
			.sort('meta.updataAt')
			.exec(cb)
	},
	findById: function(id, cb){
		return this
			.findOne({_id:id})
			.exec(cb)
	}
}

module.exports = MumberSchema