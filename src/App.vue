<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data(){
    return{}
  },
  mounted(){
    // 获取登陆后返回的trd_session参数
  if(this.$route.query.trd_session){
     this.$cookies.set('trd_session',this.$route.query.trd_session);
   }
  },
  methods: {

  }
};
</script>

<style>
</style>
