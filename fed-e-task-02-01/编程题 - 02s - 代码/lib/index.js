// 实现这个项目的构建任务

const { src, dest, parallel, series, watch } = require("gulp");

const del = require("del");

const browserSync = require("browser-sync");

// 自动加载插件
const loadPlugins = require("gulp-load-plugins");

const plugins = loadPlugins();
const bs = browserSync.create(); // create方法用于创建一个服务器
const cwd = process.cwd(); // 返回命令行所工作的目录
let config = {
  build: {
    src: "src",
    dist: "dist",
    temp: "temp",
    public: "public",
    paths: {
      styles: "assets/styles/*.scss",
      scripts: "assets/scripts/*.js",
      pages: "*.html",
      images: "assets/images/**",
      fonts: "assets/fonts/**",
    },
  },
};

try {
  const loadConfig = require(`${cwd}/pages.config.js`);
  config = Object.assign({}, config, loadConfig);
} catch (e) {
  console.log(e);
  throw new Error(e);
}

// style 任务，处理 scss 文件
// 保留原始目录结构 base:'src'
// 通过gulp-sass插件转换sass文件
// 展开css代码：outputStyle: "expanded"

const style = () => {
  return src(config.build.paths.styles, {
    base: config.build.src,
    cwd: config.build.src,
  })
    .pipe(plugins.sass({ outputStyle: "expanded" }))
    .pipe(dest(config.build.temp));
};

// script 任务，处理 js脚本 文件
// 保留原始目录结构 base:'src'
// 通过gulp-babel,@babel/core,@babel/preset-env插件转换js文件
// babel只是一个平台，需要配置presets: ["@babel/preset-env"]

const script = () => {
  return src(config.build.paths.scripts, {
    base: config.build.src,
    cwd: config.build.src,
  })
    .pipe(plugins.babel({ presets: [require("@babel/preset-env")] }))
    .pipe(dest(config.build.temp));
};

// page 任务，处理 html 文件
// 保留原始目录结构 base:'src'
// 通过gulp-swig插件编译html文件
// swig中的data参数用来传递数据

const page = () => {
  return src(config.build.paths.pages, {
    base: config.build.src,
    cwd: config.build.src,
  })
    .pipe(plugins.swig({ data: config.data }))
    .pipe(dest(config.build.temp));
};

// image任务，处理图片文件
// 保留原始目录结构 base:'src'
// 通过gulp-imagemin插件压缩图片文件

const image = () => {
  return (
    src(config.build.paths.images, {
      base: config.build.src,
      cwd: config.build.src,
    })
      //// ？？压缩图片不成功
      // .pipe(plugins.imagemin())
      .pipe(dest(config.build.dist))
  );
};

// font任务，处理字体文件
// 保留原始目录结构 base:'src'
// 通过gulp-imagemin插件处理字体文件

const font = () => {
  return src(config.build.paths.fonts, {
    base: config.build.src,
    cwd: config.build.src,
  })
    .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist));
};

// extra任务，处理其他文件
// 将public下的所有文件拷贝至目标目录
const extra = () => {
  return src("**", {
    base: config.build.public,
    cwd: config.build.public,
  }).pipe(dest(config.build.dist));
};

// 清除任务
const clean = () => {
  return del([config.build.dist, config.build.temp]);
};

// 服务器
// watch 监视文件变化
const serve = () => {
  watch(config.build.paths.styles, { cwd: config.build.src }, style);
  watch(config.build.paths.scripts, { cwd: config.build.src }, script);
  watch(config.build.paths.pages, { cwd: config.build.src }, page);
  //   watch("src/assets/images/**", image);
  //   watch("src/assets/fonts/**", font);
  //   watch("public/**", extra);

  watch(
    [config.build.paths.images, config.build.paths.fonts],
    { cwd: config.build.src },
    bs.reload
  );

  watch(["**"], { cwd: config.build.public }, bs.reload);

  // init 初始化服务器配置
  bs.init({
    notify: false, // 关闭提示
    // files: "dist/**", // 监视需要更新的文件
    port: 10086,
    server: {
      baseDir: [config.build.temp, config.build.src, config.build.public],
      routes: { "/node_modules": "node_modules" },
    },
  });
};

// 自动处理 html 中的构建注释，开始标签和结束标签之间的文件，自动打包到一个文件里
const useref = () => {
  return (
    // ？？替换不会生成打包文件
    src(`${config.build.temp}/${config.build.paths.pages}`, {
      base: config.build.temp,
    })
      .pipe(plugins.useref({ searchPath: [config.build.temp, "."] }))
      // 此处会有三种类型，html，js，css,判断类型，分别做不同的操作
      .pipe(plugins.if(/\.js$/, plugins.uglify()))
      .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
      .pipe(
        plugins.if(
          /\.html$/,
          plugins.htmlmin({
            collapseWhitespace: true, // 压缩HTML
            minifyJS: true, // 压缩页面JS
            minifyCSS: true, // 压缩页面CSS
          })
        )
      )
      .pipe(dest(config.build.dist))
  );
};

// 编译任务
// parallel 并行处理
const compile = parallel(style, script, page);

// 处理所有文件
// series 串行处理
// 先执行chean操作，再进行编译
// 上线之前执行的任务
const build = series(
  clean, // 先compile，后useref
  parallel(series(compile, useref), image, font, extra)
);

// 开发阶段执行的任务
const develop = series(compile, serve);

module.exports = {
  build,
  clean,
  develop,
};
