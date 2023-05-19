/*
 * @Description: 
 * @Author: 牛猛
 * @Date: 2023-05-19 14:58:27
 * @LastEditTime: 2023-05-19 14:59:26
 * @LastEditors: nm
 * @FilePath: \vue-simple-calendar\src\utils\dataUtils.ts
 */
export const dataUtils = {
    uuid: () => {  //uuid
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      },
}