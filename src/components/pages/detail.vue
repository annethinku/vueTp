<template>
  <div>
    <van-nav-bar title="欢投圈" left-arrow @click-left="returnPrev" />
    <div class="de-title">{{info.title}}</div>
    <div class="de-desc">
      {{info.desc}}
      <div v-if="info.is_multi==1">
        <text>[多选]</text>
      </div>
      <div v-else>
        <text>[单选]</text>
      </div>
    </div>
    <div class="de-imgs flexbox">
      <div class="imgbox" v-for="(item,index) in info.desc_imgs" :key="index">
        <img :src="item" :data-src="item" @click="showBig" />
      </div>
    </div>
    <div class="options">
      <div v-for="(item,index) in info.options" :key="index">
        <div class="optionLi flexbox" @click="toupiao" :data-oid="item.id" :data-index="index">
          <div>
            {{item.title}}
            <span class="gou" v-if="item.is_tp>0"></span>
          </div>
          <div>{{item.num}}票 {{item.rate}}%</div>
          <div class="progress" :style="'width: calc('+item.rate+'% - 0.76rem);'"></div>
        </div>
        <div class="touperson flexbox" v-if="info.is_niming!=1">
          <div class="person flexbox" v-for="(item2,index2) in item.members" :key="index2">
            <div class="userimg">
              <img :src="item2.headimgurl" />
            </div>
            <div class="name" v-if="qiehuan[index].zname">{{item2.nickname}}</div>
          </div>
          <div class="shousuo" @click="toggleName" v-if="item.members.length>0" :data-index="index">
            <div v-if="!qiehuan[index].zname" :data-index="index">
              <img src="../../../static/images/dian.png" :data-index="index" />
            </div>
            <div v-else>
              <img
                src="../../../static/images/upjiant.png"
                style="width:0.20rem;height:0.20rem;"
                :data-index="index"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="warn-ts">投票截至：{{info.endtime}}</div>
      <div class="surebtn" @click="suretoupiao" v-if="!yitou">确认投票</div>
    </div>
    <van-image-preview v-model="show" :images="images" @change="onChange">
      <!-- <template v-slot:index>第{{ index }}页</template> -->
    </van-image-preview>
  </div>
</template>
<script>
export default {
  data() {
    return {
      oidArr: "",
      title: "",
      info: [],
      id: null,
      oid: null,
      yitou: "",
      qiehuan: [],
      show: false,
      // index: 0,
      images: []
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    this.getInfo();
  },
  methods: {
    showBig(e) {
      this.show = true;
      this.images = [e.toElement.dataset.src];
    },
    onChange(index) {
      this.index = index;
    },
    returnPrev() {
      this.$router.go(-1);
    },
    getInfo: function() {
      let that = this;
      let params = {
        id: this.id
      };
      let trd_session = this.$cookies.get("trd_session")
        ? this.$cookies.get("trd_session")
        : "";
      this.$axios({
        url:
          this.API2 +
          "Vote/voteInfo?" +
          "trd_session=" +
          trd_session+'&'+this.rt,
        params
      }).then(res => {
        if (res.data.status == 1) {
          let dinfo = res.data.info.info;
          let imgs = dinfo.desc_imgs.split(",");
          let a = 0;
          dinfo.options.map((item, i) => {
            that.qiehuan.push({ zname: false });
          });
          if (imgs[0] == "undefined" || imgs[0] == "null" || imgs[0] == "") {
            dinfo.desc_imgs = 0;
          } else {
            dinfo.desc_imgs = imgs;
          }
          dinfo.endtime = timestampToTime(dinfo.endtime);
          for (var i = 0; i < dinfo.options.length; i++) {
            if (dinfo.options[i].is_tp > 0) {
              a++;
            }
          }
          if (a > 0) {
            this.yitou = true;
          } else {
            this.yitou = false;
          }
          this.info = dinfo;
        } else {
          // that.$toast(res.data.info);
          if ((res.data.info == "unlogin" && is_weixn())) {
            location.href =
              "https://api.9xy.cn/Tp/member/h5Login?rt=h5&pname=detail&path=" +
              location.href;
          }else if((res.data.info != "unlogin" && is_weixn())){
               this.$toast(res.data.info);
            } else {
            // if (this.debug == "debug=1") {
            //   this.$myLogin();
            //   that.getInfo();
            // } else {
              this.$toast("此功能需要在微信浏览器中使用");
            // }
          }
        }
      });
    },
    // 确认投票
    suretoupiao: function() {
      let that = this;
      let op_id = null;
      let trd_session = this.$cookies.get("trd_session")
        ? this.$cookies.get("trd_session")
        : "";
      if (!that.oid && !that.oidArr) {
        that.$toast("请选择");
        return false;
      }
      if (that.info.is_multi == 1) {
        op_id = that.oidArr;
      } else {
        op_id = that.oid;
      }
      let params = {
        vote_id: that.id,
        option_id: op_id,
        is_niming: that.info.is_niming
      };
      that
        .$axios({
          url:
            that.API2 +
            "Vote/vote?" +
            "trd_session=" +
            trd_session+'&'+this.rt,
          params
        })
        .then(res => {
          that.getInfo();
        });
    },
    // 投票
    toupiao: function(e) {
      // vote_id 投票id
      // option_id  选项id
      // is_niming  1匿名
      let that = this;
      let oid = e.toElement.dataset.oid;
      let index = e.toElement.dataset.index;
      let str = "";
      if (that.yitou) {
        return false;
      }
      if (that.info.is_multi == 1) {
        //多选
        let arr = [];
        if (that.info.options[index].is_tp <= 0) {
          that.info.options[index].is_tp = 1;
          that.oidArr = that.oidArr ? that.oidArr + "," + oid : oid;
        } else {
          that.info.options[index].is_tp = 0;
          Array.prototype.remove = function(val) {
            var index = this.indexOf(val);
            if (index > -1) {
              this.splice(index, 1);
            }
          };
          that.oidArr.split(",").remove(oid);
          for (var a = 0; a < that.oidArr.length; a++) {
            str = str ? str + "," + that.oidArr[a] : that.oidArr[a];
          }
          that.oidArr = str;
        }
      } else {
        if (that.info.options[index].is_tp <= 0) {
          that.info.options[index].is_tp = 1;
        }
        for (var i = 0; i < that.info.options.length; i++) {
          if (i != index) {
            that.info.options[i].is_tp = 0;
          }
        }
        that.oid = oid;
      }
    },
    toggleName: function(e) {
      let that = this;
      let arr = that.qiehuan;
      let index = e.toElement.dataset.index;
      if (arr[index].zname) {
        arr[index].zname = false;
      } else {
        arr[index].zname = true;
      }
      that.qiehuan = arr;
    }
  }
};
</script>
<style scoped>
body {
  background: #f3f4f6;
}
.de-title {
  font-size: 0.3rem;
  font-weight: bold;
  margin: 0.2rem 0.24rem;
}
.de-desc {
  width: 80%;
  font-size: 0.28rem;
  margin: 0 0.24rem;
}
.de-desc span {
  color: #118ef8;
}
.de-imgs {
  margin: 0.24rem;
  /* justify-content: space-between; */
  flex-wrap: wrap;
}
.imgbox {
  width: 2.2rem;
  height: 1.1rem;
  margin-bottom: 0.2rem;
  margin-right: 0.2rem;
}
.imgbox img {
  width: 100%;
  height: 100%;
}
.sharebtn {
  width: 0.81rem;
  height: 0.82rem;
  position: absolute;
  right: 5%;
  top: 2%;
}
.sharebtn img {
  width: 100%;
  height: 100%;
}
.options {
  margin: 0.24rem 0;
}
.optionLi {
  background: white;
  padding: 0.2rem 0.4rem 0.3rem;
  margin-bottom: 0.2rem;
  justify-content: space-between;
  align-items: center;
  font-size: 0.26rem;
  position: relative;
}
.progress {
  height: 2px;
  background: #118ef8;
  position: absolute;
  left: 0.38rem;
  right: 0.38rem;
  bottom: 0;
  border-radius: 0.02rem;
}
.gou {
  width: 0.32rem;
  height: 0.15rem;
  border-left: 2px #118ef8 solid;
  border-bottom: 2px #118ef8 solid;
  display: inline-block;
  transform: rotate(-45deg);
  position: relative;
  top: -0.06rem;
  left: 0.06rem;
}
.warn-ts {
  font-size: 0.24rem;
  color: #999;
  margin: 0 0.4rem;
}
.touperson {
  margin: 0 0.3rem 0.2rem;
}
.person {
  align-items: center;
  margin-left: 0.1rem;
}
.userimg {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  overflow: hidden;
}
.userimg img {
  width: 100%;
  height: 100%;
}
.person .name {
  font-size: 0.22rem;
  margin-left: 0.1rem;
}
.shousuo {
  width: 0.4rem;
  height: 0.4rem;
  text-align: center;
  line-height: 0.3rem;
  border-radius: 50%;
  background: white;
  margin-left: 0.1rem;
}
.shousuo img {
  width: 100%;
  height: 100%;
}
.surebtn {
  width: 2rem;
  height: 0.8rem;
  line-height: 0.8rem;
  font-size: 0.28rem;
  background: #118ef8;
  color: white;
  border-radius: 0.1rem;
  margin: 0.4rem auto 0;
  text-align: center;
}
</style>

