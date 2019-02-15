// 题目接口

import setting from '../setting';

var get = setting;
var api = get.get_api_setting;
const app = getApp()

export default {
  get_rand(data, func) {
    return get.request(api('question/get_rand', data), func);
  },
  get_setting(func) {
    return get.request(api('setting/config', []), func);
  }
}