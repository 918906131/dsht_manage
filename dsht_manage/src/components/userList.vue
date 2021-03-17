<template>

	<div>
		<!-- 面包屑导航 -->
		<!-- <el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb> -->

		<!-- 内容 -->

		<div class="userlist">
			<!-- 搜索 -->
			<div class="el-userlist-top">
				<el-input placeholder="请输入搜索的内容" clearable v-model="Filter">
					<el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
				</el-input>
				<!-- 添加用户按钮 -->
				<el-row :gutter="20">
					<el-col :span="2" :offset="6">
						<div class="grid-content bg-purple" @click="addVisible">添加用户</div>
					</el-col>
				</el-row>
			</div>
			<!-- 表格 -->
			<div class="table">
				<!-- 表格内容 -->
				<el-table :data="userlist" stripe border style="width: 100%">
					<el-table-column type="index" label="#" width="48"> </el-table-column>
					<el-table-column prop="username" label="姓名" width="170"> </el-table-column>
					<el-table-column prop="email" label="邮箱" width="170"> </el-table-column>
					<el-table-column prop="mobile" label="电话" width="170"> </el-table-column>
					<el-table-column prop="role_name" label="角色" width="170"> </el-table-column>
					<el-table-column prop="mg_state" label="状态" width="170">
						<template slot-scope="scope">
							<!-- 开 关 -->
							<el-switch v-model="scope.row.mg_state" @change="usersChange(scope.row.id, scope.row.mg_state)"> </el-switch>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="240">
						<template slot-scope="scope">
							<el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id, scope.row.username, scope.row.mobile, scope.row.email)"></el-button>
							<el-button size="mini" type="danger" icon="el-icon-delete" @click="remove(scope.row.id)"></el-button>
							<el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
						</template>
					</el-table-column>
				</el-table>

				<!-- 分页 -->
				<el-pagination
					:current-page="queryInfo.pagenum"
					:page-sizes="[2, 3, 5, 10]"
					:page-size="queryInfo.pagesize"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total"
				>
				</el-pagination>

				<!-- 添加用户弹窗 -->
				<el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%">
					<el-form label-width="70px" :model="addForm" :rules="addFormRules" ref="addFormRef">
						<el-form-item label="用户名" prop="username">
							<el-input v-model="addForm.username"></el-input>
						</el-form-item>
						<el-form-item label="密码" prop="password">
							<el-input v-model="addForm.password"></el-input>
						</el-form-item>
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="addForm.email"></el-input>
						</el-form-item>
						<el-form-item label="手机" prop="mobile">
							<el-input v-model="addForm.mobile"></el-input>
						</el-form-item>
					</el-form>
					<span slot="footer" class="dialog-footer">
						<el-button @click="resetAddForm">取 消</el-button>
						<el-button type="primary" @click="add">确 定</el-button>
					</span>
				</el-dialog>
				<!-- 修改用户弹窗 -->
				<el-dialog title="添加用户" :visible.sync="editDialogVisible" width="50%">
					<el-form label-width="70px" :model="editForm" :rules="editFormRules" ref="addFormRef">
						<el-form-item label="用户名" prop="username">
							<el-input v-model="editForm.username" disabled></el-input>
						</el-form-item>
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="editForm.email"></el-input>
						</el-form-item>
						<el-form-item label="手机" prop="mobile">
							<el-input v-model="editForm.mobile"></el-input>
						</el-form-item>
					</el-form>
					<span slot="footer" class="dialog-footer">
						<el-button @click="resetAddForm">取 消</el-button>
						<el-button type="primary" @click="edit(editForm)">确 定</el-button>
					</span>
				</el-dialog>
			</div>
		</div>
	</div>
</template>

<script>
import {users_res, usersChange_res, add_res, usersEdit_res, usersRemove_res,usersSearch_res} from './../assets/js/request';
const checkMobile = (rule, value, cb) => {
	let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
	if (reg.test(value)) {
		cb();
	} else {
		cb(new Error('手机号码格式不正确'));
	}
};

export default {
	props: {},
	data() {
		return {
			// 搜索框数据
			Filter: null,
			// 添加用户弹窗数据
			addDialogVisible: false,
			addForm: {
				username: '',
				password: '',
				email: '',
				mobile: ''
			},
			addFormRules: {
				username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
				password: [{required: true, message: '请输入密码', trigger: 'blur'}],
				email: [{required: true, message: '请输入邮箱', trigger: 'blur'}],
				mobile: [
					{required: true, message: '请输入手机号', trigger: 'blur'},
					{validator: checkMobile, trigger: 'blur'}
				]
			},
			// 修改用户弹窗数据
			editDialogVisible: false,
			editForm: {
				id: null,
				username: '',
				email: '',
				mobile: ''
			},
			editFormRules: {
				email: [{required: true, message: '请输入邮箱', trigger: 'blur'}],
				mobile: [
					{required: true, message: '请输入手机号', trigger: 'blur'},
					{validator: checkMobile, trigger: 'blur'}
				]
			},
			// 分页器参数
			total: 5,
			queryInfo: {
				pagenum: 1,
				pagesize: 5
			},
			// 用户列表数据
			userlist: []
		};
	},
	methods: {
		// 搜索
		search() {
			const id=this.Filter
			console.log(id);
			usersSearch_res(id).then((res)=>{
				if(this.Filter!=''){

					this.userlist.splice(0,this.userlist.length,res.data)
				}else{
					this.getUsers()
				}
				console.log(res);
			})
		},
		// 添加用户
		addVisible() {
			this.addDialogVisible = true;
		},
		// 添加
		add() {
			this.$refs.addFormRef.validate(async valid => {
				if (!valid) return;
				add_res(this.addForm).then(res => {
					if (res.meta.status !== 201) {
						return this.$message.error('添加用户失败！');
					}
					this.$message.success('添加用户成功！');
					this.addDialogVisible = false;
					this.getUsers();
					(this.addForm.username = ''), (this.addForm.password = ''), (this.addForm.email = ''), (this.addForm.mobile = '');
				});
			});
		},
		// 取消
		resetAddForm() {
			(this.addForm.username = ''), (this.addForm.password = ''), (this.addForm.email = ''), (this.addForm.mobile = '');
		},

		// 修改用户
		showEditDialog(id, username, mobile, email) {
			this.editForm.username = username;
			this.editForm.mobile = mobile;
			this.editForm.email = email;
			this.editForm.id = id;
			this.editDialogVisible = true;
		},
		edit(editForm) {
			this.$refs.addFormRef.validate(async valid => {
				if (!valid) return;
				usersEdit_res(editForm.id, editForm.mobile, editForm.email).then(res => {
					if (res.meta.status !== 200) {
						return this.$message.error('查询用户信息失败！');
					}
					// 把获取到的用户信息对象，保存到 编辑表单数据对象中
					this.$message.success('更改信息成功！');
					this.editDialogVisible = false;
					this.getUsers();
				});
			});
		},

		// 删除单个
		async remove(id) {
			await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'});
			usersRemove_res(id).then(res => {
				if (res.meta.status !== 200) return this.$message.error('删除用户失败！');
				this.$message.success('删除用户成功！');
				this.getUsers();
			});
		},
		//请求用户列表数据封装
		async getUsers() {
			users_res(this.queryInfo).then(res => {
				console.log(res.data);
				if (res.meta.status !== 200) {
					return this.$message.error('查询用户列表失败！');
				}
				this.total = res.data.total;
				this.userlist = res.data.users;
			});
		},
		// 用户状态更新
		async usersChange(id, newState) {
			usersChange_res(id, newState).then(res => {
				console.log(res);
				if (res.meta.status !== 200) {
					return this.$message.error('修改状态失败！');
				}
			});
		},

		// 分页器变化
		handleSizeChange(val) {
			this.queryInfo.pagesize = val;
			this.getUsers();
		},
		handleCurrentChange(val) {
			this.queryInfo.pagenum = val;
			this.getUsers();
		}
	},
	mounted() {
    this.$store.commit("modify_nov", "用户管理");
    this.$store.commit("modify_nov_son", "用户列表");
  },
	created() {
		this.getUsers();
	},
	components: {}
};
</script>

<style scoped lang="less">
// 内容
.userlist {
	margin-top: 15px;
	padding: 20px;
	background-color: #fff;
	border-radius: 5px;
	text-align: center;
	// 搜索
	.el-userlist-top {
		display: flex;
		// 搜索框
		.el-input {
			width: 347px;
			height: 40px;
		}
		// 添加按钮
		.el-row {
			margin-bottom: 20px;
			cursor: pointer;
			&:last-child {
				margin-bottom: 0;
				.el-col {
					border-radius: 4px;
					.bg-purple {
						background: #409eff;
					}
					.grid-content {
						border-radius: 4px;
						min-height: 36px;
						color: #fff;
						line-height: 40px;
						width: 100px;
						height: 40px;
						font-size: 15px;
					}
				}
			}
		}
	}
	.table {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		.el-table {
			margin-top: 15px;
			.el-table-column {
				.el-button {
					color: darkred;
				}
			}
		}
		.el-pagination {
			margin-top: 18px;
		}
	}
}
</style>
