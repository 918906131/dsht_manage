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
        params:queryInfo
    })
}
// 用户查询
export function usersSearch_res(id) {
    return request({
        url: `/users/${id}`,
        method:'get'
    })
}
// 添加用户
export function add_res(addForm) {
    return request({
        url: "/users",
        method: "post",
        data:addForm
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
export function usersEdit_res(id,mobile,email) {
    return request({
        url: `/users/${id}`,
        method: "put",
        data:{
            mobile:mobile,
            email:email
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
        params:queryInfo
    })
}
// 添加分类
export function addCat_res(queryInfo) {
    return request({
        url: "/categories",
        method: "post",
        data:queryInfo
    })
}
// 修改分类名称
export function catEdit_res(id,name) {
    return request({
        url: `/categories/${id}`,
        method: "put",
        data:{
            cat_name:name
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
export function getParams_res(id,sels) {
    return request({
        url: `/categories/${id}/attributes`,
        method: "get",
        params:{
            sel:sels
        }
    })
}


// 获取商品列表数据
export function goods_res(queryInfo) {
    return request({
        url: "/goods",
        method: "get",
        params:queryInfo
    })
}
// 用户查询
export function goodsSearch_res(id) {
    return request({
        url: `/goods/${id}`,
        method:'get'
    })
}



//获取首页数据
export function home_res() {
    return request({
        url: "/home",
        method: "get",
    })
}
//正在上映
export function movie_now() {
    return request({
        url: "/movie_now",
        method: "get",
    })
}

//等待上映
export function movie_future() {
    return request({
        url: "/movie_future",
        method: "get",
    })
}
//小组
export function group() {
    return request({
        url: "/group",
        method: "get",
    })
}