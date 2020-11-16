// 建议反馈 BUG反馈接口
import server from '@/utils/request'

// 反馈信息
export function Feedbackinfo(data={}) {
    data.condition = 1;
    return server({
        url: "document_bug_feedback",
        method: "post",
        data
    });
}