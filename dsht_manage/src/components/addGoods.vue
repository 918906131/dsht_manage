<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 内容 -->

		<div class="goodslist">
			<!-- 添加商品界面 -->
			<div v-if="addDialogVisible" class="addGoods">
				<!-- 返回列表 -->
				<el-page-header @back="goBack" class="back" title="返回商品列表"> </el-page-header>
				<el-alert title="添加商品信息" type="info" center show-icon :closable="false"> </el-alert>
				<!-- 步骤条 -->
				<el-steps :space="200" :active="activeName - 0" finish-status="success" align-center class="Steps">
					<el-step title="基本信息"></el-step>
					<el-step title="商品参数"></el-step>
					<el-step title="商品属性"></el-step>
					<el-step title="商品图片"></el-step>
					<el-step title="商品内容"></el-step>
					<el-step title="完成"></el-step>
				</el-steps>
				<!-- 侧边选项卡 -->
				<el-tabs tab-position="left" v-model="activeName" :before-leave="isLeave" class="tabs">
					<el-tab-pane label="基本信息" name="0">
						<!-- 基本信息 -->
						<el-form :model="addForm" :rules="addFormRules" ref="ruleForm" label-width="100px" class="demo-ruleForm basicInfo" label-position="top">
							<!-- 商品名称 -->
							<el-form-item label="商品名称" prop="goods_name">
								<el-input v-model="addForm.goods_name"></el-input>
							</el-form-item>
							<!-- 商品价格 -->
							<el-form-item label="商品价格" prop="goods_price">
								<el-input v-model="addForm.goods_price" type="number"></el-input>
							</el-form-item>
							<!--商品重量  -->
							<el-form-item label="商品重量" prop="goods_weight">
								<el-input v-model="addForm.goods_weight"></el-input>
							</el-form-item>
							<!--商品数量  -->
							<el-form-item label="商品数量" prop="goods_number">
								<el-input v-model="addForm.goods_number"></el-input>
							</el-form-item>
							<!-- 商品分类 -->
							<el-form-item label="商品分类" prop="goods_cat">
								<!-- 分类菜单 -->
								<el-cascader
									class="choose"
									expand-trigger="hover"
									:options="catelist"
									:props="cascaderConfig"
									v-model="addForm.goods_cat"
									@change="cascaderChanged"
									clearable
									ref="cascader"
								>
								</el-cascader>
							</el-form-item>
						</el-form>
					</el-tab-pane>
					<el-tab-pane label="商品参数" name="1">
						<!-- 商品参数面板 -->
						<template>
							<div v-for="(item, index) in manyData" :key="index" class="ppp">
								<p>{{ item.attr_name }}</p>
								<el-checkbox-group v-model="checkList">
									<el-checkbox :label="item.attr_vals" border checked></el-checkbox>
								</el-checkbox-group>
							</div>
						</template>
					</el-tab-pane>
					<el-tab-pane label="商品属性" name="2">
						<!-- 商品静态属性面板 -->
						<template>
							<div v-for="(item, index) in onlyData" :key="index" class="ppp">
								<p>{{ item.attr_name }}</p>
								<el-input v-model="item.attr_vals" clearable> </el-input>
							</div>
						</template>
					</el-tab-pane>
					<el-tab-pane label="商品图片" name="3">
						<!-- 图片上传面板 -->
						<el-upload
							action="http://192.168.1.30:8888/api/private/v1/upload"
							:headers="uploadHeaders"
							:on-preview="handlePreview"
							:on-remove="handleRemove"
							:on-success="handleSuccess"
							list-type="picture"
						>
							<el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
					</el-tab-pane>
					<el-tab-pane label="商品内容" name="4">
						<div>
							<!-- 商品描述面板 -->
							<quill-editor v-model="addForm.goods_introduce" class="editor_"></quill-editor>
							<el-button type="primary" class="submit" @click="submit">添加商品</el-button>
						</div>
					</el-tab-pane>
				</el-tabs>
				<!-- 预览图片弹窗 -->
				<el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
					<el-image :src="previewImgSrc" alt=""></el-image>
				</el-dialog>
			</div>

			<!-- 商品列表界面 -->
			<div v-else >
				<!-- 搜索 -->
				<div class="el-goodslist-top">
					<el-input placeholder="请输入内容" clearable v-model="Filter" @change="clear">
						<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
					</el-input>
					<!-- 添加用户按钮 -->
					<el-row :gutter="20">
						<el-col :span="2" :offset="6">
							<div class="grid-content bg-purple" @click="addVisible">添加商品</div>
						</el-col>
					</el-row>
				</div>
				<!-- 表格 -->
				<div class="table">
					<!-- 表格内容 -->
					<el-table :data="goodslist" stripe border style="width: 100%">
						<el-table-column type="index" label="#" width="48"> </el-table-column>
						<el-table-column prop="goods_name" label="商品名称" width="600"> </el-table-column>
						<el-table-column prop="goods_price" label="商品价格(元)" width="95"> </el-table-column>
						<el-table-column prop="goods_weight" label="商品重量" width="70"> </el-table-column>
						<el-table-column prop="add_time" label="创建时间" width="183"> </el-table-column>
						<el-table-column label="操作" width="125">
							<template slot-scope="scope">
								<el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
								<el-button size="mini" type="danger" icon="el-icon-delete" @click="remove(scope.row)"></el-button>
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

					<!-- 修改用户弹窗 -->
					<el-dialog title="修改分类" :visible.sync="editDialogVisible" width="50%">
						<el-form label-width="70px" :model="editForm" :rules="editFormRules" ref="addFormRef">
							<el-form-item label="商品分类" prop="goods_id" label-width="80px">
								<!-- 分类菜单 -->
								<el-cascader
									class="choose1"
									expand-trigger="hover"
									:options="catelist"
									:props="cascaderConfig"
									v-model="addForm.goods_cat"
									@change="cascaderChanged"
									clearable
									style="width:100%;"
									ref="cascader"
								>
								</el-cascader>
							</el-form-item>
							<el-form-item label="商品名称" prop="goods_name" label-width="80px">
								<el-input v-model="editForm.goods_name"></el-input>
							</el-form-item>
							<el-form-item label="价格" prop="goods_price" label-width="80px">
								<el-input v-model="editForm.goods_price"></el-input>
							</el-form-item>
							<el-form-item label="数量" prop="goods_number" label-width="80px">
								<el-input v-model="editForm.goods_number"></el-input>
							</el-form-item>
							<el-form-item label="重量" prop="goods_weight" label-width="80px">
								<el-input v-model="editForm.goods_weight"></el-input>
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
import {goods_res, usersChange_res, goodsSearch_res} from './../assets/js/request';
import http from './../assets/js/use_interface';
import _ from 'lodash';
import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
Vue.use(VueQuillEditor);

export default {
	props: {},
	data() {
		return {
			// 搜索框数据
			Filter: null,
			// 选中卡片
			activeName: '',
			// 添加用户弹窗数据
			addDialogVisible: true,
			addForm: {
				goods_name: '',
				goods_cat: [],
				goods_price: null,
				goods_number: null,
				goods_weight: null,
				goods_introduce: 'abc',
				pics: [{pic: ''}]
				/* attrs: [
					{
						attr_id: 15,
						attr_value: 'ddd'
					},
					{
						attr_id: 15,
						attr_value: 'eee'
					}
				] */
			},
			addFormRules: {
				goods_name: [{required: true, message: '请填写商品名称', trigger: 'blur'}],
				goods_price: [{required: true, message: '请填写商品价格', trigger: 'blur'}],
				goods_weight: [{required: true, message: '请填写商品重量', trigger: 'blur'}],
				goods_number: [{required: true, message: '请填写商品数量', trigger: 'blur'}],
				goods_cat: [{required: true, message: '请选择商品分类'}]
			},
			// 修改用户弹窗数据
			editDialogVisible: false,
			editForm: {
				goods_id: null,
				goods_name: '',
				goods_price: null,
				goods_number: null,
				goods_weight: null
			},
			editFormRules: {
				goods_id: [{required: true, message: '请选择分类', trigger: 'blur'}],
				goods_name: [{required: true, message: '请输入名称', trigger: 'blur'}],
				goods_price: [{required: true, message: '请输入价格', trigger: 'blur'}],
				goods_number: [{required: true, message: '请输入数量', trigger: 'blur'}],
				goods_weight: [{required: true, message: '请输入重量', trigger: 'blur'}]
			},
			// 分页器参数
			total: 5,
			queryInfo: {
				pagenum: 1,
				pagesize: 10
			},
			// 用户列表数据
			goodslist: [],
			// 分类列表数据
			catelist: [],
			// 分类级联菜单 父级
			cascaderConfig: {
				label: 'cat_name',
				value: 'cat_id',
				children: 'children'
			},
			isleave: false,
			// 动态参数
			manyData: [],
			// 静态属性
			onlyData: [],
			checkList: [],
			uploadHeaders: {
				Authorization: window.sessionStorage.getItem('token')
			},
			previewImgSrc: '',
			previewVisible: false
		};
	},
	methods: {
		// 搜索
		search() {
			const id = this.Filter;
			console.log(this.Filter);
			console.log(id);
			if (this.Filter != '' || this.Filter != null) {
				goodsSearch_res(id).then(res => {
					// if (this.Filter != '' || this.Filter != null) {
					this.goodslist.splice(0, this.goodslist.length, res.data);
					// }
				});
			}
			this.getGoods();
			/* goodsSearch_res(id).then(res => {
				if (this.Filter != '' || this.Filter != null) {
					this.goodslist.splice(0, this.goodslist.length, res.data);
				} else {
					console.log('123');
					this.getGoods();
				}
				console.log(res);
			}); */
		},
		// 清空搜索框
		clear() {
			this.getGoods();
		},
		// 添加用户
		addVisible() {
			this.isleave = false;
			this.addDialogVisible = true;
		},
		// 级联参数请求
		async getCategories() {
			http({
				url: 'categories',
				method: 'get'
			}).then(res => {
				// console.log(res);
				if (res.meta.status !== 200) {
					return this.$message.error('初始化商品分类失败！');
				}
				this.catelist = res.data;
				// console.log(this.catelist);
			});
		},
		// 级联选择框选中项变化，会触发这个函数 只允许选择三级分类
		cascaderChanged() {
			console.log(this.addForm.goods_cat);
			if (this.addForm.goods_cat.length !== 3) {
				// 没有选中三级分类，把分类重置为空
				this.addForm.goods_cat = [];
			} else {
				// 选中了三级分类后，获取该分类对应的参数列表数据
				this.addForm.goods_cat.length > 0 ? (this.addForm.goods_cat = this.addForm.goods_cat.join(',')) : (this.addForm.goods_cat = '');
				this.isleave = true;
			}
		},
		// 获取动态参数
		getMany() {
			console.log(this.cateId);
			http({
				url: `/categories/${this.cateId}/attributes`,
				method: 'get',
				params: {
					sel: 'many'
				}
			}).then(res => {
				console.log(res);
				console.log(res.data);
				if (res.meta.status !== 200) return this.$message.error('获取动态参数列表失败！');
				// 把动态参数中的每一项数据中的 attr_vals，都从字符串分割为数组
				/* res.data.forEach(item => {
					item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',');
				}); */
				this.manyData = res.data;
				console.log(this.manyData);
			});
		},
		// 获取静态属性
		getOnly() {
			http({
				url: `/categories/${this.cateId}/attributes`,
				method: 'get',
				params: {
					sel: 'only'
				}
			}).then(res => {
				console.log(res);
				if (res.meta.status !== 200) return this.$message.error('获取静态属性列表失败！');
				this.onlyData = res.data;
			});
		},
		// isLeave
		isLeave(activeName, oldActiveName) {
			if (oldActiveName == 0 && activeName != 0) {
				if (!this.isleave) {
					this.$message.error('请先选择商品分类！');
					return false;
				}
			}
			if (activeName == 1) {
				this.getMany();
			}
			if (activeName == 2) {
				this.getOnly();
			}
		},

		// 预览图片时候，触发的方法
		handlePreview(result) {
			console.log(result);
			this.previewImgSrc = result.response.data.url;
			this.previewVisible = true;
		},
		// 当移除图片，会触发这个方法
		handleRemove(result) {
			console.log(result);
			// 根据 result.response.data.temp_path 从 addForm.pics 数组中，找到要删除那个对象的索引值
			const index = this.addForm.pics.findIndex(item => item.pic === result.response.data.tmp_path);
			// 根据索引删除对应的图片信息对象
			this.addForm.pics.splice(index, 1);
		},
		// 图片上传成功
		handleSuccess(result) {
			console.log(result);
			if (result.meta.status === 200) {
				// 把上传成功后，图片的临时路径，保存到 addForm.pics 数组中，作为对象来保存
				this.addForm.pics.push({pic: result.data.tmp_path});
				this.$message.success('图片上传成功！');
			}
		},
		submit() {
			console.log(this.addForm);
			// 先处理好商品相关的数据格式，然后再提交
			const newForm = _.cloneDeep(this.addForm);
			console.log(newForm.goods_cat);
			// newForm.goods_cat = newForm.goods_cat.join(',')
			// 到此位置，商品相关数据已经准备好，可以提交了
			http({
				url: 'goods',
				method: 'post',
				data: newForm
			}).then(res => {
				console.log(res);
				if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
				this.$message.success('添加商品成功！');
				// 跳转到商品列表页
				// this.addDialogVisible = false;
                this.$router.push('/home/goods')
			});
		},
		// 添加
		addGoods() {
			console.log(this.addForm);
			// this.$refs.addFormRef.validate(async valid => {
			// 	if (!valid) return;
			http({
				url: '/goods',
				method: 'post',
				data: this.addForm
			}).then(res => {
				console.log(res);
				if (res.meta.status !== 201) {
					return this.$message.error('添加用户失败！');
				}
				this.$message.success('添加用户成功！');
				console.log('22222');
				// this.addDialogVisible = false;
				// this.getGoods();
				// (this.addForm.username = ''), (this.addForm.password = ''), (this.addForm.email = ''), (this.addForm.mobile = '');
			});
			// });
		},
		// 取消
		resetAddForm() {
			(this.editForm.goods_name = ''), (this.editForm.goods_price = ''), (this.editForm.goods_number = ''), (this.editForm.goods_weight = '');
		},
		// 返回商品列表
		goBack() {
			console.log('111');
			this.addDialogVisible = false;
            this.$router.push('/home/goods')
			this.getGoods();
		},

		// 修改分类
		showEditDialog(row) {
			console.log(row);
			this.editForm.goods_id = row.goods_id;
			this.editForm.goods_name = row.goods_name;
			this.editForm.goods_price = row.goods_price;
			this.editForm.goods_number = row.goods_number;
			this.editForm.goods_weight = row.goods_weight;
			this.editDialogVisible = true;
		},
		edit(editForm) {
			this.$refs.addFormRef.validate(async valid => {
				if (!valid) return;
				console.log(editForm.goods_name);
				http({
					url: `/goods/${editForm.goods_id}`,
					method: 'put',
					data: {
						goods_name: editForm.goods_name,
						goods_price: editForm.goods_price,
						goods_number: editForm.goods_number,
						goods_weight: editForm.goods_weight,
						goods_cat: `${this.addForm.goods_cat[0]},${this.addForm.goods_cat[1]},${this.addForm.goods_cat[2]}`
					}
				}).then(res => {
					console.log(res);
					if (res.meta.status !== 200) {
						return this.$message.error('修改分类失败！');
					}
					// 把获取到的用户信息对象，保存到 编辑表单数据对象中
					this.$message.success('修改分类成功！');
					this.editDialogVisible = false;
					this.getGoods()
				});
			});
		},

		// 删除单个
		async remove(row) {
			await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'});
			http({
				url: `goods/${row.goods_id}`,
				method: 'delete'
			}).then(res => {
				if (res.meta.status !== 200) return this.$message.error('删除用户失败！');
				this.$message.success('删除用户成功！');
				this.getGoods();
			});
		},
		//请求商品列表数据封装
		async getGoods() {
			goods_res(this.queryInfo).then(res => {
				// console.log(res.data);
				if (res.meta.status !== 200) {
					return this.$message.error('查询用户列表失败！');
				}
				this.total = res.data.total;
				this.goodslist = res.data.goods;
				// console.log('gett');
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
			this.getGoods();
		},
		handleCurrentChange(val) {
			this.queryInfo.pagenum = val;
			this.getGoods();
		}
	},
	created() {
		this.getGoods();
		// this.addGoods()
		this.getCategories();
	},
	computed: {
		cateId() {
			console.log(this.addForm.goods_cat);
			let newCat = this.addForm.goods_cat.split(',');
			console.log(newCat);
			if (newCat.length === 3) {
				return newCat[newCat.length - 1];
			} else {
				return null;
			}
		}
	},
	components: {}
};
</script>

<style scoped lang="less">
// 内容
.goodslist {
	margin-top: 15px;
	padding: 20px;
	background-color: #fff;
	border-radius: 5px;
	text-align: center;
	// 搜索
	.el-goodslist-top {
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
	.addGoods {
		text-align: center;
		.back {
			margin-bottom: 15px;
		}
		.Steps {
			margin: 15px 0;
		}
		.basicInfo {
			text-align: start;
		}
	}
	.table {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
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
.ppp {
	text-align: start;
	margin-bottom: 25px;
	p {
		margin: 15px 0;
	}
}
.tabs {
	text-align: start;
}
.submit {
	margin: 30px 0;
}
</style>
