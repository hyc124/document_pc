// 公文应用设置=>参数设置=>密集程度设置
import server from '@/utils/request'

export function get_roloe_menu(params) {
    return server({
        url: "power_setting_menu",
        method: "get",
        params
    });
}
