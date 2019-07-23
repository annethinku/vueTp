<template>
  <div>
    <van-nav-bar title="欢投圈" />
    <div class="myTop flexbox">
      <div class="myt-left">
        <img :src="info.minfo.headimgurl" alt="用户头像" v-if="info" />
      </div>
      <div class="myt-center">
        <span class="name" v-if="info">{{info.minfo.nickname}}</span>
        <div class="jinb">
          <span>{{info.jinbi}}</span>金币
        </div>
      </div>
    </div>
    <div class="my-two flexbox">
      <div class="twoli">
        <router-link :to="{path:'/myrecord'}">
          <div>{{info.fq_num}}</div>
          <span>发起</span>
        </router-link>
      </div>
      <div class="twoli">
        <router-link :to="{path:'/myrecord2'}">
          <div>{{info.tp_num}}</div>
          <span>投票</span>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      info: ""
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
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
            trd_session+'&'+this.rt
        })
        .then(res => {
          if (res.data.status == 1) {
            that.info = res.data.info;
          } else {
            // that.$toast(res.data.info);
            if ((res.data.info == "unlogin" && is_weixn())) {
              location.href =
                "https://api.9xy.cn/Tp/member/h5Login?rt=h5&pname=my&path=" +
                location.href;
            }else if((res.data.info != "unlogin" && is_weixn())){
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
    }
  }
};
</script>
<style scoped>
.myTop {
  align-items: center;
  margin: 0.2rem 0.3rem 0;
}
.myt-left {
  width: 1.33rem;
  height: 1.33rem;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 0.2rem;
}
.myt-center .name {
  font-size: 0.3rem;
}
.myt-center .idt {
  font-size: 0.26rem;
  color: #999;
}
.myt-center .jinb {
  font-size: 0.28rem;
  font-weight: bold;
}
.myt-center .jinb span {
  color: red;
}
.myt-right {
  color: white;
  font-size: 0.24rem;
  padding: 0.04rem 0.1rem;
  background: #118ef8;
  margin-left: auto;
}
.my-two {
  margin: 0.67rem 0 0.3rem;
  justify-content: center;
}
.twoli {
  width: 25%;
  text-align: center;
}
.twoli button {
  line-height: 0.4rem;
}
.twoli div {
  font-size: 0.3rem;
  font-weight: bold;
}
.twoli span {
  font-size: 0.24rem;
  color: #999;
}
.mycontrols {
  border-top: 0.04rem #f6f6f6 solid;
  padding: 0 0.2rem;
  margin-bottom: 0.2rem;
}
.mycli {
  border-bottom: 1px #e6e6e6 solid;
}
.mycli .flexbox {
  padding: 0.3rem 0.2rem;
  align-items: center;
}
.mycli .icon {
  width: 0.43rem;
  height: 0.43rem;
  line-height: 0.43rem;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 0.2rem;
}
.mycli .icon img {
  width: 100%;
  height: 100%;
}
.mycli .name {
  font-size: 0.28rem;
  font-weight: bold;
}
.mycli .jiantou {
  width: 0.2rem;
  height: 0.2rem;
  border-top: 3px gainsboro solid;
  border-right: 3px gainsboro solid;
  transform: rotate(45deg);
  margin-left: auto;
}
</style>
