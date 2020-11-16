//系统管理页面
import server from '@/utils/request'

//角色管理>列表接口
export function get_role_list(params) {
    return server({
        url: "document_role_index",
        method: "get",
        params
    });
}

//角色管理>修改角色
export function update_role(data={}) {
    data.condition = 1;
    return server({
        url: "document_role_update",
        method: "post",
        data
    });
}
//角色管理>添加角色
export function add_role(data={}) {
    data.condition = 1;
    return server({
        url: "document_role_add",
        method: "post",
        data
    });
}
//角色管理>获取用户
export function get_roloe_name(params) {
    return server({
        url: "document_auth_index",
        method: "get",
        params
    });
}
//角色管理>获取用户
export function power_setting_index(params) {
    return server({
        url: "power_setting_index",
        method: "get",
        params
    });
}
//角色管理>删除用户
export function delete_role(params) {
    data.condition = 1;
    return server({
        url: "document_role_delete",
        method: "get",
        params
    });
}
//角色管理>角色编辑>操作权限
export function update_role_oper(data={}) {
    data.condition = 1;
    return server({
        url: "power_setting",
        method: "post",
        data
    });
}
//角色管理>角色编辑>数据权限
export function update_role_data(data={}) {
    data.condition = 1;
    return server({
        url: "document_auth_data_set",
        method: "post",
        data
    });
}
//系统管理>登录日志
export function logoinjournal(data={}) {
    return server({
        url: "login_log_list",
        method: "post",
        data
    });
}
//系统管理>操作日志
export function operationjournal(data={}) {
    return server({
        url: "operation_log_list",
        method: "post",
        data
    });
}
//系统管理>操作日志详情
export function operationjournal_detail(data={}) {
    return server({
        url: "operation_log_detail",
        method: "post",
        data
    });
}

//短信管理>修改設置
export function updateSms(data={}) {
    data.condition = 1;
    return server({
        url: "system_setting_sms_update",
        method: "post",
        data
    });
}
//短信管理>获取設置
export function getSmsDetail(data={}) {
    return server({
        url: "system_setting_sms_detail",
        method: "post",
        data
    });
}
//邮件管理>修改設置
export function updateEmail(data={}) {
    data.condition = 1;
    return server({
        url: "system_setting_email_update",
        method: "post",
        data
    });
}
//邮件管理>获取設置
export function getEmailDetail(data={}) {
    return server({
        url: "system_setting_email_detail",
        method: "post",
        data
    });
}
//系统设置获取水印设置
export function getSystemSetting(data={}) {
    return server({
        url: "document_systemsetting",
        method: "post",
        data
    });
}
//系统设置修改水印
export function editSystemSetting(data={}) {
    data.condition = 1;
    return server({
        url: "document_system_edit",
        method: "post",
        data
    });
}