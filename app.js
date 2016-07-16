var express = require('express');
var path = require('path');
var mongoose = require('mongoose')
var port = process.env.PORT || 3000
var bodyParser = require('body-parser')
var Member = require('./models/mumber.js')
var User = require('./models/user')
var app = express();
var _= require('underscore');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session); 

var dbUrl = 'mongodb://localhost/ali'
mongoose.connect(dbUrl)

app.set('views','./views/pages'); 

app.set('view engine','jade');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({  
	secret: 'imooc',  
	store: new MongoStore({    
	url: dbUrl,    
	collection: 'sessions'  
	}),  
	resave: false,  
	saveUninitialized: true 
}));  

app.locals.moment = require('moment')
app.listen(port)
console.log('server start') 

//pre handle user
app.use(function(req, res,next){
	var _user = req.session.user;

	if(_user){
		app.locals.user = _user;
	}
	return next();
})
//index page
app.get('/',function(req,res){

	Member.fetch(function(err,members){
		 if(err){
		 	console.log(err);
		 }

		 res.render('index',{
		 	title:'实验室考勤系统',
		 	members:members
		 })
	})
})

app.get('/member/:id',function(req,res){
	var id = req.params.id;

	Member.findById(id, function(err, member){
		res.render('detail',{
			title:'详情' + member.name,
			member: member
		})
	})
	
})

app.get('/admin/member',function(req,res){
	res.render('admin',{
		title:'cyan后台录入',
		member:{
			name:'',
			type:'',
			duty:'',
			imageUrl:'',
			studentid:'',
			summary:'',
			duty:''
		}
	})
})

//admin update
app.get('/admin/update/:id',function(req,res){
	var id = req.params.id;
	console.log(id);
	if(id){
		Member.findById(id,function(err, member){
			res.render('admin',{
				title: '后台更新页',
				member:member
			})
		})
	}
})

//admin post movie
app.post('/admin/member/new', function(req,res){
	var id = req.body.member._id;

	var memberObj = req.body.member
	var _member
	if(id !== 'undefined'){
		Member.findById(id, function(err, member){
			if(err){
				console.log(err)
			}

			_member = _.extend(member, memberObj);
			_member.save(function(err, member){
				if(err){
					console.log(err)
				}

				res.redirect('/member/'+member._id)
			})
		})
	}else{
		_member = new Member({
			name: memberObj.name,
			type: memberObj.type,
			studentid: memberObj.studentid,
			summary: memberObj.summary,
			imageUrl: memberObj.imageUrl,
			duty: memberObj.duty,
		})

		_member.save(function(err, member){
			if(err){
				console.log(err)
			}

			res.redirect('/member/'+member._id)
		})
	}
})

app.get('/admin/list',function(req,res){
	Member.fetch(function(err,mumbers){
		 if(err){
		 	console.log(err);
		 }

		 res.render('list',{
		 	title:'成员列表页',
		 	mumbers:mumbers
		 })
	})
})

//list delete
app.delete('/admin/list',function(req,res){
	var id = req.query.id
	console.log(id)

	if(id){
		Movie.remove({_id: id},function(err,movie){
			if(err){
				console.log(err)
			}else{
				res.json({success:1})
			}
		})
	}
})

//signup
app.post('/user/signup',function(req,res){
	var _user = req.body.user
	//findone mongodb返回第一条记录关闭游标
	User.findOne({name:_user.name},function(err,user){
		if(err){
			console.log(err)
		}
		if(user){
			return res.redirect('/admin/userlist')
		}
		else{
			var user = new User(_user)
			user.save(function(err,user){
				if(err){
					console.log(err)
				}
				return res.redirect('/admin/userlist')
				console.log(user)
			})
		}
	})
})

// usrlist page
app.get('/admin/userlist',function(req,res){
	User.fetch(function(err,users){
		 if(err){
		 	console.log(err);
		 }

		 res.render('userlist',{
		 	title:'用户列表页',
		 	users:users
		 })
	})
})

//signin
app.post('/user/signin',function(req,res){
	var _user = req.body.user
	var name = _user.name
	var password = _user.password

	console.log(password)

	User.findOne({name:name},function(err,user){
		if(err){
			console.log(err)
		}
		if(!user){
			return res.redirect('/')
		}
		user.comparePassword(password,function(err,isMatch){
			if(err){
				console.log('err'+err)
			}

			if(isMatch) {
				req.session.user = user;

				return res.redirect('/')
			}
			else{
				console.log('password error')
			}
		})
	})
})

//logout
app.get('/logout',function(req, res){
	 delete req.session.user;
	 delete app.locals.user;
	 res.redirect('/');
})