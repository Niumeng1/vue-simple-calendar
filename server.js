/*
 * @Description: node启动express站点装载dist发布文件，用于发布代码的测试
 * @Author: 牛猛
 * @Date: 2021-10-09 11:29:58
 * @FilePath: \remotesesing-front-vue2\server.js
 */
var express = require("express");
// var proxy = require('http-proxy-middleware')
var app = express();
/**
 * 线上监听的端口配置
 */
var port = 8080;
console.log("站点已启动：" + "http://localhost:" + port);
app.use(express.static("dist")).listen(port);
// Add middleware for http proxying
// 可以手动调用server.close();来关闭站点

/**
 * 线上接口重定向配置
 * @type{HPM}
 */
//var apiProxy=proxy('/api',
//    {
//target:'http://39.100.6.81:20002/',changeOrigin:true
//   }
//)
//将服务器代理到localhost:8080端口上[本地服务器为localhost:3000]
//app.use('/api/*', apiProxy)
