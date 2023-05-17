import { defineConfig,loadEnv, ConfigEnv, UserConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { createHtmlPlugin } from "vite-plugin-html";
const path = require("path")
import htmlConfig from "vite-plugin-html-config";
// Use this config file to build the libary


	export default defineConfig( {

	base: "./",
	plugins: [
		vue(),
			createHtmlPlugin({
				inject: {
					data: {
						title: 'cs'
					}
				}
			}),
			htmlConfig({
				headScripts: [
				
					{
						src:'./config/global.js',
					}
				],
			}),
		
			
			// * EsLint 报错信息显示在浏览器界面上
		
	
	],
	build: {
		sourcemap: false,
		outDir: "dist",
		// sourcemap: true,//生产环境下是否生成sourcemap
		minify: "esbuild",
		// lib: {
		// 	entry: path.resolve(__dirname, "lib/main.ts"),
		// 	name: "CalendarView",
		// },
		chunkSizeWarningLimit: 1500,
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled into your library
			output: {
				// Static resource classification and packaging
				chunkFileNames: "assets/js/[name]-[hash].js",
				entryFileNames: "assets/js/[name]-[hash].js",
				assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
			}
		},
	},
	server: {
		// 服务器主机名，如果允许外部访问，可设置为 "0.0.0.0"
		host: "0.0.0.0",
		port: 2000,
		open: true,
		cors: true,
		// 跨域代理配置
		proxy: {

			"/api": {
				//nginx的api
				target: "http://localhost:3000/",
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, "")
			}
		}
	},

});
