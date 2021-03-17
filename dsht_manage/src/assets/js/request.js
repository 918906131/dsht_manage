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