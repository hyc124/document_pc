// 公文交换 > 公文分发
import server from "@/utils/request";

// 公文分发 > 接收列表
export function get_watermark(data={}) {
  return server({
    url: "get_watermark",
    method: "post",
    data,
  });
}
