// 公文交换 > 公文分发
import server from "@/utils/request";

// 公文分发 > 接收列表
export function acceptList(data={}) {
  data.condition = 1;
  return server({
    url: "distribute_mine",
    method: "post",
    data,
  });
}

// 公文分发 > 接收列表 > 详情和新增页面 吧
export function addacceptInfo(data={}) {
  return server({
    url: "distribute_file_detail",
    method: "post",
    data,
  });
}

// 公文分发 > 接收列表 > 详情页面退回
export function addgiveBack(data={}) {
  data.condition = 1;
  return server({
    url: "distribute_return",
    method: "post",
    data,
  });
}

// 转审功能
export function approval_my_shift(data={}) {
  data.condition = 1;
  return server({
    url: "approval_my_shift",
    method: "post",
    data,
  });
}
