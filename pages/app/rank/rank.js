const app = getApp().globalData
import account_api from '../../lib/api/account';
import bt from '../../lib/bt'
import setting from '../../lib/setting'

Page({
  data: {
    grade_checked: false,
    all_rank_list: [],
    myrank: "-",
    myavatarURL: "",
    mynickName: "-",
    myScore: "无排位",
    ranklist: [],
    ranklist_data: []
  },
  onLoad: function () {
    // bt.log('rank.index > onload');
    account_api.get_rank({
      grade: app.userInfo.grade || null,
      account_id: app.userInfo.account_id
    }, res => {
      this.data.all_rank_list = res.data;
      this.setData({ ranklist: this.data.all_rank_list.world_rank.list });
      if (!isNaN(app.userInfo.grade)) {
        // bt.log('grade_check');
        this.setData({ grade_checked: true });
        this.setData({ ranklist: this.data.all_rank_list.grade_rank.list });
      }
      // 过滤前3名
      this.rank_filter_bind(this.data.ranklist);
      // 如果我有挑战记录,则更新我的排名
      if (app.userInfo.role && app.userInfo.role.hasOwnProperty('id')) {
        this.my_rank('grade');
      }
    });
  },
  rank_filter_bind(list) {
    if (list) {
      this.data.ranklist_data = list.filter((item, index) => {
        return index > 2 && index < 20;
      })
      this.setData({ ranklist_data: this.data.ranklist_data });
    }
  },
  rank_change(e) {
    // 如果当前没有选择年级
    // bt.log(app.userInfo);
    let pass = true;
    if (app.userInfo){
      if (!app.userInfo.hasOwnProperty('role')) {
        pass = false;
      } else if (app.userInfo.role.length == 0) {
        pass = false;
      }
    }
    if (!pass) {
      bt.toast('当前没有选择年级,没有排位信息~', 2000);
      this.setData({ grade_checked: false });
      return;
    }
    let value = e.detail.value;
    if (value == 'grade') {
      this.rank_filter_bind(this.data.all_rank_list.grade_rank.list);
      this.setData({ ranklist: this.data.all_rank_list.grade_rank.list });
    } else {
      this.rank_filter_bind(this.data.all_rank_list.world_rank.list);
      this.setData({ ranklist: this.data.all_rank_list.world_rank.list });
    }
    this.my_rank(value);
  },
  // 查看我的排名
  my_rank(opt = 'grade') {
    let my = this.data.all_rank_list.grade_rank.my;
    if (opt == 'world') {
      my = this.data.all_rank_list.world_rank.my;
    }
    // 更新排名
    if (my) {
      var data = {};
      data.myScore = my.info.score + '分';
      data.mynickName = my.info.nickname;
      data.myrank = my.sort + 1;
      data.myavatarURL = my.info.avatarurl;
      this.setData(data);
    }
  }
})