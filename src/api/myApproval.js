//模板设置
import server from "@/utils/request";

//获取发文流程设置列表
export function myApprovalTep(data={}) {
  return server({
    url: "approval_my_template",
    method: "post",
    data,
  });
}

