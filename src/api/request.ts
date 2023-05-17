/*
 * @Description: 
 * @Author: 牛猛
 * @Date: 2023-05-15 10:29:32
 * @LastEditTime: 2023-05-17 13:09:47
 * @LastEditors: nm
 * @FilePath: \vue-simple-calendar\src\api\request.ts
 */
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from "axios";

// import { GlobalStore } from "@/stores";
// import { LOGIN_URL } from "@/config/config";
// * 请求响应参数(不包含data)
 interface Result {
	code: string;
	msg: string;
}

// * 请求响应参数(包含data)
 interface ResultData<T = any> extends Result {
	data: T;
}
const getName = () => {
	return localStorage.getItem("name");
}
const config = {
	// 默认地址请求地址，可在 .env.*** 文件中修改
	baseURL: import.meta.env.VITE_API_URL as string,
	// 设置超时时间（30s）
	timeout: 30000000,
	// 跨域时候允许携带凭证
	withCredentials: true
};

class RequestHttp {
	service: AxiosInstance;
	public constructor(config: AxiosRequestConfig) {
		// 实例化axios
		this.service = axios.create(config);

		/**
		 * @description 请求拦截器
		 * 客户端发送请求 -> [请求拦截器] -> 服务器
		 * token校验(JWT) : 接受服务器返回的token,存储到vuex/pinia/本地储存当中
		 */
		this.service.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => {
				// const globalStore = GlobalStore();
				// * 如果当前请求不需要显示 loading,在 api 服务中通过指定的第三个参数: { headers: { noLoading: true } }来控制不显示loading，参见loginApi
	
				if(config.headers ) config.headers.set("name", getName() as string);

				//if (config.headers && typeof config.headers?.set === "function") config.headers.set("token", token);
				return config;
			},
			(error: AxiosError) => {
				return Promise.reject(error);
			}
		);

		/**
		 * @description 响应拦截器
		 *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
		 */
		this.service.interceptors.response.use(
			(response: AxiosResponse) => {
				const { data } = response;
				// const globalStore = GlobalStore();
				// * 在请求结束后，并关闭请求 loading

				// * 登陆失效（code == 401）
				// if (data.code == ResultEnum.OVERDUE) {
				// 	ElMessage.error(data.msg);
				// 	globalStore.setToken("");
				// 	router.replace(LOGIN_URL);
				// 	return Promise.reject(data);
				// }
				// * 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
	
				// * 成功请求（在页面上除非特殊情况，否则不用在页面处理失败逻辑）
				return data;
			},
			async (error: AxiosError) => {
				const { response } = error;
			
				return Promise.reject(error);
			}
		);
	}

	// * 常用请求方法封装
	get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.get(url, { params, ..._object });
	}
	post<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.post(url, params, _object);
	}
	put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.put(url, params, _object);
	}
	delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
		return this.service.delete(url, { params, ..._object });
	}
	download(url: string, params?: object, _object = {}): Promise<BlobPart> {
		return this.service.post(url, params, { ..._object, responseType: "blob" });
	}
}

export default new RequestHttp(config);
