<template>
  <div>
    <van-nav-bar title="欢投圈" />
    <div class="common-title" style="margin-top:0.2rem;">
      <span></span> 创建投票
    </div>
    <div class="one-sort flexbox">
      <div class="sortbox bg01" @click="jumpFabu">
        <span>活动评选</span>
        <img src="../../static/images/index1.jpg" style="width:0.84rem;height:0.61rem;" />
      </div>
      <div class="sortbox bg02" @click="jumpFabu">
        <span>图文投票</span>
        <img src="../../static/images/index2.jpg" style="width:0.65rem;height:0.77rem;" />
      </div>
      <div class="sortbox bg03" @click="jumpFabu">
        <span>问卷调查</span>
        <img src="../../static/images/index3.jpg" style="width:0.86rem;height:0.90rem;top:20%;" />
      </div>
      <div class="sortbox bg04" @click="jumpFabu">
        <span>文字投票</span>
        <img src="../../static/images/index4.jpg" style="width:0.65rem;height:0.79rem;" />
      </div>
    </div>
    <!-- 广告 -->
    <!--<div class='ad'>-->
    <!--流量主广告-->
    <!--</div>-->
    <div class="common-title">
      <span></span> 热门
    </div>
    <div class="hotlist">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoading" :immediate-check="false">
        <div class="hotli" v-for="(item,index) in list" :key="index">
          <router-link :to="{path:'/detail',query:{id:item.id}}">
            <div class="li-top flexbox">
              <div class="lit-left flexbox">
                <div class="tx">
                  <img :src="item.headimgurl" />
                </div>
                <div class="title">
                  <div>{{item.title}}</div>
                  <span>{{item.nickname}}</span>
                </div>
              </div>
              <div class="lit-right">{{item.cy_num}}人参与</div>
            </div>
            <div class="li-center">{{item.desc}}</div>
            <div class="li-bot" v-if="item.desc_imgs[0]!=''">
              <img :src="item2" v-for="(item2,index2) in item.desc_imgs" :key="index2" />
            </div>
          </router-link>
        </div>
      </van-list>
    </div>
    <!-- 客服按钮 -->
    <!-- <a class="contactBtn">
      <img src="../../static/images/wechat.png" />
      <div>客服</div>
    </a>-->
    <div style="text-align: center">
      <van-loading type="spinner" size="40px" v-if="showLoading" />
    </div>
  </div>
</template>
<script>
export default {
  name: "home",
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      showLoading: false,
      p: 1
    };
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    // 监听滚动事件
    // window.addEventListener("scroll", this.onScroll);
  },
  mounted() {
    this.getData();
  },
  methods: {
    onLoading() {
      this.loading = true;
      this.p=this.p+1;
      // 异步更新数据
      this.getData();
    },
    jumpFabu() {
      this.getUser();
    },
    getUser() {
      let that = this;
      let trd_session = this.$cookies.get("trd_session")
        ? this.$cookies.get("trd_session")
        : "";
      that
        .$axios({
          url:
            that.API2 +
            "Member/userCenter?" +
            "trd_session=" +
            trd_session +
            "&" +
            this.rt
        })
        .then(res => {
          if (res.data.status == 1) {
            // 登陆后再去发布
            this.$router.push({ path: "/edit" });
          } else {
            // that.$toast(res.data.info);
            if (res.data.info == "unlogin" && is_weixn()) {
              location.href =
                "https://api.9xy.cn/Tp/member/h5Login?rt=h5&pname=home&path=" +
                location.href;
            } else if (res.data.info != "unlogin" && is_weixn()) {
              this.$toast(res.data.info);
            } else {
              // if (this.debug == "debug=1") {
              //   this.$myLogin();
              //   this.getUser();
              // } else {
              this.$toast("此功能需要在微信浏览器中使用");
              // }
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    onScroll() {
      // 可滚动容器的高度
      let innerHeight = document.querySelector("#app").clientHeight;
      // 屏幕尺寸高度
      let outerHeight = document.documentElement.clientHeight;
      // 可滚动容器超出当前窗口显示范围的高度
      let scrollTop = document.documentElement.scrollTop;
      // scrollTop在页面为滚动时为0，开始滚动后，慢慢增加，滚动到页面底部时，出现innerHeight <= (outerHeight + scrollTop)的情况，严格来讲，是接近底部。
      console.log(
        "可滚动容器的高度:" + innerHeight,
        "屏幕尺寸高度:" + outerHeight,
        "可滚动容器超出当前窗口显示范围的高度:" + scrollTop
      );
      if (outerHeight + scrollTop >= innerHeight) {
        this.p = this.p + 1;
        // 加载更多操作
        this.getData();
      }
    },
    getData() {
      this.showLoading = true;
      this.$axios({
        url: this.API2 + "Vote/voteList?" + this.rt,
        params: { p: this.p }
      }).then(res => {
        // 加载状态结束
        this.loading = false;
        this.showLoading = false;
        if (res.data.info.list.length > 0) {
          for (var i = 0; i < res.data.info.list.length; i++) {
            res.data.info.list[i].desc_imgs = res.data.info.list[
              i
            ].desc_imgs.split(",");
            console.log(res.data.info.list[i].desc_imgs);
          }
          this.list = this.list
            ? this.list.concat(res.data.info.list)
            : res.data.info.list;
        } else {
          // 数据全部加载完成
          this.finished = true;
        }
      });
    }
  }
};
</script>
<style>
body {
  background: #fbfbfb;
}
@font-face {
  font-family: "my-icon";
  src: url("../../static/css/iconfont.ttf") format("truetype");
}
.my-icon {
  font-family: "my-icon";
}
.my-icon-extra::before {
  content: "\e600";
}
.common-title {
  font-size: 0.3rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}
.common-title span {
  width: 0.2rem;
  height: 0.2rem;
  border-radius: 50%;
  border: 0.06rem #118ef8 solid;
  display: inline-block;
  margin: 0 0.05rem 0 0.3rem;
  position: relative;
  top: 0.05rem;
}
.one-sort {
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 0.24rem;
}
.sortbox {
  width: 3.33rem;
  height: 1.57rem;
  border-radius: 0.2rem;
  margin: 0 0 0.2rem;
  font-size: 0.36rem;
  font-weight: bold;
  box-sizing: border-box;
  position: relative;
  color: white;
  text-shadow: 0 0 0.1rem gainsboro;
  letter-spacing: 0.02rem;
  overflow: hidden;
  padding: 0.2rem 0 0 0.5rem;
}
.sortbox img {
  position: absolute;
  top: 35%;
  right: 5%;
}
.sortbox.bg01 {
  background: #000000;
  background: -moz-linear-gradient(left top, #bebbfe 0%, #9f98ff 100%);
  background: -webkit-gradient(
    linear,
    left top,
    color-stop(0%, #bebbfe),
    color-stop(100%, #9f98ff)
  );
  background: -webkit-linear-gradient(left top, #bebbfe 0%, #9f98ff 100%);
  background: -o-linear-gradient(left top, #bebbfe 0%, #9f98ff 100%);
  background: -ms-linear-gradient(left top, #bebbfe 0%, #9f98ff 100%);
  background: linear-gradient(to left top, #bebbfe 0%, #9f98ff 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#bebbfe', endColorstr='#9f98ff',GradientType=0 );
}
:root .sortbox.bg02 {
  filter: none;
}
.sortbox.bg02 {
  background: #000000;
  background: -moz-linear-gradient(left top, #8ab6ff 0%, #4989ed 100%);
  background: -webkit-gradient(
    linear,
    left top,
    color-stop(0%, #8ab6ff),
    color-stop(100%, #4989ed)
  );
  background: -webkit-linear-gradient(left top, #8ab6ff 0%, #4989ed 100%);
  background: -o-linear-gradient(left top, #8ab6ff 0%, #4989ed 100%);
  background: -ms-linear-gradient(left top, #8ab6ff 0%, #4989ed 100%);
  background: linear-gradient(to left top, #8ab6ff 0%, #4989ed 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#8ab6ff', endColorstr='#4989ed',GradientType=0 );
}
:root .sortbox.bg02 {
  filter: none;
}
.sortbox.bg03 {
  background: #000000;
  background: -moz-linear-gradient(left top, #39eccc 0%, #86e7d4 100%);
  background: -webkit-gradient(
    linear,
    left top,
    color-stop(0%, #39eccc),
    color-stop(100%, #86e7d4)
  );
  background: -webkit-linear-gradient(left top, #39eccc 0%, #86e7d4 100%);
  background: -o-linear-gradient(left top, #39eccc 0%, #86e7d4 100%);
  background: -ms-linear-gradient(left top, #39eccc 0%, #86e7d4 100%);
  background: linear-gradient(to left top, #39eccc 0%, #86e7d4 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#39eccc', endColorstr='#86e7d4',GradientType=0 );
}
:root .sortbox.bg03 {
  filter: none;
}

.sortbox.bg04 {
  background: #000000;
  background: -moz-linear-gradient(left top, #01c1ff 0%, #95e7ff 100%);
  background: -webkit-gradient(
    linear,
    left top,
    color-stop(0%, #95e7ff),
    color-stop(100%, #4989ed)
  );
  background: -webkit-linear-gradient(left top, #01c1ff 0%, #95e7ff 100%);
  background: -o-linear-gradient(left top, #01c1ff 0%, #95e7ff 100%);
  background: -ms-linear-gradient(left top, #01c1ff 0%, #95e7ff 100%);
  background: linear-gradient(to left top, #01c1ff 0%, #95e7ff 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#01c1ff', endColorstr='#95e7ff',GradientType=0 );
}
:root .sortbox.bg04 {
  filter: none;
}

.hotlist {
  margin: 0 0.24rem;
}
.hotli {
  border-radius: 0.2rem;
  padding: 0.27rem 0 0;
  background: white;
  margin-bottom: 0.34rem;
  box-shadow: 0 0 0.1rem gainsboro;
  overflow: hidden;
}
.li-top {
  justify-content: space-between;
  align-items: center;
  padding: 0 0.24rem;
}
.lit-left {
  width: 70%;
  align-items: center;
}
.lit-left .tx {
  width: 0.68rem;
  height: 0.68rem;
  border-radius: 50%;
  overflow: hidden;
  background: gainsboro;
  margin-right: 0.1rem;
}
.lit-left .tx img {
  width: 100%;
  height: 100%;
}
.lit-left .title div {
  font-size: 0.28rem;
  color: #333;
  margin-bottom: 0.05rem;
  font-weight: bold;
}
.lit-left .title span {
  font-size: 0.24rem;
  color: #999;
}
.lit-right {
  font-size: 0.28rem;
  font-weight: bold;
}
.li-center {
  margin: 0.24rem;
  font-weight: bold;
  font-size: 0.28rem;
}
.li-bot {
  height: 3.1rem;
  border-radius: 0.2rem;
  background: gainsboro;
}
.li-bot image {
  width: 100%;
  height: 100%;
}
.contactBtn {
  width: 1rem;
  height: 1rem;
  display: block;
  border-radius: 50%;
  position: fixed;
  bottom: 10%;
  right: 2%;
  font-size: 0.24rem;
  color: white;
  text-align: center;
  margin: 0;
  box-sizing: border-box;
  line-height: 0.2rem;
  padding: 0.06rem 0 0;
}
.contactBtn {
  background: #000000;
  background: -moz-linear-gradient(left top, #8ab6ff 0%, #4989ed 100%);
  background: -webkit-gradient(
    linear,
    left top,
    color-stop(0%, #8ab6ff),
    color-stop(100%, #4989ed)
  );
  background: -webkit-linear-gradient(left top, #8ab6ff 0%, #4989ed 100%);
  background: -o-linear-gradient(left top, #8ab6ff 0%, #4989ed 100%);
  background: -ms-linear-gradient(left top, #8ab6ff 0%, #4989ed 100%);
  background: linear-gradient(to left top, #8ab6ff 0%, #4989ed 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#8ab6ff', endColorstr='#4989ed',GradientType=0 );
}
:root .contactBtn {
  filter: none;
}
.contactBtn img {
  width: 0.5rem;
  height: 0.5rem;
}
</style>

