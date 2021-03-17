<template>
  <div>
    <el-table :data="rightsList" stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="权限等级" prop="pid">
        <template slot-scope="prop">
          <el-tag :type="but_active(prop.row.pid)">{{
            text(prop.row.pid)
          }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { rights_list } from "./../assets/js/request";
export default {
  props: {},
  data() {
    return {
      rightsList: [],
    };
  },
  methods: {
    but_active(v) {
      console.log(v);
      if (v == "0") {
        return;
      } else if (v == "1") {
        return (v = "success");
      } else if (v == "2") {
        return (v = "warning");
      }
    },
    text(v) {
      if (v == "0") {
        return "一级权限";
      } else if (v == "1") {
        return "二级权限";
      } else if (v == "2") {
        return "三级权限";
      }
    },
  },
  components: {},
  mounted() {
    rights_list().then((res) => {
      this.rightsList = res.data;
      console.log(res);
    });
    this.$store.commit("modify_nov", "权限管理");
    this.$store.commit("modify_nov_son", "权限列表");
  },
};
</script>

<style scoped lang="less">
</style>
