<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 内容 -->

		<div class="categorieslist">
			<div>
				<div class="el-categorieslist-top">
					<!-- 添加分类按钮 -->
					<el-row :gutter="20">
						<el-col :span="2" :offset="0">
							<div class="grid-content bg-purple" @click="addVisible">添加分类</div>
						</el-col>
					</el-row>
				</div>
				<!-- 表格 -->
				<div class="table">
					<!-- 表格内容 -->
					<tree-table  ref="table" :data="categorieslist" :columns="columns" border :selection-type="false" :expand-type="false" show-index index-text="#" class="tree-table table_cell">
						<!-- 操作的模板列 -->
						<template slot="opt" slot-scope="scope">
							<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.cat_id,scope.row.cat_name)"> 编辑</el-button>
							<el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(scope.row.cat_id)">删除</el-button>
						</template>
						<!-- 排序的模板列 -->
						<template slot="order" slot-scope="scope">
							<el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
							<el-tag type="success" v-else-if="scope.row.cat_level === 1" size="mini">二级</el-tag>
							<el-tag type="danger" v-else size="mini">三级</el-tag>
						</template>
						<!-- 是否有效的模板列 -->
						<template slot="isok" slot-scope="scope">
							<i class="el-icon-success" style="color:lightgreen;" v-if="scope.row.cat_deleted === false"> </i>
							<i class="el-icon-error" style="color:red;" v-else> </i>
						</template>
					</tree-table>

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

					<!-- 添加分类弹窗 -->
					<el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="resetAddForm">
						<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
							<el-form-item label="分类名称：" prop='cat_name'>
								<el-input v-model="addForm.cat_name"> </el-input>
							</el-form-item>
							<el-form-item label="父级分类：">
								<!-- 分类菜单 -->
								<el-cascader
									class="jilian"
									expand-trigger="hover"
									:options="parentCateList"
									:props="cascaderConfig"
									v-model="selectedCateList"
									@change="handleChange"
									clearable
								>
								</el-cascader>
							</el-form-item>
						</el-form>
						<span slot="footer" class="dialog-footer">
							<el-button @click="resetAddForm">取 消</el-button>
							<el-button type="primary" @click="add">确 定</el-button>
						</span>
					</el-dialog>
					<!-- 修改分类弹窗 -->
					<el-dialog title="修改分类" :visible.sync="editDialogVisible" width="50%">
						<el-form label-width="100px" :model="editForm" :rules="editFormRules" ref="addFormRef">
							<el-form-item label="分类名称" prop='cat_name'>
								<el-input v-model="editForm.cat_name"></el-input>
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
	</div>
</template>

<script>
import Vue from 'vue';
import treeTable from 'vue-table-with-tree-grid';
Vue.use(treeTable);
import {categories_res, usersChange_res,  catRemove_res,addCat_res,catEdit_res} from './../assets/js/request';

export default {
	props: {},
	data() {
		return {
			// tree-table指定列定义
			columns: [
				// 第一列数据
				{
					label: '分类名称',
					prop: 'cat_name'
				},
				// 第二列数据
				{
					label: '是否有效',
					// 表示将当前列定义为模板列
					type: 'template',
					// 表示当前这一列使用模板名称
					template: 'isok'
				},
				// 第三列数据
				{
					label: '排序',
					// 表示将当前列定义为模板列
					type: 'template',
					// 表示当前这一列使用模板名称
					template: 'order'
				},
				// 第四列数据
				{
					label: '操作',
					// 表示将当前列定义为模板列
					type: 'template',
					// 表示当前这一列使用模板名称
					template: 'opt'
				}
			],
			// 搜索框数据
			Filter: null,
			// 添加用户弹窗数据
			addDialogVisible: false,
			addForm: {
				cat_pid:0,
				cat_level:0,
				cat_name: ''
			},
			addFormRules: {
				cat_name: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
			},
			// 修改用户弹窗数据
			editDialogVisible: false,
			editForm: {
				cat_id: null,
				cat_name:''
			},
			editFormRules: {
				cat_name: [{required: true, message: '请输入分类名称', trigger: 'blur'}]
			},
			// 分页器参数
			total: 5,
			queryInfo: {
				pagenum: 1,
				pagesize: 2
			},

			// 用户列表数据
			categorieslist: [],
			// 分类级联菜单 父级
			parentCateList: [],
			cascaderConfig: {
				label: 'cat_name',
				value: 'cat_id',
				children: 'children'
			},
			selectedCateList: []
		};
	},
	methods: {
		// 添加分类
		addVisible() {
			this.addDialogVisible = true;
		},
		// 添加
		add() {
			this.$refs.addFormRef.validate(async valid => {
				if (!valid) return;
				console.log(this.addForm);
				addCat_res(this.addForm).then(res => {
					console.log(res);
					if (res.meta.status !== 201) {
						console.log(res.meta);
						return this.$message.error('添加分类失败！');
					}
					this.$message.success('添加分类成功！');
					this.addDialogVisible = false;
					this.getCategories();
					(this.addForm.username = ''), (this.addForm.password = ''), (this.addForm.email = ''), (this.addForm.mobile = '');
				});
			});
		},
		// 取消
		resetAddForm() {
			(this.editForm.cat_name = ''),(this.addForm.cat_name = ''), (this.addForm.cat_level =0), (this.addForm.cat_pid = 0);
		},

		// 编辑分类
		showEditDialog(id,name) {
			console.log(id);
			this.editForm.cat_name=name
			console.log(this.editForm.cat_name);
			this.editForm.cat_id=id
			console.log(this.editForm.cat_id);
			this.editDialogVisible = true;
		},
		edit(editForm) {
			this.$refs.addFormRef.validate(async valid => {
				if (!valid) return;
				catEdit_res(editForm.cat_id, editForm.cat_name).then(res => {
					if (res.meta.status !== 200) {
						return this.$message.error('修改分类名称失败！');
					}
					// 把获取到的用户信息对象，保存到 编辑表单数据对象中
					this.$message.success('修改分类名称成功！');
					this.editDialogVisible = false;
					this.getCategories();
				});
			});
		},

		// 删除分类名称
		async remove(id) {
			console.log(id);
			await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'});
			catRemove_res(id).then(res => {
				if (res.meta.status !== 200) return this.$message.error('删除分类名称失败！');
				this.$message.success('删除分类名称成功！');
				this.getCategories();
			});
		},
		//请求商品列表数据封装
		async getCategories() {
			categories_res(this.queryInfo).then(res => {
				console.log(res);
				if (res.meta.status !== 200) {
					return this.$message.error('查询用户列表失败！');
				}
				this.total = res.data.total;
				this.categorieslist = res.data.result;
				console.log(this.categorieslist);
			});
		},
		//请求商品列表分类级联数据封装
		async getParents() {
			categories_res({params: {type: 2}}).then(res => {
				console.log(res);
				if (res.meta.status !== 200) {
					return this.$message.error('查询用户列表失败！');
				}
				this.parentCateList = res.data;
				console.log(this.parentCateList);
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
			this.getCategories();
		},
		handleCurrentChange(val) {
			this.queryInfo.pagenum = val;
			this.getCategories();
		},
		// 级联选择框选中项变化，会触发这个函数
		handleChange() {
			if (this.selectedCateList.length === 0) {
				// 证明没有选中任何父级分类
				this.addForm.cat_pid = 0;
				this.addForm.cat_level = 0;
			} else {
				// 选中父级分类
				this.addForm.cat_pid = this.selectedCateList[this.selectedCateList.length - 1];
				// 设置分类等级
				this.addForm.cat_level = this.selectedCateList.length;
			}
		}
	},
	created() {
		this.getCategories();
		this.getParents();
	},
	components: {
		treeTable
	}
};
</script>

<style scoped lang="less">
.jilian {
	width: 100%;
}
// 内容
.categorieslist {
	margin-top: 15px;
	padding: 20px;
	background-color: #fff;
	border-radius: 5px;
	text-align: center;
	// 搜索
	.el-categorieslist-top {
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
		margin-top: 15px;
		.el-table {
			font-size: 12px;
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
