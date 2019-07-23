<template>
  <div>
    <van-nav-bar title="欢投圈" left-arrow @click-left="returnPrev" />
    <div class="record-nav flexbox">
      <div :class="'navli '+ (status==0?'on':'')" data-status="0" @click="changeNav">进行中</div>
      <div :class="'navli '+ (status==1?'on':'')" data-status="1" @click="changeNav">已结束</div>
    </div>
    <div class="record-box">
      <div class="record-li" v-for="(item,index) in list" :key="index">
        <router-link :to="{path:'/detail',query:{id:item.vote_id}}">
          <div class="rli-top flexbox" :data-index="index">
            <div class="title">{{item.title}}</div>
            <div class="num"></div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      status: 0
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
    changeNav: function(e) {
      var st = e.toElement.dataset.status;
      this.status = st;
      this.getlist();
    },
    returnPrev() {
      this.$router.go(-1);
    },
    getlist: function() {
         let trd_session=this.$cookies.get('trd_session')?this.$cookies.get("trd_session"):'' ;
      this.$axios({
        url:
          this.API2 +
          "/Member/tpList?" +
          "trd_session=" +trd_session+'&'+this.rt,
        params: { status: this.status }
      }).then(res => {
        this.list = res.data.info.list;
      });
    }
  }
};
</script>
<style scoped>
body {
  background: white;
}
.record-nav {
  padding: 0.15rem 0;
  border-bottom: 1px #e6e6e6 solid;
  justify-content: center;
  background: white;
}
.record-box {
  background: white;
}
.navli {
  font-size: 0.28rem;
  margin-right: 30%;
  padding: 0.1rem 0;
}
.navli:last-child {
  margin-right: 0;
}
.navli.on {
  color: #118ef8;
  border-bottom: 1px #118ef8 solid;
}
.rli-top {
  align-items: center;
  justify-content: space-between;
  padding: 0.24rem;
  font-size: 0.28rem;
  border-bottom: 1px #e6e6e6 solid;
}
.rli-top .num {
  width: 0;
  height: 0;
  border: 0.1rem transparent solid;
  border-left: 0.1rem #999 solid;
}
.rli-bot {
  justify-content: space-around;
  font-size: 0.28rem;
  margin: 0.2rem 0;
  text-align: center;
}
.rli-bot img {
  width: 0.4rem;
  height: 0.4rem;
}
.rli-bot span {
  display: block;
}
</style>

