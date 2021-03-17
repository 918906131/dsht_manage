<template>
	<div>
		<!-- 面包屑导航 -->
		<!-- <el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb> -->

		<!-- 内容 -->
		<div class="categorieslist">
			<el-alert title="注意：只允许为第三级分类设置相关参数!" type="warning" show-icon :closable="false"> </el-alert>
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="110px" class="Choose" label-position="left">
				<el-form-item label="选择商品分类：">
					<!-- 分类菜单 -->
					<el-cascader
						class="choose"
						expand-trigger="hover"
						:options="parentCateList"
						:props="cascaderConfig"
						v-model="selectedCateList"
						@change="cascaderChanged"
						clearable
						ref="cascader"
					>
					</el-cascader>
				</el-form-item>
			</el-form>
			<div>
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="动态参数" name="only"> </el-tab-pane>
					<el-tab-pane label="静态属性" name="many"> </el-tab-pane>
					<div class="el-categorieslist-top">
						<!-- 添加分类按钮 -->
						<el-row :gutter="20">
							<el-col :span="2" :offset="0">
								<div class="grid-content bg-purple" @click="addVisible" v-if="this.activeName == 'only'">添加参数</div>
								<div class="grid-content bg-purple" @click="addVisible" v-else>添加属性</div>
							</el-col>
						</el-row>
					</div>
					<!-- 表格 -->
					<div class="table">
						<!-- 表格内容 -->
						<el-table :data="catelist" style="width: 100%" border>
							<el-table-column type="expand">
								<template slot-scope="scope">
									<el-tag :key="tag" v-for="tag in scope.row.attr_vals" closable :disable-transitions="false" @close="handleClose(scope.row.attr_vals, tag)">
										{{ tag }}
									</el-tag>
									<el-input
										class="input-new-tag"
										v-if="scope.row.tagInputVisible"
										v-model="scope.row.tagInputValue"
										ref="saveTagInput"
										size="small"
										@keyup.enter.native="handleInputConfirm(scope.row)"
										@blur="handleInputConfirm(scope.row)"
									>
									</el-input>
									<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
								</template>
							</el-table-column>
							<el-table-column label="#" type="index"> </el-table-column>
							<el-table-column label="属性名称" prop="attr_name"></el-table-column>
							<el-table-column label="操作">
								<template slot-scope="scope">
									<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"> 编辑</el-button>
									<el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(scope.row.attr_id)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>

						<!-- 添加参数弹窗 -->
						<el-dialog class="add_" :title="this.activeName == 'only' ? '添加动态参数' : '添加静态属性'" :visible.sync="addDialogVisible" width="50%" @close="resetAddForm">
							<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
								<el-form-item v-bind:label="this.activeName == 'only' ? '动态参数：' : '静态属性：'" prop="cat_name">
									<el-input v-model="addForm.cat_name"> </el-input>
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
								<el-form-item label="分类名称" prop="cat_name">
									<el-input v-model="editForm.cat_name"></el-input>
								</el-form-item>
							</el-form>
							<span slot="footer" class="dialog-footer">
								<el-button @click="resetAddForm">取 消</el-button>
								<el-button type="primary" @click="edit(editForm)">确 定</el-button>
							</span>
						</el-dialog>
					</div>
				</el-tabs>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue';
import treeTable from 'vue-table-with-tree-grid';
import http from './../assets/js/use_interface';
Vue.use(treeTable);
import {categories_res, getParams_res} from './../assets/js/request';

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
				cat_pid: 0,
				cat_level: 0,
				cat_name: ''
			},
			addFormRules: {
				cat_name: [{required: true, message: '请输入分类名称', trigger: 'blur'}]
			},
			// 修改用户弹窗数据
			editDialogVisible: false,
			editForm: {
				cat_id: null,
				cat_name: ''
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

			// 数据
			catelist: [],
			// 分类级联菜单 父级
			parentCateList:[],
			cascaderConfig: {
				label: 'cat_name',
				value: 'cat_id',
				children: 'children'
			},
			selectedCateList: [],
			activeName: 'only',
			row: null
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
				http({
					url: `/categories/${this.cateId}/attributes`,
					method: 'post',
					data: {
						// 参数的名称
						attr_name: this.addForm.cat_name,
						// 参数类型 many only
						attr_sel: this.activeName
					}
				}).then(res => {
					console.log(res);
					if (res.meta.status !== 201) {
						return this.$message.error('添加参数失败！');
					}
					this.$message.success('添加参数成功！');
					this.addDialogVisible = false;
					this.getParamsList();
				});
			});
		},
		// 取消
		resetAddForm() {
			(this.editForm.cat_name = ''), (this.addForm.cat_name = ''), (this.addForm.cat_level = 0), (this.addForm.cat_pid = 0);
		},

		// 编辑分类
		showEditDialog(row) {
			// console.log(row);
			// console.log(row.attr_name);
			// console.log(row.cat_id);
			// console.log(row.attr_id);
			// console.log(row.attr_sel);
			// console.log(row.attr_vals.join(' '));
			this.editForm.cat_name = row.attr_name;
			this.editDialogVisible = true;
			this.row = row;
		},
		edit() {
			this.$refs.addFormRef.validate(async valid => {
				if (!valid) return;
				http({
					url: `/categories/${this.row.cat_id}/attributes/${this.row.attr_id}`,
					method: 'put',
					data: {
						// 参数的名称
						attr_name: this.editForm.cat_name,
						// 参数类型 many only
						attr_sel: this.row.attr_sel,
						attr_vals: this.row.attr_vals.join(',')
					}
				}).then(res => {
					if (res.meta.status !== 200) {
						return this.$message.error('修改分类失败！');
					}
					// 把获取到的用户信息对象，保存到 编辑表单数据对象中
					this.$message.success('修改分类成功！');
					this.editDialogVisible = false;
					this.row = null;
					this.getParamsList();
				});
			});
		},

		// 删除分类名称
		async remove(id) {
			console.log(id);
			await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'});
			http({
				url: `/categories/${this.cateId}/attributes/${id}`,
				method: 'delete',
				data: {
					// 参数的名称
					attr_name: this.addForm.cat_name,
					// 参数类型 many only
					attr_sel: this.activeName
				}
			}).then(res => {
				if (res.meta.status !== 200) return this.$message.error('删除分类失败！');
				this.$message.success('删除分类成功！');
				this.getParamsList();
			});
		},
		//请求分类参数数据封装
		async getAllCateList() {
			categories_res().then(res => {
				// console.log(res);
				if (res.meta.status !== 200) {
					return this.$message.error('查询用户列表失败！');
				}
				// this.catelist = res.data;
				// console.log(this.catelist);
			});
		},
		//请求商品列表分类级联数据封装
		async getParents() {
			categories_res({params: {type: 2}}).then(res => {
				// console.log(res);
				if (res.meta.status !== 200) {
					return this.$message.error('查询用户列表失败！');
				}
				this.parentCateList = res.data;
				console.log(this.parentCateList);
			});
		},
		// 参数列表
		async getParamsList() {
			// console.log(this.cateId);
			if (this.selectedCateList.length !== 3) {
				console.log('未选中分类');
				return
			}
			getParams_res(this.cateId, this.activeName).then(res => {
				console.log(res.data);
				res.data.forEach(item => {
					// 把字符串的可选项，分割为数组，重新赋值给 attr_vals
					item.attr_vals = item.attr_vals.length > 0 ? item.attr_vals.split(',') : [];
					// this.dynamicTags = item.attr_vals;
					// 为每个数据行，添加自己的 tagInputVisible ，从而控制自己展开行中的输入框的显示与隐藏
					item.tagInputVisible = false;
					// 把文本框中输入的值，双向绑定到item.tagInputValue 上
					item.tagInputValue = '';
				});
				this.catelist = res.data;
			});
		},

		// 级联选择框选中项变化，会触发这个函数 只允许选择三级分类
		cascaderChanged() {
			if (this.selectedCateList.length !== 3) {
				console.log('111');
				// 没有选中三级分类，把分类重置为空
				this.selectedCateList = [];
				this.catelist = []
			} else {
				console.log('222');
				// 选中了三级分类后，获取该分类对应的参数列表数据
				this.getParamsList();
			}
		},
		handleClick() {
			console.log(this.activeName);
			this.getParamsList();
		},

		handleClose(row, tag) {
			row.splice(row.indexOf(tag), 1);
		},

		showInput(row) {
			row.tagInputVisible = true;
			this.$nextTick(() => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},

		handleInputConfirm(row) {
			if (row.tagInputValue) {
				row.attr_vals.push(row.tagInputValue);
			}
			row.tagInputVisible = false;
			row.tagInputValue = '';
		}
	},
	computed: {
		cateId() {
			if (this.selectedCateList.length === 3) {
				return this.selectedCateList[this.selectedCateList.length - 1];
			} else {
				return null;
			}
		}
	},
	mounted() {
    this.$store.commit("modify_nov", "商品管理");
    this.$store.commit("modify_nov_son", "分类参数");
  },
	created() {
		this.getAllCateList();
		this.getParents();
		// this.getParamsList();
	},
	components: {}
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
	// 级联选择分类
	.Choose {
		text-align: left;
		margin-top: 15px;

		.choose {
			text-align: left;
			width: 30%;
		}
	}
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
		// margin-top: 15px;
		.add_ {
			text-align: start;
		}
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
