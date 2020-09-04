<template>
  <div>
    <!-- 二级路由 -->
    <router-view></router-view>
    <!-- 底部导航 -->
    <van-tabbar v-model="active" @change="toggleTabBar">
      <van-tabbar-item
        v-for="(item, index) in tabBarData"
        :key="index"
        :icon="item.icon"
      >{{item.title}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      //底部导航数据
      tabBarData: [
        {
          icon: "home-o",
          title: "首页",
          routeName: "Homepage",
          urls: ["homepage"]
        },
        {
          icon: "qr",
          title: "分类",
          routeName: "Cation",
          urls: ["cation"]
        },
        {
          icon: "shopping-cart-o",
          title: "购物车",
          routeName: "Shopping",
          urls: ["shopping"]
        },
        {
          icon: "contact",
          title: "我的",
          routeName: "My",
          urls: ["my"]
        }
      ]
    };
  },
  created() {
    this.urldit();
    console.log('1')
  },

  methods: {
    //切换底部导航
    toggleTabBar(index) {
      this.$router.push({ name: this.tabBarData[index].routeName });
    },
    // 刷新页面底部高亮
    urldit() {
      let url = location.hash
        .slice(2)
        .split("/")
        .splice(0, 3)
        .join("/");

      for (let i = 0; i < this.tabBarData.length; i++) {
        if (this.tabBarData[i].urls.indexOf(url) > -1) {
          this.active = i;
          break;
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
