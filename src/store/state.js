export default {
    lf_ht: 0, // 左侧导航栏的高度
    openKeys: ['1'], // 展开菜单数组
    selectedKeys: [], // 选中菜单数组
    headerindex: 0, // 头部菜单点击的下标
    // refreshTemplate: 'all', // 模板刷新状态
    //发文模板的数据
    document_all: {
        //头部值为后台传的每一个e_name
        header: {},
        //正文(内容，附件)
        content: {
            text: "",
            file: [],
        },
        //附件内容
        files: [],
        distribute_time: "",
        //流程
        process: {
            urgency: 1,
            department: '',
            msg_time: {
                day: null,
                hour: null,
                minute: null,
            },
            way: [1, 4],
            notice: false,
            liucheng_id: null,
            red_template_model: {
                content: '',
                id: '',
                name: ''
            }, //套红模板id
            opinion: null, //处理意见
            approval_file: [], //审批附件
            approval_where: [], //审批流程
            signature: [], //签章
        },
    },

    //快速发文数据
    quick_draft: {
        //头部值为后台传的每一个e_name
        header: {},
        //正文(内容，附件)
        content: {
            text: "",
            file: [],
        },
        //附件内容
        files: [],
        //流程
        process: {
            urgency: 1,
            department: '',
            liucheng_id: "null", //流程id
            red_template_model: {
                content: '',
                id: '',
                name: ''
            },
            opinion: "", //处理意见
            approval_file: [], //审批附件
            approval_where: [], //审批流程
            approval_copy: [], //抄送人员
            signature: [], //签章

            //指定下一个审批节点需要的数据
            approval_way: 2,//审批方式
            notice_way: [1, 4],//通知方式
        },
    },

    // 记录为正常，转审，下个
    is_s_x: 0,
    // 转审、下一节点数据
    is_s_x_data: null,
    // 自己的电子签章
    use_zhang: [],
    //别人的电子签章
    other_zhang: [],
    // 审核左边数据
    leftdata: {
        distribute_time: "",
        //有无权限
        auth: null,
        // 有无权限审批
        can_approval: null,

        //套红模板
        red_template_model: {
            content: '',
            id: '',
            name: ''
        },
        // 发文信息  接口名 document_arr
        fields: null,
        // 正文内容
        content: null,
        // 附件内容 接口名 enclosure_file
        enclosure: "",
        // 1普通2紧急3加急 ,流程的紧急程度、
        process_urgent_level: 1,
        //模板id
        templete_id: null,
        //当前选择的部门id
        deptid: null,
        // 	公文的id 修改必填
        id: null,
        // 1发文 2收文 3签报
        type: null,
        // 状态 1、等待中 2、审核进行中 3、审核通过 4、审核拒绝 5、已撤销 ， 6 暂放，7报废，8草稿，9归档
        // status: null,
        // 公文分发记录id，如果是转收文，则必填
        distribute_id: null,
        // 流程启动后，多少时间未完成通知我 单位秒
        // msg_time: "",
        //流程启动后，多少时间未完成通知我，通知方式 1待办 2邮箱 3短消息 逗号隔开
        // way: "",
        // 审批附件 ，二维数组形式
        // approval_file: "",
        //处理意见
        // opinion: "",
        status: null,
        button: null,
        is_fast: null,
        process_id: null,
        red_templete_content: "",
        word_no: {},
    },
    // 审批上传的附件
    percent: [],
    // 审核右边数据
    toexamine: {
        where_id: "", // 流程节点id
        explain: "", // 审核意见
        status: 3, // 审批状态 ：3：同意；4：拒绝 5、已撤销 ， 6 暂放，7 报废\
        files: "", //	审批处理文件 [‘path’:文件路径,’old_name’:文件名字,size：附件大小]
        time: "", //	启动后多长时间未完成通知我
        way: "4,1", // 通知方式 1待办 2邮箱 3短消息
        notice: 1, // 流程结束后是否通知我 1 不通知 2 流程结束通知我
        process_urgent_level: 1, // 流程设置的紧急程度 1普通 2紧急 3加急
        signature: [],
    },
    // 用户信息
    userinfo: JSON.parse(sessionStorage.getItem("userinfo")),
    // 权限信息
    jurisdiction: JSON.parse(sessionStorage.getItem("jurisdiction")) || {},
    //token
    token: sessionStorage.getItem("token") || null,
    // 加载中状态开关
    lodingOnOff: false,
    // 加载中状态文字内容
    lodingText: '',
    // 公文交换有未读提醒
    remindOnOff: false
};
