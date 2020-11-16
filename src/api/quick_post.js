import server from "@/utils/request";
//快速发文

// 紧急程度
export function urgent_type_list (data = {}) {
    return server({
        url: "urgent_type_list",
        method: "post",
        data,
    });
}
// 密级程度
export function secret_type_list (data = {}) {
    return server({
        url: "secret_type_list",
        method: "post",
        data,
    });
}
// 获取部门
export function member_detail_withobj (data = {}) {
    return server({
        url: "member_detail_withobj",
        method: "post",
        data,
    });
}
// 提交
export function document_add_fast(data={}) {
  data.condition = 1;
  return server({
    url: "document_add_fast",
    method: "post",
    data,
  });
}
