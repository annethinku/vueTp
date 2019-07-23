<template>
  <div>
    <van-nav-bar title="欢投圈" />
    <!-- 签到 -->
    <div class="today">
      <div class="today-title">每日签到</div>
      <div class="qiandao flexbox">
        <div class="qdli">
          <div class="qdday">
            第
            <span>1</span> 天
          </div>
          <div class="qdnumber" v-if="!(day>0)">+10</div>
          <div class="qdicon" v-else>
            <img src="../../static/images/gou.png" />
          </div>
        </div>
        <div class="qdli">
          <div class="qdday">
            第
            <span>2</span> 天
          </div>
          <div class="qdnumber" v-if="!(day>1)">+15</div>
          <div class="qdicon" v-else>
            <img src="../../static/images/gou.png" />
          </div>
        </div>
        <div class="qdli">
          <div class="qdday">
            第
            <span>3</span> 天
          </div>
          <div class="qdnumber" v-if="!(day>2)">+15</div>
          <div class="qdicon" v-else>
            <img src="../../static/images/gou.png" />
          </div>
        </div>
        <div class="qdli">
          <div class="qdday">
            第
            <span>4</span> 天
          </div>
          <div class="qdnumber" v-if="!(day>3)">+20</div>
          <div class="qdicon" v-else>
            <img src="../../static/images/gou.png" />
          </div>
        </div>
        <div class="qdli">
          <div class="qdday">
            第
            <span>5</span> 天
          </div>
          <div class="qdnumber" v-if="!(day>4)">+20</div>
          <div class="qdicon" v-else>
            <img src="../../static/images/gou.png" />
          </div>
        </div>
        <div class="qdli">
          <div class="qdday">
            第
            <span>6</span> 天
          </div>
          <div class="qdnumber" v-if="!(day>5)">+20</div>
          <div class="qdicon" v-else>
            <img src="../../static/images/gou.png" />
          </div>
        </div>
        <div class="qdli">
          <div class="qdday">
            第
            <span>7</span> 天
          </div>
          <div class="qdnumber" v-if="!(day>6)">+30</div>
          <div class="qdicon" v-else>
            <img src="../../static/images/gou.png" />
          </div>
        </div>
      </div>
      <div class="qdtishi">连续签到,奖励丰厚~</div>
      <!-- 已授权 -->
      <!-- <block v-if="isSq=='yes'"> -->
      <button class="qdbtn" @click="qiandao2">立即签到</button>
      <!-- </block> -->
      <!-- 未授权 -->
      <!-- <block v-else>
        <button class="qdbtn" open-type="getUserInfo" catchgetuserinfo="getUserInfo">立即签到</button>
      </block>-->
    </div>
    <!-- <div class="haoyun">
      <div class="haoyun-title flexbox">
        <div class="l">金币兑换</div>
        <div class="r" @click="jumpProduct">
          更多
          <span></span>
        </div>
      </div>
      <div class="haoyun-list flexbox">
        <div class="honyun-li" v-for="(item,index) in goods" :key="index">
          <div class="hy-imgs">
            <img :src="item.real_bannerimgs_array[0]" />
          </div>
          <div class="hy-center">{{item.goods_name}}</div>
          <div class="hy-bots flexbox">
            <div class="hyh-left">
              <div>
                <text>2</text>金币
              </div>
            </div>
            <div class="hyh-right">2.1万 已购</div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      day: 0,
      isSq: false,
      goods: [],
      is: ""
    };
  },
  mounted() {
    this.qiandao();
  },
  methods: {
    // 签到 get
    qiandao: function() {
      let trd_session = this.$cookies.get("trd_session")
        ? this.$cookies.get("trd_session")
        : "";
      this.$axios
        .get(
          this.API2 +
            "Member/sign?" +
            "trd_session=" +
            trd_session+'&'+this.rt
        )
        .then(res => {
          if (res.data.status == 1) {
            this.day = res.data.info.sign_days;
          } else {
            if ((res.data.info == "unlogin" && is_weixn())) {
              location.href =
                "https://api.9xy.cn/Tp/member/h5Login?rt=h5&pname=zuan&path=" +
                location.href;
            }else if((res.data.info != "unlogin" && is_weixn())){
               this.$toast(res.data.info);
            } else {
              // if (this.debug == "debug=1") {
              //   this.$myLogin();
              //   this.qiandao();
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
    // 签到 post
    qiandao2: function() {
      let trd_session = this.$cookies.get("trd_session")
        ? this.$cookies.get("trd_session")
        : "";
      this.$axios({
        method:'post',
        url:this.API2 +"Member/sign",
        headers:{
        'Content-type': 'application/x-www-form-urlencoded'
        },
        params:{trd_session:trd_session,rt:'h5'}
        })
        .then(res => {
          if (res.data.status == 1) {
            // sessionStorage("day", res.data.info.sign_days);
            this.day = res.data.info.sign_days;
          } else {
            this.$toast(res.data.info);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 跳转到商品列表
    jumpProduct: function() {
      this.$router.push({ path: "", query: {} });
      // wx.navigateTo({
      //   url: '../../pagesA/pages/list/list',
      // })
    },
    // 判断是否在微信浏览器打开
    is_weixn() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>
<style scoped>
.moneyBox {
  border-radius: 0.2rem;
  padding: 0.3rem;
  background: white;
  margin: 0.24rem;
}

.money-left {
  width: 45%;
  border-right: 2px #b4e3f7 solid;
}

.money-left div {
  font-size: 0.3rem;
  font-weight: bold;
  margin-bottom: 0.2rem;
}

.money-left span,
.mr-bot {
  font-size: 0.34rem;
  color: red;
  font-weight: bold;
}

.mr-top div {
  font-size: 0.3rem;
  font-weight: bold;
}

.mr-top button {
  background: red;
  color: white;
  font-size: 0.28rem;
  padding: 0 0.1rem 0 0.3rem;
  border-radius: 0.4rem;
  margin: 0 auto 0 0.2rem;
}

.mr-top button span {
  display: inline-block;
  border: 0.16rem transparent solid;
  border-left: 0.16rem white solid;
  position: relative;
  top: 0.06rem;
}

.money-right {
  margin-left: 0.2rem;
}

.nengliang {
  width: 100%;
  height: 3.55rem;
  position: relative;
}

.qiu {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  background: #fd7b4a;
  color: white;
  font-size: 0.32rem;
  text-align: center;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  box-shadow: 0 0 0.1rem #84ad0f;
  position: absolute;
  animation: mymove 1.5s infinite;
}

@keyframes mymove {
  0% {
    transform: translateY(0);
  }

  25% {
    transform: translateY(3px);
  }

  50% {
    transform: translateY(6px);
  }

  70% {
    transform: translateY(3px);
  }

  100% {
    transform: translateY(0);
  }
}

.today {
  background: white;
  border-radius: 0.2rem;
  padding: 0.24rem;
  margin: 0.3rem 0.24rem 0;
}

.today-title {
  font-size: 0.3rem;
  font-weight: bold;
  border-bottom: 1px #e6e6e6 solid;
  padding: 0 0 0.2rem;
}

.today-title span {
  color: red;
}

.today-li {
  align-items: center;
  margin: 0.4rem 0 0;
}

.today-icon {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  overflow: hidden;
  background: gainsboro;
  margin-right: 0.2rem;
}

.today-fonts {
  width: 60%;
}

.today-fonts div {
  font-size: 28rem;
  font-weight: bold;
}

.today-fonts span {
  font-size: 0.24rem;
  color: #999;
}

.today-btn {
  background: #fc6769;
  color: white;
  margin-left: auto;
  font-size: 0.28rem;
  padding: 0.05rem 0.3rem;
  border-radius: 0.04rem;
}

.haoyun {
  background: white;
  border-radius: 0.2rem;
  padding: 0.24rem;
  margin: 0.3rem 0.24rem;
}

.haoyun-title {
  align-items: center;
}

.haoyun-title .l {
  font-size: 0.3rem;
  font-weight: bold;
}

.haoyun-title .r {
  font-size: 0.26rem;
  color: #7f7f7f;
  margin-left: auto;
}

.haoyun-title .r span {
  display: inline-block;
  width: 0;
  height: 0;
  border: 0.12rem transparent solid;
  border-left: 0.12rem #e1e1e1 solid;
}

.haoyun-list {
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 0.2rem;
}

.honyun-li {
  width: 3.16rem;
  box-shadow: 0 0 0.1rem gainsboro;
  border-radius: 0.1rem;
  overflow: hidden;
  padding: 0 0 0.2rem;
  margin-bottom: 0.4rem;
}

.hy-imgs {
  width: 3.16rem;
  height: 3.16rem;
  border-radius: 0.1rem;
  overflow: hidden;
  background: gainsboro;
}

.hy-imgs img {
  width: 100%;
  height: 100%;
}

.hy-center {
  font-size: 0.28rem;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-weight: bold;
  padding: 0 0.24rem;
  margin: 0.2rem 0;
}

.hy-bots {
  justify-content: space-between;
  padding: 0 0.24rem;
  align-items: center;
}

.hyh-left div {
  font-size: 0.24rem;
  color: #999;
}

.hyh-left div span {
  font-size: 0.36rem;
  color: red;
  font-weight: bold;
}

.hyh-right {
  font-size: 0.24rem;
  color: #999;
}

.curJinb {
  border-radius: 0.2rem;
  background: white;
  padding: 0.24rem;
  margin: 0 0.24rem;
}

.curJinb-pro {
  margin: 0.24rem 0.24rem 0;
  position: relative;
}

.jb-li {
  width: 1.4rem;
  text-align: center;
}

.jb-li .number {
  font-size: 0.28rem;
  font-weight: bold;
}

.jb-li .jiant {
  width: 0;
  height: 0;
  border: 0.16rem transparent solid;
  border-top: 0.16rem #e1e1e1 solid;
  margin: 0.1rem auto;
}

.pickred {
  width: 0.8rem;
  height: 0.95rem;
  line-height: 0.95rem;
  background: #878787;
  border-radius: 0.1rem;
  margin: 0.36rem auto 0;
  color: white;
  font-size: 0.24rem;
}

.jb-li .desc {
  font-size: 0.24rem;
  color: #999;
}

.jb-li:first-child {
  margin-left: 10%;
}
.progress {
  width: 100%;
  height: 0.2rem;
  background: #e0e0e0;
  border-radius: 0.4rem;
  position: absolute;
  top: 28%;
  left: 0;
}

.redin-pro {
  width: 10%;
  height: 100%;
  border-radius: 0.4rem;
  position: absolute;
  top: 0;
  left: 0;
  background: #ff3a37;
}
.qiandao {
  margin: 0.24rem 0;
  flex-wrap: wrap;
  justify-content: center;
}
.qdli {
  width: 1.5rem;
  text-align: center;
  border-right: 1px #e6e6e6 solid;
  border-bottom: 1px #e6e6e6 solid;
  padding: 0.4rem 0;
}
.qdli:nth-child(4),
.qdli:nth-child(7) {
  border-right: none;
}
.qdday {
  font-size: 0.3rem;
  color: #ff3a37;
}
.qdday span {
  font-size: 0.4rem;
  font-weight: bold;
}
.qdnumber {
  font-size: 0.28rem;
  font-weight: bold;
  margin-top: 0.1rem;
}
.qdicon {
  width: 0.4rem;
  height: 0.4rem;
  margin: 0.1rem auto 0;
}
.qdicon img {
  width: 100%;
  height: 100%;
}
.qdtishi {
  font-size: 0.28rem;
  font-weight: bold;
  color: #ff3a37;
  text-align: center;
}
.qdbtn {
  width: 3.12rem;
  height: 0.76rem;
  line-height: 0.76rem;
  border-radius: 0.4rem;
  background: #ff3a37;
  color: white;
  font-size: 0.28rem;
  text-align: center;
  display: block;
  margin: 0.2rem auto 0;
}
</style>
