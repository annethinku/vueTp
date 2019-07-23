<template>
  <div>
    <van-nav-bar title="欢投圈" left-arrow @click-left="returnPrev" />
    <div class="record-nav flexbox">
      <div :class="'navli '+ (status==0?'on':'')" data-status="0" @click="changeNav">进行中</div>
      <div :class="'navli '+ (status==1?'on':'')" data-status="1" @click="changeNav">已结束</div>
    </div>
    <div class="record-box">
      <div class="record-li" v-for="(item,index) in list" :key="index">
        <div class="rli-top flexbox" :data-index="index" @click="toggleS">
          <div class="title">{{item.title}}</div>
          <div class="num"></div>
        </div>
        <div class="rli-bot flexbox" v-if="item.togg">
          <div>
            <router-link :to="{path:'/edit',query:{id:item.id}}">
              <img src="../../../static/images/m1.png" />
              <span>编辑</span>
            </router-link>
          </div>
          <div>
            <router-link :to="{path:'/detail',query:{id:item.id}}">
              <img src="../../../static/images/m2.png" />
              <span>查看</span>
            </router-link>
          </div>
          <div @click="deleteT" :data-id="item.id">
            <img src="../../../static/images/m3.png" :data-id="item.id" />
            <span :data-id="item.id">删除</span>
          </div>
        </div>
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
    returnPrev() {
      this.$router.go(-1);
    },
    getlist: function() {
      let trd_session = this.$cookies.get("trd_session")
        ? this.$cookies.get("trd_session")
        : "";
      this.$axios({
        url:
          this.API2 +
          "/Member/fqList?" +
          "trd_session=" +
          trd_session+'&'+this.rt,
        params: { status: this.status }
      }).then(res => {
        for (var i = 0; i < res.data.info.list.length; i++) {
          res.data.info.list[i].togg = false;
        }
        this.list = res.data.info.list;
      });
    },
    changeNav: function(e) {
      var st = e.toElement.dataset.status;
      this.status = st;
      this.getlist();
    },
    toggleS: function(e) {
      let that = this;
      let index = e.toElement.dataset.index;
      if (that.list[index].togg) {
        that.list[index].togg = false;
      } else {
        that.list[index].togg = true;
        for (var i = 0; i < that.list.length; i++) {
          if (i != index) {
            that.list[i].togg = false;
          }
        }
      }
    },
    deleteT: function(e) {
      let id = e.toElement.dataset.id;
      let trd_session = this.$cookies.get("trd_session")
        ? this.$cookies.get("trd_session")
        : "";
      let that = this;
      console.log(id);
      that.$dialog
        .confirm({
          title: "标题",
          message: "确认要删除此条数据吗？"
        })
        .then(() => {
          // on confirm
          that
            .$axios({
              url:
                that.API2 +
                "/Vote/delVote?" +
                "trd_session=" +
                trd_session+'&'+this.rt,
              params: { id: id }
            })
            .then(res => {
              that.getlist();
            });
        })
        .catch(() => {
          // on cancel
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
