/*
 * @Description: 
 * @Author: 牛猛
 * @Date: 2023-05-16 17:53:33
 * @LastEditTime: 2023-05-16 21:57:10
 * @LastEditors: nm
 * @FilePath: \vue-simple-calendar\src\api\index.ts
 */
import http from './request'

export  const  getJSONData = () => {
  return  http.get(GlobalConfig.ip+ `/readJSON`, {});
}

export const writeJSONData = (params: object) => {
	return http.post(GlobalConfig.ip+`/writeJSON`, params);
};