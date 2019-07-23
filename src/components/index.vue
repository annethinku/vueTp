<template>
  <div class="index">
    <router-view></router-view>
    <div style="height:1.5rem;"></div>
    <van-tabbar v-model="active">
      <van-tabbar-item to="/home">
        <span>投票发起</span>
        <img slot="icon" slot-scope="props" :src="props.active ? icon.active : icon.normal" />
      </van-tabbar-item>
      <!-- <van-icon class-prefix="my-icon" name="extra" /> -->
      <van-tabbar-item to="/zuan">
        <span>赚金币</span>
        <img slot="icon" slot-scope="props" :src="props.active ? icon2.active : icon2.normal" />
      </van-tabbar-item>
      <van-tabbar-item to="/my">
        <span>个人中心</span>
        <img slot="icon" slot-scope="props" :src="props.active ? icon3.active : icon3.normal" />
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      active: 0,
      icon: {
        normal: "../../static/images/boticon01.png",
        active: "../../static/images/boticon1.png"
      },
      icon2: {
        normal: "../../static/images/boticon02.png",
        active: "../../static/images/boticon2.png"
      },
      icon3: {
        normal: "../../static/images/boticon03.png",
        active: "../../static/images/boticon3.png"
      }
    };
  },
  filters: {},
  components: {},
  mounted() {
    let path = this.$router.currentRoute.path;
    if (path == "/home") {
      this.active = 0;
    } else if (path == "/zuan") {
      this.active = 1;
    } else if (path == "/my") {
      this.active = 2;
    }
  },

  methods: {
   
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
