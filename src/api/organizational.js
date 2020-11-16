// 组织架构
import server from '@/utils/request'

// 判断是否为第三方
export function GetSecret(data) {
    return server({
        url: "getSecret",
        method: "post",
        data
    });
}
// 同步组织架构接口
export function OrganiZational(params) {
    params.condition = 1;
    return server({
        url: "sync_organizational_structure",
        method: "get",
        params
    });
}

// 设置用户角色信息
export function SetUser(data = {}) {
    data.condition = 1;
    return server({
        url: "document_user_set_roles",
        method: "post",
        data
    });
}

// 条件查询角色列表
export function getUsersByRoleOrKwd(data = {}) {
    return server({
        url: "get_users_by_role_or_kwd",
        method: "post",
        data
    });
}
