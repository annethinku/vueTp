<template>
  <div>
    <van-nav-bar title="欢投圈" left-arrow @click-left="returnPrev" />
    <div class="wrap">
      <div class="fill fill_title">
        <input type="text" placeholder="投票标题" v-model="title" />
      </div>
      <div class="fill">
        <input type="text" placeholder="补充描述(选填)" v-model="desc" />
      </div>
      <div class="imgflex">
        <div class="upload_img" v-for="(item,index) in editimgs" :key="index">
          <div class="delete" @click="removeImg" :data-index="index">-</div>
          <img :src="item" />
        </div>
        <van-uploader v-model="groupimgs" multiple :max-count="3" :after-read="uploadImgs" />
      </div>
      <div class="fill_flex" v-for="(item,index) in options" :key="index">
        <div :data-index="index" class="del" @click="delete_fill"></div>
        <div class="fill_input">
          <input
            type="text"
            :placeholder="item.text"
            :data-index="index"
            :data-id="item.id"
            :data-dnum="item.is_delete"
            v-model="item.title"
          />
        </div>
      </div>
      <div class="add_fill" @click="add_fill">
        <div class="icon"></div>
        <span>添加选项</span>
      </div>
    </div>
    <div class="wrap2">
      <div class="flex_bet">
        <div class="label">截至日期</div>
        <div @click="showPopup" class="select_date">{{curtime}}</div>
        <van-popup v-model="show">
          <van-datetime-picker
            v-model="currentDate"
            type="datetime"
            :min-date="minDate"
            :max-date="maxDate"
            style="width:320px;"
            @confirm="timeSure"
            @cancel="timeCancel"
          />
        </van-popup>
      </div>
      <div class="flex_bet" v-if="!bid">
        <div class="label">是否多选</div>
        <van-switch v-model="isChoose" class="select_date" />
      </div>
      <div class="flex_bet">
        <div class="label">匿名投票</div>
        <van-switch v-model="isNm" class="select_date" />
      </div>
      <div class="flex_bet">
        <div class="label">展示在投票广场</div>
        <van-switch v-model="isZs" class="select_date" />
      </div>
    </div>
    <button class="complete" @click="completed">完成</button>
    <image-clipper
      ref="clipper"
      v-show="visible"
      :img="imgUrl"
      :clipper-img-width="320"
      :clipper-img-height="160"
      @ok="sure"
    ></image-clipper>
  </div>
</template>
<script>
import Vue from "vue";
import imageClipper from "../imageClipper/index";
Vue.use(imageClipper);
export default {
  data() {
    return {
      title: "",
      desc: "",
      grimgs: "",
      groupimgs: [],
      isChoose: 0,
      isNm: 0,
      isZs: 0,
      bid: 0,
      minHour: 10,
      maxHour: 20,
      minDate: new Date(),
      maxDate: new Date(2050, 10, 1),
      currentDate: new Date(),
      editimgs: [],
      options: [
        {
          text: "选项",
          img: ""
        },
        {
          text: "选项",
          img: ""
        }
      ],
      show: false,
      curtime: 0,
      bid: null,
      deleteArr: "",
      visible: false,
      imgUrl: ""
    };
  },
  mounted() {
    this.getCurtime();
    let time2 = new Date().Format("yyyy-MM-dd HH:mm");
    this.curtime = time2;
    // 编辑
    if (this.$route.query.id) {
      let trd_session = this.$cookies.get("trd_session")
        ? this.$cookies.get("trd_session")
        : "";
      this.bid = this.$route.query.id;
      this.$axios({
        url:
          this.API2 +
          "/Vote/tpInfo?" +
          "trd_session=" +
          trd_session +
          "&" +
          this.rt,
        params: {
          id: this.bid
        }
      }).then(res => {
        let info = res.data.info.info;
        let imgarr = info.desc_imgs ? info.desc_imgs.split(",") : "";
        let time = timestampToTime(info.endtime);
        this.title = info.title;
        this.desc = info.desc;
        this.grimgs = info.desc_imgs;
        this.editimgs = imgarr;
        this.options = info.options;
        this.isChoose = info.is_multi == 1 ? true : false;
        this.isNm = info.is_niming == 1 ? true : false;
        this.isZs = info.is_open == 1 ? true : false;
        this.curtime = time;
      });
    }
  },
  methods: {
    sure(data) {
      this.img = "data:image/jpeg;base64," + this.$refs.clipper.getBase64(data);
      this.visible = false;
    },
    add_fill() {
      let arr = this.options;
      arr.push({
        text: "选项",
        img: ""
      });
      this.options = arr;
    },
    // 完成
    completed: function() {
      // title 标题
      // desc 描述
      // endtime  结束时间
      // is_multi 是否多选  0否  1是
      // is_open  是否展示  0否  1 是
      // is_niming  是否允许匿名  0 否 1是
      // type 1图文  2文字
      // desc_imgs  描述图片
      // options 选项 img title
      let that = this;
      let params = {
        title: "",
        desc: "",
        endtime: "",
        is_multi: 0,
        is_niming: 0,
        is_open: 0,
        type: 1,
        desc_imgs: "",
        id: null,
        options: ""
      };
      let url = "";
      let str = "";
      let trd_session = this.$cookies.get("trd_session")
        ? this.$cookies.get("trd_session")
        : "";
      params.title = that.title;
      params.desc = that.desc;
      params.endtime =
        new Date(that.curtime.replace(/-/g, "/")).getTime() / 1000;
      params.is_multi = that.isChoose ? 1 : 0;
      params.is_niming = that.isNm ? 1 : 0;
      params.is_open = that.isZs ? 1 : 0;
      params.desc_imgs = that.grimgs;
      if (that.bid) {
        url = "Vote/updateVote";
        params.id = that.bid;
        params.options = JSON.stringify(
          that.deleteArr ? that.options.concat(that.deleteArr) : that.options
        );
        str = "修改投票成功";
      } else {
        url = "Vote/createVote";
        params.options = JSON.stringify(that.options);
        str = "创建投票成功";
      }
      if (
        !params.title ||
        !params.desc ||
        params.options.length <= 0 ||
        !that.options[0].title
      ) {
        that.$toast("请将信息填写完整");
        return false;
      }
      that
        .$axios({
          url:
            that.API2 +
            url +
            "?" +
            "trd_session=" +
            trd_session +
            "&" +
            this.rt,
          params
        })
        .then(res => {
          if (res.data.status == 1) {
            that.$toast(str);
            setTimeout(() => {
              that.$router.push({
                path: "/detail",
                query: { id: that.bid ? that.bid : res.data.info }
              });
            }, 1000);
          } else {
            if (res.data.info == "unlogin" && is_weixn()) {
              location.href =
                "https://api.9xy.cn/Tp/member/h5Login?rt=h5&pname=edit&path=" +
                location.href;
            } else if (res.data.info != "unlogin" && is_weixn()) {
              this.$toast(res.data.info);
            } else {
              // if (this.debug == "debug=1") {
              //   this.$myLogin();
              //   this.completed();
              // } else {
              this.$toast("此功能需要在微信浏览器中使用");
              // }
            }
          }
        });
    },
    // 删除图片
    removeImg: function(e) {
      let index = e.toElement.dataset.index;
      let that = this;
      let grimgs = "";
      that.editimgs.splice(index, 1);
      for (var i = 0; i < that.editimgs.length; i++) {
        grimgs = (grimgs ? grimgs + "," : "") + that.editimgs[i];
      }
      that.grimgs = grimgs;
    },
    delete_fill: function(e) {
      let arr = this.options;
      let deleteArr = this.deleteArr ? this.deleteArr : [];
      let index = e.toElement.dataset.index;
      arr[index].is_delete = 1;
      deleteArr.push(arr[index]);
      arr.splice(index, 1);
      this.options = arr;
      this.deleteArr = deleteArr;
    },
    returnPrev() {
      this.$router.go(-1);
    },
    changeOptions: function(e) {
      console.log(e);
      // let index = e.currentTarget.dataset.index;
      // that.data.options[index].title = e.detail.value;
      // that.setData({
      //   options: that.data.options
      // });
    },
    uploadImgs(e) {
      //通过FormData构造函数创建一个空对象
      let formdata = new FormData();
      //可以通过append()方法来追加数据
      formdata.append("file", e.file);
      this.$axios.post(this.API2 + "Public/upload", formdata).then(res => {
        console.log(res);
        this.grimgs =
          (this.grimgs ? this.grimgs + "," : "") + res.data.info.uri;
        console.log(res.data.info.uri);
      });
    },
    showPopup() {
      this.show = true;
    },
    timeSure(val) {
      this.curtime = val.Format("yyyy-MM-dd HH:mm");
      this.timeCancel();
    },
    timeCancel() {
      this.show = false;
    },
    getCurtime() {
      // 对Date的扩展，将 Date 转化为指定格式的String
      // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
      // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
      // 例子：
      // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
      // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
      Date.prototype.Format = function(fmt) {
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "H+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          S: this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length)
            );
        return fmt;
      };
    }
  }
};
</script>
<style>
body {
  background-color: #f3f4f6;
  font-size: 0.28rem;
  color: #333;
}
.head {
  background-color: #e6e6e6;
  height: 4.6rem;
}
.head .priver {
  text-align: center;
  line-height: 4.6rem;
  font-size: 0.34rem;
  color: #b0b0b0;
  font-weight: bold;
}
.imgflex {
  display: flex;
  /* align-items: center; */
  flex-wrap: wrap;
  background-color: #fff;
  padding: 0 0.2rem 0.2rem;
  margin-top: 0.4rem;
}
.upload_img {
  width: 80px;
  height: 80px;
  margin-right: 0.2rem;
  /* margin-top: 0.2rem; */
  position: relative;
  border: 1px #e6e6e6 dashed;
}

.upload_img img {
  width: 100%;
  height: 100%;
  display: block;
}
.delete {
  width: 0.3rem;
  height: 0.3rem;
  border-radius: 50%;
  background: red;
  color: white;
  text-align: center;
  line-height: 0.2rem;
  font-size: 0.5rem;
  position: absolute;
  right: -0.1rem;
  top: -0.1rem;
}
.imgflex .add_img {
  margin-top: 0.2rem;
}
.add_img {
  width: 1.1rem;
  height: 1.1rem;
  background-color: #eeeeee;
  font-size: 0.2rem;
  text-align: center;
  color: #999;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.add_icon {
  width: 0.4rem;
  height: 0.04rem;
  background-color: #a7a7a7;
  margin-top: 0.36rem;
}
.add_icon::after {
  content: "";
  display: block;
  width: 0.04rem;
  height: 0.4rem;
  background-color: #a7a7a7;
  margin-left: 0.18rem;
  margin-top: -0.18rem;
}
.add_img .txt {
  display: block;
  margin-top: 0.24rem;
}
.wrap {
  background-color: #fff;
  padding: 0 0.4rem;
}
.fill {
  height: 1rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f4f5f8;
  padding-top: 0.3rem;
}
.fill input {
  flex: 1;
  height: 0.8rem;
  font-size: 0.32rem;
  border: none;
}
.fill_title input {
  font-size: 0.44rem;
  font-weight: bold;
  border: none;
}
.place1 {
  font-size: 0.44rem;
  font-weight: bold;
  color: #dbdde3;
}
.place2 {
  font-size: 0.32rem;
  color: #dbdde3;
}
.fill_flex {
  height: 1rem;
  display: flex;
  align-items: center;
  margin-top: 0.2rem;
}
.del {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background-color: #eb5f59;
  margin-right: 0.2rem;
}
.del::after {
  content: "";
  display: block;
  width: 0.2rem;
  height: 0.04rem;
  background-color: #fff;
  margin: 0.18rem auto 0;
}
.fill_input {
  height: 1rem;
  border-bottom: 1px solid #f4f5f8;
  flex: 1;
  display: flex;
  align-items: center;
}
.fill_input input {
  height: 0.8rem;
  flex: 1;
  border: none;
}
.place3 {
  color: #dbdde3;
}
.add_fill {
  display: flex;
  align-items: center;
  padding: 0.4rem 0;
  color: #3a6be9;
}
.add_fill .icon {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background-color: #3a6be9;
  position: relative;
  margin-right: 0.2rem;
}
.add_fill .icon::after {
  content: "";
  width: 0.2rem;
  height: 0.04rem;
  display: block;
  background-color: #fff;
  margin: 0.18rem auto 0;
}
.add_fill .icon::before {
  content: "";
  width: 0.04rem;
  height: 0.2rem;
  display: block;
  background-color: #fff;
  position: absolute;
  left: 50%;
  margin-left: -0.02rem;
  top: 0.1rem;
}
.wrap2 {
  background-color: #fff;
  margin-top: 0.5rem;
  padding: 0 0.4rem;
}
.flex_bet {
  height: 1rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eaeaea;
}
.flex_bet .select_date {
  margin-left: auto;
  /* margin-right: 0.4rem; */
}
.flex_bet .picker {
  color: #b9bdc8;
}
.flex_bet .label {
  font-weight: bold;
  font-size: 0.3rem;
}
.flex_bet .switch {
  margin-left: auto;
  margin-right: 0;
}
.flex_bet:last-child {
  border-bottom: none;
}
.complete {
  width: 6.7rem;
  height: 0.8rem;
  background-color: #3a6be9;
  color: #fff;
  line-height: 0.8rem;
  font-size: 0.34rem;
  margin: 0.5rem auto;
  display: block;
}
</style>

