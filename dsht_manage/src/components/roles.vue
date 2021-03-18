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
          <el-button class="el_but" type="danger" @click="set_role(scope.row)">
            <i class="el-icon-setting"></i>
            分配权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 权限菜单树 -->
    <el-dialog class="menu_tree" :visible.sync="isTree" title="分配权限">
      <!-- 分配权限的对话框 -->
      <!-- 权限菜单 -->
      <el-tree
        ref="tree"
        :data="tree"
        show-checkbox
        node-key="id"
        default-expand-all
        class="tree_c"
        :props="treeprops"
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel2">取 消</el-button>
        <el-button type="primary" @click="sure"> 确 定</el-button>
      </span>
    </el-dialog>

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
  updata_premiss,
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
      tree: [],
      isTree: false,
      edit_wrap: false,
      id: "",
      add_warp: false,
      set_roleup_id: "",
      set_roledown_id: "",
      treeprops: {
        label: "authName",
        children: "children",
      },
      diguitree: [],
      defKeys: [],
    };
  },
  methods: {
    //递归遍历所有不含children的对象id
    digui(node, arr) {
      if (!node.children) {
        arr.push(node.id);
      } else {
        node.children.forEach((item) => {
          this.digui(item, arr);
        });
      }
    },
    cancel2() {
      this.isTree = false;
    },
    sure() {
      /* console.log(
        this.$refs.tree.getCheckedKeys(),
        this.$refs.tree.getHalfCheckedKeys()
      ); */
      let res1 = this.$refs.tree.getCheckedKeys();
      let res2 = this.$refs.tree.getHalfCheckedKeys();
      let arr = [...res1, ...res2].join(",");
      // console.log(arr);
      updata_premiss(this.set_roleup_id, arr).then((res) => {
        console.log(res);
        rights_res().then((res) => {
          this.tableData = res.data;
          this.isTree = false;
        });
      });
    },
    //分配
    set_role(v) {
      //加载下拉
      this.isTree = true;
      console.log(v);
      this.set_roleup_id = v.id;
      rights_list().then((res) => {
        this.tree = res.data;
        this.digui(v, this.diguitree);
        console.log(res);
        this.defKeys = arrtemp;
      });
      // 获取所有三级节点的Id
      let arrtemp = [];

      v.children.forEach((item1) => {
        arrtemp.push(item1.id);

        item1.children.forEach((item2) => {
          arrtemp.push(item2.id);

          item2.children.forEach((item3) => {
            arrtemp.push(item3.id);
          });
        });
      });
    },
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
            //加载表格
            rights_res().then((res) => {
              this.tableData = res.data;
              console.log(res);
            });
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
            //加载表格
            rights_res().then((res) => {
              this.tableData = res.data;
              console.log(res);
            });
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
            //加载表格
            rights_res().then((res) => {
              this.tableData = res.data;
              console.log(res);
            });
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
      this.tree = res.data;
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
