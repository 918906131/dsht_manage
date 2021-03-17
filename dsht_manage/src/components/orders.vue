<template>
  <div id="orders">
    <el-input
      placeholder="请输入内容"
      v-model="search_v"
      class="search_input"
    ></el-input>
    <el-button plain @click="open_search_wrap"
      ><i class="el-icon-search"></i
    ></el-button>
    <template>
      <el-button :plain="true" v-if="edit_wrap" class="wrap_addmodifi">
        <el-form
          :label-position="labelPosition"
          label-width="180px"
          :model="formLabelAlign"
        >
          <el-form-item label="订单是否发货">
            <el-input v-model="formLabelAlign.is_send"></el-input>
          </el-form-item>

          <el-form-item label="订单支付">
            <el-input v-model="formLabelAlign.order_pay"></el-input>
          </el-form-item>

          <el-form-item label="订单价格">
            <el-input v-model="formLabelAlign.order_price"></el-input>
          </el-form-item>

          <el-form-item label="订单数量">
            <el-input v-model="formLabelAlign.order_number"></el-input>
          </el-form-item>
          <el-form-item label="支付状态">
            <el-input v-model="formLabelAlign.pay_status"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="success" @click="edit_r">点击修改</el-button>
        <el-button type="danger" @click="edit_wrap_modify_state"
          >点击关闭</el-button
        >
      </el-button>
    </template>
    <el-dialog :visible.sync="order_wrap" class="order_menu" width="40%">
      <p>订单编号:{{ search_order_menu.order_id }}</p>
      <p>订单价格:{{ search_order_menu.order_price }}</p>
      <p>是否付款:{{ text(search_order_menu.pay_status) }}</p>
      <p>是否发货:{{ search_order_menu.is_send }}</p>
      <p>下单时间: {{ search_order_menu.create_time | foramteTime }}</p>
    </el-dialog>
    <template>
      <el-button :plain="true" v-if="menu_wrap" class="wrap_addmodifi2">
        <p>修改地址</p>
        <i class="el-icon-close" @click="close_menu_wrap"></i>
        <span style="color: red; margin: 7px">*</span> 省市区/县
        <el-cascader
          v-model="menu_value"
          :options="three"
          :props="{ expandTrigger: 'hover' }"
          @change="handleChange"
        ></el-cascader>
        <br />
        <br />
        <span style="color: red; margin: 10px">*</span> 详细地址
        <el-input placeholder="请输入内容"></el-input>
      </el-button>
    </template>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="user_id" label="#" width="180"> </el-table-column>
      <el-table-column prop="order_number" label="订单编号"> </el-table-column>
      <el-table-column prop="order_price" label="订单价格"> </el-table-column>
      <el-table-column prop="pay_status" label="是否付款">
        <template slot-scope="prop">
          <el-tag :type="but_active(prop.row.pay_status)">{{
            text(prop.row.pay_status)
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货"> </el-table-column>
      <el-table-column prop="create_time" label="下单时间">
        <template slot-scope="scope">
          {{ scope.row.create_time | foramteTime }}
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作">
        <template slot-scope="scope">
          <el-button class="el_but" type="success" @click="open_menu_wrap"
            ><i class="el-icon-edit"></i
          ></el-button>
          <!-- <el-button class="el_but" type="warning"
            ><i class="el-icon-delete"></i
          ></el-button> -->
          <el-button class="el_but" type="primary" @click="edit_role(scope.row)"
            ><i class="el-icon-user"></i
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="100"
    >
    </el-pagination>
  </div>
</template>

<script>
import map from "./../assets/js/three";
import formatDate from "./../assets/js/mapAndTime";
import { order_list, edit_order, search_order } from "./../assets/js/request";
export default {
  props: {},
  data() {
    return {
      tableData: [],
      data: [],
      labelPosition: "right",
      formLabelAlign: {
        is_send: "",
        order_pay: "",
        order_price: "",
        order_number: "",
        pay_status: "",
      },
      id: "",
      edit_wrap: false,
      menu_wrap: false,
      search_v: "",
      menu_value: "",
      three: "",
      order_wrap: false,
      search_order_v: "",
      search_order_menu: [],
    };
  },
  methods: {
    but_active(v) {
      console.log(v);
      if (v == "否") {
        return (v = "warning");
      } else if (v == "是") {
        return (v = "success");
      }
    },
    text(v) {
      if (v == "0") {
        return "未付款";
      } else if (v == "1") {
        return "已付款";
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      order_list(val).then((res) => {
        console.log(res);
        this.tableData = res.data.goods;
      });
    },
    //点击打开查询订单框
    open_search_wrap() {
      this.order_wrap = true;
      search_order(this.search_v).then((res) => {
        this.search_order_menu = res.data;
        console.log(res);
      });
    },
    close_order_wrap() {
      this.order_wrap = false;
    },
    //点击关闭地图框
    close_menu_wrap() {
      this.menu_wrap = false;
      this.$store.commit("modify_state", false);
    },
    open_menu_wrap() {
      this.menu_wrap = true;
      this.$store.commit("modify_state", true);
    },
    //点击显示修改框
    edit_role: function (row) {
      this.edit_wrap = true;
      this.id = row.order_id;
      console.log(row);
      this.$store.commit("modify_state", true);
    },
    // 点击修改关闭 遮影层关闭
    edit_wrap_modify_state() {
      this.edit_wrap = false;
      this.$store.commit("modify_state", false);
    },
    //点击修改
    edit_r() {
      this.$confirm("此操作将修改该文件 是否修改", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.commit("modify_state", false);
          this.edit_wrap = false;
          edit_order(
            this.id,
            this.formLabelAlign.is_send,
            this.formLabelAlign.order_pay,
            this.formLabelAlign.order_price,
            this.formLabelAlign.order_number,
            this.formLabelAlign.pay_status
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
    //点击查询
    handleChange(value) {
      console.log(value);
    },
  },
  mounted() {
    this.$store.commit("modify_nov", "订单管理");
    this.$store.commit("modify_nov_son", "订单列表");
    order_list(1).then((res) => {
      console.log(res);
      this.data = res;
      this.tableData = res.data.goods;
    });
    this.three = map;
  },
  filters: {
    foramteTime: function (data) {
      let t = new Date(data);
      return formatDate(t, "yyyy-MM-dd hh:mm:ss");
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.wrap_addmodifi {
  position: absolute;
  top: 100px;
  display: flex;
  flex-flow: column;
  justify-content: space-evenly;
  width: 540px;
  height: 500px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}
.wrap_addmodifi2 {
  position: absolute;
  top: 100px;
  display: flex;
  flex-flow: column;
  justify-content: space-evenly;
  width: 540px;
  height: 300px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}
.wrap_addmodifi2 p {
  font-size: 20px;
  position: absolute;
  top: 30px;
  left: 30px;
}
.el-icon-close {
  position: absolute;
  top: 30px;
  right: 30px;
}
.search_input {
  width: 300px;
}
.order_menu {
  display: flex;
  flex-flow: column;
  justify-content: space-evenly;
}
.order_menu p {
  margin-bottom: 15px;
  font-size: 18px;
}
</style>
