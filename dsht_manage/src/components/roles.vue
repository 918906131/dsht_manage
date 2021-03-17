<template>
  <div id="roles">
    <el-button class="add_btn" type="primary" @click="add_warp_"
      >添加角色</el-button
    >
    <template>
      <el-button :plain="true" v-if="add_warp" class="wrap_addmodifi">
        <el-form
          :label-position="labelPosition"
          label-width="80px"
          :model="formLabelAlign"
        >
          <el-form-item label="角色名称">
            <el-input
              v-model="formLabelAlign.addname"
              style="width: 400px"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="formLabelAlign.addcom"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="success" @click="add_role">点击添加</el-button>
        <el-button type="danger" @click="add_warp_close_state"
          >点击关闭</el-button
        >
      </el-button>
    </template>
    <template>
      <el-button :plain="true" v-if="edit_wrap" class="wrap_addmodifi">
        <el-form
          :label-position="labelPosition"
          label-width="80px"
          :model="formLabelAlign"
        >
          <el-form-item label="角色名称">
            <el-input
              v-model="formLabelAlign.name"
              style="width: 400px"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="formLabelAlign.com"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="success" @click="edit_r">点击修改</el-button>
        <el-button type="danger" @click="edit_wrap_state">点击关闭</el-button>
      </el-button>
    </template>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="expand" width="180">
        <template slot-scope="scope">
          <el-row v-for="item1 in scope.row.children" :key="item1.id">
            <!-- 这一列，专门渲染 一级权限 -->
            <el-col :span="5">
              <el-tag closable class="tag_marign">{{ item1.authName }}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 还剩余 19 列，分配给二三级权限 -->
            <el-col :span="19">
              <el-row
                v-for="item2 in item1.children"
                :key="item2.id"
                class="centerRow"
              >
                <!-- 放二级权限 -->
                <el-col :span="6">
                  <el-tag closable class="tag_marign" type="success">{{
                    item2.authName
                  }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 放三级权限 -->
                <el-col :span="18">
                  <el-tag
                    closable
                    type="warning"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    class="tag_marign"
                  >
                    {{ item3.authName }}</el-tag
                  >
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="#" width="180"> </el-table-column>
      <el-table-column prop="roleName" label="角色名称"> </el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
      <el-table-column prop="" label="操作">
        <template slot-scope="scope">
          <el-button class="el_but" type="primary" @click="edit_role(scope.row)"
            ><i class="el-icon-edit"></i>编辑</el-button
          >
          <el-button
            class="el_but"
            type="warning"
            @click="delete_role(scope.row)"
            ><i class="el-icon-delete"></i>删除</el-button
          >
          <el-button class="el_but" type="danger">
            <i class="el-icon-setting"></i>
            分配权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-tree
      :data="rightTree"
      show-checkbox
      node-key="id"
      :default-expanded-keys="[2, 3]"
      :default-checked-keys="[5]"
    >
    </el-tree>
    <router-view></router-view>
  </div>
</template>

<script>
import {
  rights_res,
  add_roles,
  delete_,
  edit_,
  rights_list,
} from "./../assets/js/request";

export default {
  props: {},
  data() {
    return {
      tableData: [],
      labelPosition: "right",
      formLabelAlign: {
        name: "",
        com: "",
        addname: "",
        addcom: "",
      },
      edit_wrap: false,
      id: "",
      add_warp: false,
      rightTree: [],
    };
  },
  methods: {
    //添加关闭显示遮影层
    add_warp_close_state() {
      this.add_warp = false;
      this.$store.commit("modify_state", false);
    },
    //添加显示遮影层
    add_warp_() {
      this.add_warp = true;
      this.$store.commit("modify_state", true);
    },
    //修改关闭遮影层
    edit_wrap_state() {
      this.$store.commit("modify_state", false);
      this.edit_wrap = false;
    },
    //点击添加角色
    add_role() {
      this.$confirm("是否添加?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.add_warp = false;
          this.$store.commit("modify_state", false);
          add_roles(
            this.formLabelAlign.addname,
            this.formLabelAlign.addcom
          ).then((res) => {
            console.log(res);
          });
          this.$message({
            type: "success",
            message: "添加成功!",
          });
        })
        .catch(() => {
          this.add_warp = false;
          this.$message({
            type: "info",
            message: "已取消添加",
          });
        });
    },
    //删除角色
    delete_role: function (row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delete_(row.id).then((res) => {
            console.log(res);
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //点击显示修改框
    edit_role: function (row) {
      this.edit_wrap = true;
      this.id = row.id;
      this.$store.commit("modify_state", true);
      console.log(this.$store.state.shadow_active);
      // console.log(row);
    },
    //点击修改
    edit_r() {
      this.$confirm("此操作将修改该文件 是否修改", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.edit_wrap = false;
          this.$store.commit("modify_state", false);
          edit_(
            this.id,
            this.formLabelAlign.name,
            this.formLabelAlign.com
          ).then((res) => {
            console.log(res);
          });
          this.$message({
            type: "success",
            message: "修改成功!",
          });
        })
        .catch(() => {
          this.edit_wrap = false;
          this.$store.commit("modify_state", false);
          this.$message({
            type: "info",
            message: "已取消修改",
          });
        });
    },
  },
  components: {},
  mounted() {
    //加载表格
    rights_res().then((res) => {
      this.tableData = res.data;
      console.log(res);
    });
    //加载下拉
    rights_list().then((res) => {
      this.rightTree = res.data;
      console.log(res);
    });
    this.$store.commit("modify_nov", "权限管理");
    this.$store.commit("modify_nov_son", "角色列表");
  },
};
</script>

<style scoped lang="less">
#roles {
  position: relative;
  border-radius: 10px 10px;
  background-color: white;
  .add_btn {
    margin: 0;
    padding: 0;
    position: relative;
    top: -40px;
    left: 20px;
    width: 110px;
    height: 50px;
  }
  .wrap_addmodifi {
    position: absolute;
    top: 100px;
    display: flex;
    flex-flow: column;
    justify-content: space-evenly;
    // align-items: center;
    width: 540px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }
  .tag_marign {
    margin-left: 10px;
    margin-top: 10px;
  }
}
</style>
