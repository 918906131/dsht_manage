import request from './use_interface'
export function login_res() {
    return request({
        url: "/login",
        method: "post",
        data: {
            username: "admin",
            password: "123456",
        },
    })
}



//获取左侧菜单数据
export function menus_res() {
    return request({
        url: "/menus",
        method: "get",
    })
}

//获取用户数据列表
export function users_res(queryInfo) {
    return request({
        url: "/users",
        method: "get",
        params: queryInfo
    })
}
// 用户查询
export function usersSearch_res(id) {
    return request({
        url: `/users/${id}`,
        method: 'get'
    })
}
// 添加用户
export function add_res(addForm) {
    return request({
        url: "/users",
        method: "post",
        data: addForm
    })
}
// 用户状态更新
export function usersChange_res(id, newState) {
    return request({
        url: `/users/${id}/state/${newState}`,
        method: "put",
    })
}
// 修改用户信息
export function usersEdit_res(id, mobile, email) {
    return request({
        url: `/users/${id}`,
        method: "put",
        data: {
            mobile: mobile,
            email: email
        }
    })
}
// 删除单个用户
export function usersRemove_res(id) {
    return request({
        url: `/users/${id}`,
        method: "delete",
    })
}


// 获取商品分类数据
export function categories_res(queryInfo) {
    return request({
        url: "/categories",
        method: "get",
        params: queryInfo
    })
}
// 添加分类
export function addCat_res(queryInfo) {
    return request({
        url: "/categories",
        method: "post",
        data: queryInfo
    })
}
// 修改分类名称
export function catEdit_res(id, name) {
    return request({
        url: `/categories/${id}`,
        method: "put",
        data: {
            cat_name: name
        }
    })
}
// 删除单个分类名称
export function catRemove_res(id) {
    return request({
        url: `/categories/${id}`,
        method: "delete",
    })
}

// 请求参数列表
export function getParams_res(id, sels) {
    return request({
        url: `/categories/${id}/attributes`,
        method: "get",
        params: {
            sel: sels
        }
    })
}


// 获取商品列表数据
export function goods_res(queryInfo) {
    return request({
        url: "/goods",
        method: "get",
        params: queryInfo
    })
}
// 用户查询
export function goodsSearch_res(id) {
    return request({
        url: `/goods/${id}`,
        method: 'get'
    })
}



//获取首页数据
export function home_res() {
    return request({
        url: "/home",
        method: "get",
    })
}
//角色列表
export function rights_res() {
    return request({
        url: "/roles",
        method: "get",
    })
}

//权限列表
export function rights_list() {
    return request({
        url: "/rights/tree",
        method: "get",
    })
}
//添加角色
export function add_roles(name, desc) {
    return request({
        url: "/roles",
        method: "post",
        data: {
            roleName: name,
            roleDesc: desc,
        },
    })
}
//删除角色
export function delete_(id) {
    return request({
        url: `/roles/${id}`,
        method: "delete",

    })
}
//编辑角色
export function edit_(id, name, desc) {
    return request({
        url: `/roles/${id}`,
        method: "put",
        data: {
            roleDesc: desc,
            roleName: name,
        },
    })
}
//订单管理
export function order_list(num) {
    return request({
        url: `/orders?pagesize=10&pagenum=${num}`,
        method: "get",
    })
}
//编辑订单
export function edit_order(id, is_send, order_pay, order_price, order_number, pay_status) {
    return request({
        url: `/orders/${id}`,
        method: "put",
        data: {
            is_send,
            order_pay,
            order_price,
            order_number,
            pay_status
        },
    })
}
//查看物流
export function kuaidi(id) {
    return request({
        url: `/kuaidi?${id}`,
        method: "get",
    })
}
//查询订单信息
export function search_order(id) {
    return request({
        url: `/orders/${id}`,
        method: "get",
    })
}
//数据表
export function data_list() {
    return request({
        url: "reports/type/1",
        method: "get",
    })
}
//更新权限
export function updata_premiss(id, arr) {
    return request({
        url: `roles/${id}/rights`,
        method: "post",
        data: {
            rids: arr
        },
    })
}