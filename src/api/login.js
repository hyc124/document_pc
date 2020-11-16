// 登录
import server from '@/utils/request'

// 账号密码登录
export function login(data={}) {
    data.condition = 1;
    return server({
        url: "document_login_pass",
        method: "post",
        data
    });
}
// 获取企业微信登录二维码
export function userinfo(data={}) {
    return server({
        url: "document_login_type",
        method: "post",
        data
    });
}

// 通过token用户数据
export function tokeninfo(data={}) {
    return server({
        url: "member_detail",
        method: "post",
        data
    });
}