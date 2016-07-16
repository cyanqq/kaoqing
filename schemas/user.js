var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
	name:{
		type:String,
		unique:true,
	},
	password:{
		type:String,
	},
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

UserSchema.pre('save',function(next){
	var user = this
	if(this.isNew){
		this.meta.createAt = this.meta.updataAt = Date.now()
	}else{
		this.meta.updataAt = Date.now();
	}
	bcrypt.genSalt(SALT_WORK_FACTOR,function(err, salt){
		if(err) return next(err)

		bcrypt.hash(user.password,null,null,function(err, hash){
			if(err) return next(err)
			user.password = hash
			
			next();
		})
	});
})

//实例方法
UserSchema.methods={
	comparePassword:function(_password, cb){
		bcrypt.compare(_password,this.password,function(err,isMatch){
			if(err) return cb(err)
			cb(null, isMatch)
		})
	}
}

//静态方法 模型可调用
UserSchema.statics = {
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

module.exports = UserSchema