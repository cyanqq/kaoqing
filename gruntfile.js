module.exports = function(grunt){
	
	grunt.initConfig({
		watch:{
			jade:{
				files:['views/**'],
				options:{
					livereload:true //出现改动重启服务
				}
			},
			js:{
				files:['public/js/**','models/**/*.js','schemas/**/*.js'],
				// tasks:['jshint'],
				options:{
					livereload:true
				}
			}
		},

		nodemon:{//node自动重启	
			dev:{//开发环境
				options:{
					file:'app.js',//当前入口文件
					args:[],
					ignoreFiles:[
					'README.md','node_modules/**','.DS_Store'],
					watchedExtensions:['js'],
					// watchedFolders:['app','config'],
					watchedFolders:['./'],
					debug:true,
					delayTime:1, //如果有大批量文件编译 等待1毫秒
					env:{//运行环境
						PORT:3000
					},
					cwd: __dirname
				}
			}
		},

		concurrent:{
			tasks:['nodemon','watch'],
			options:{
				logConcurrentOutput: true
			}
		}
	})

	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-nodemon')
	grunt.loadNpmTasks('grunt-concurrent')

	grunt.option('force', true); //不因为警告终止任务
	grunt.registerTask('default',['concurrent'])
}