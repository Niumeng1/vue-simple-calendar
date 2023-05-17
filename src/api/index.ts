/*
 * @Description: 
 * @Author: 牛猛
 * @Date: 2023-05-16 17:53:33
 * @LastEditTime: 2023-05-17 13:04:45
 * @LastEditors: nm
 * @FilePath: \vue-simple-calendar\src\api\index.ts
 */
import http from './request'

export  const  getJSONData = (params:string) => {
  return  http.get(GlobalConfig.ip+ `/readJSON?name=`+params, {});
}

export const writeJSONData = (params: object) => {
	return http.post(GlobalConfig.ip+`/writeJSON`, params,{headers:"nm"});
};