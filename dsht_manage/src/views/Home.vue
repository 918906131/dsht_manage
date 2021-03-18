<template>
  <div class="home">
    <el-header class="el_header">电商后台管理系统</el-header>
    <el-container>
      <el-aside width="200px" class="el_aside">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :router= true
        >
          <el-submenu
            :index="item.id + '-1' + ''"
            v-for="item in list"
            :key="item.id"
          >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="ite.id + '-6' + ''"
              v-for="ite in item.children"
              :key="ite.id"
              :route="{ path: '/home/' + ite.path }"
              >{{ ite.authName }}</el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="el_main">
        <div class="nov">
          <router-link to="">首页></router-link>
          <router-link to="">{{ this.$store.state.nov_title }} ></router-link>
          <router-link to=""
            >{{ this.$store.state.nov_son_title }} ></router-link
          >
        </div>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import { menus_res, login_res } from "./../assets/js/request";
export default {
  name: "Home",
  components: {},
  data() {
    return {
      list: [],
      is: true,
    };
  },
  mounted() {
    login_res().then((res) => {
      // console.log(res);
      window.sessionStorage.setItem("token", res.data.token);
    });
    menus_res().then((res) => {
      // console.log(res);
      this.list = res.data;
    });
  },
};
</script>
<style scoped>
.el-main {
  background-color: #eaedf1;
}
.home {
  height: 100%;
  display: flex;
  flex-flow: column;
}
.el_header {
  background: #373d41;
  color: white;
  font-size: 34px;
}
.el_aside {
  background: #333744;
  color: white;
}
.nov {
  font-size: 24px;
}
.el_main {
  background-color: #eaedf1;
}
</style>
