// 基础配置类
let _config = {
  // host : 'http://localhost:8086/api/',
   host: 'https://miniprogram.onesmart.org/api/',
  // 答题倒记时
  time: 10,
  // 答题倒记进度条
  time_percent: 0,
  // 倒记时的全局setInvael变量
  down_time_tag: [],
  // 每道题的默认分值
  score: 20,
  //tap间隔触碰时间变量
  tap_time: 0,
  tap_time_min: 1000,
  // 5题积分多少过关
  score_pass:   70,
  // cache 标记
  cache_tag : 'AC_OPENID',
  power_code: {
    'max_理科': '但是你已站在科技的巅峰',
    'min_理科': '虽然你毫无逻辑可言',
    'max_文科': '但是你学富五车啊',
    'min_文科': '虽然你的想象力有点羞涩',
    'max_生活': '但是你处处引领潮流',
    'min_生活': '虽然你不是生活通',
    'max_娱乐': '但是你已站在流行的最前沿',
    'min_娱乐': '虽然你与时尚弄潮儿还有一定的差距',
    'max_英语': '但是你很懂歪果仁',
    'min_英语': '虽然你不太懂歪果仁的语言',
    'max_外语': '但是你很懂歪果仁',
    'min_外语': '虽然你不太懂歪果仁的语言',
    'max_语文': '但是你文思敏捷啊',
    'min_语文': '虽然你的文学细胞有点少',
    'max_数学': '但是你勤于思考啊',
    'min_数学': '虽然你的逻辑思维尚未觉醒'
  }
};
export default {
  app: getApp(),
  // 包装全局配置类
  config: _config,
  // 基础req方法
  request(data, func) {
    let url = data.url;
    delete data.url;
    wx.request({
      url: this.config.host + url,
      data: data,
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        func(res);
      }
    });
    return;
  },
  get_api_setting: (url, data) => {
    return data.url = url, data;
  },
  share(func = null) {
    return {
      title: '你尽管答，全对算我输',
      imageUrl: getApp().cdn + '/share_kv.jpg',
      path: '/pages/app/home/home',
      success() {
        // getApp().aldstat.sendEvent('分享成功');
        console.log('分享成功');
        if (func) {
          func();
        }
      }
    }
  }
};