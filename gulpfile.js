/**
 * Created by evenLok on 2015/04/17.
 */

// 引入 gulp
var gulp = require('gulp');
//var pngquant = require('imagemin-pngquant');  //处理png
//var jpegtran = require('imagemin-jpegtran');  //处理jpg

var plugins = require('gulp-load-plugins'),
    P = plugins();


//var fileName = __dirname.match(/\\([^\\]+)$/)[1];  //当前目录名
//配置参数
var path = {
    src: 'src/',
    dest: 'dist/'
};

gulp.task('sass-ignoreError', function() {
    gulp.src(path.src + 'css/*.scss')
        //.pipe(sass({ compass: true }))        //css排版成一行
        .pipe(P.plumber()) //忽略错误
        .pipe(P.compass({
            css: path.src + 'css',
            sass: path.src + 'css', //要编译的scss所在目录
            image: path.src + 'images/' //icon存放目录
            //generated_images_path: path.src + 'images/' //合并后的图片输出路径
        }))
        .pipe(P.sass())
        .pipe(gulp.dest(path.src + 'css'))
});


gulp.task('watch', function() {
    gulp.watch(path.src + 'css/**/*.scss', ['sass-ignoreError']);
});




/*--------------------------开发完毕后------------------------------------------*/

//清空dist
gulp.task('clean-dist', function (){
  return gulp.src(path.dest)
    .pipe(P.clean());
});

//sass编译,错误会报错
gulp.task('sass-src', function(){
  gulp.src( path.src + '**/*.scss' )   //拿到源文件
    .pipe(P.sass())
    .pipe(gulp.dest( path.src ));      //输出
});

//copy所有文件到dist
gulp.task('copy-src', function () {
  return gulp.src(path.src + '**/*')
    .pipe(gulp.dest(path.dest));
}); 

//清除dist中的sass
gulp.task('cleanSass-dist',  function (){
 return gulp.src(path.dest + '**/*.scss')
    .pipe(P.clean());
});

//压缩dist中的css
gulp.task('cssMin-dist', function(){
  gulp.src( path.dest + '**/*.css' )   //拿到源文件
    .pipe(P.minifyCss(/*{keepBreaks:true}*/))  
    .pipe(gulp.dest( path.dest ));      //输出
});

//压缩dist中的js
gulp.task('jsMin-dist', function(){
  gulp.src( path.dest + '**/*.js' )   //拿到源文件
    .pipe(P.uglify())   
//  .pipe(P.rename({suffix: '.min'}))  //重命名              //压缩
    .pipe(gulp.dest( path.dest ));    //输出
});
//压缩图片
gulp.task('imgMin-dist', function() {
  gulp.src( path.dest + '**/*.jpg' )  //拿到源文件
    .pipe(P.imagemin({
      // progressive: true,
      // interlaced: true,
      use: [pngquant(), jpegtran()]   //压缩png,有的会自动转成png8
    }))          //压缩
    .pipe(gulp.dest( path.dest ));       //输出
});

gulp.task('zip', function () {
    gulp.src( path.dest + '**/*')
        .pipe(P.zip(fileName + '.zip'))    //压缩成.zip
        .pipe(gulp.dest('./'));
});

//构建发布用的代码,清空-->sass编译检查-->复制-->【删除.sass, 压缩css, 压缩js, 压缩图片】-->打包压缩成.zip
gulp.task('build', P.sequence(  //处理执行顺序
  'clean-dist',
  'sass-src',
  'copy-src',
    ['cleanSass-dist', 'cssMin-dist', 'jsMin-dist', 'imgMin-dist']
));




