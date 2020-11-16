// import router from '../router';
export default {
    // 用户信息
    USERINFO (state, data) {
        state.userinfo = data;
        sessionStorage.setItem("userinfo", JSON.stringify(data));
    },
    // 获取权限
    SET_LEFTDATA_jurisdiction (state, data) {
        state.jurisdiction = data;
        sessionStorage.setItem("jurisdiction", JSON.stringify(data));
    },
    // 改变加载中状态
    SET_lodingOnOff (state, data) {
        state.lodingOnOff = data.onOff
        state.lodingText = data.text
    },
    // 公文交换未读提醒状态改变
    REMINDONOFF (state, data) {
        state.remindOnOff = data
    },
    // 新增和编辑模板状态改变
    // REFRESHTEMPLATE(state, data) {
    //     state.refreshTemplate = data
    // },
    // ------------------------------------------------------------------
    // 点击列表菜单切换选中菜单
    ADDOPENCHANG (state, data) {
        if (data.key == '/login') {
            state.openKeys.push('登录');
        } else {
            let num = state.openKeys.indexOf(data.title);
            if (num == -1) {
                state.openKeys.push(data.title);
            }
        }
        state.selectedKeys = [`${data.key}`];
    },
    // 点击列表菜单展开菜单
    ADDOPENKEYS (state, data) {
        state.openKeys = data.arrays;
    },
    CLICKHEADER (state, data) {
        state.headerindex = data.num;
    },
    // ------------------------------------------------------------------
    //发文拟稿数据设置
    //设置头部数据
    SET_DOCUMENT_HEADER (state, data) {
        state.document_all.header = data;
    },
    SET_DOCUMENT_distribute_time (state, data) {
        state.document_all.distribute_time = data;
    },
    // 新建发文收文签报套红id改变
    SET_REDTEMPLATEDATA (state, data) {
        state.document_all.process.red_template_model = data
    },
    //设置头部选择的数据（value）
    SET_DOCUMENT_HEADER_select (state, data) {
        for (let key in data) {
            state.document_all.header[key].value = data[key] || { select: [], text: "" };
        }
    },

    //设置接收人
    SET_DOCUMENT_HEADER_reviewer (state, data) {
        state.document_all.header.reviewer.value = data;
    },

    //设置字号数据
    SET_DOCUMENT_WORD_NO (state, data) {
        state.document_all.header.word_no.value.word_no = data;
    },
    //设置字号id

    SET_DOCUMENT_WORD_NO_ID (state, data) {
        state.document_all.header.word_no.value.id = data;
    },
    //设置正文数据
    SET_DOCUMENT_CONTENT (state, data) {
        state.document_all.content = data;
    },


    //设置快速回复
    SET_DOCUMENT_PROCESS_opinion (state, data) {
        state.document_all.process.opinion = data;
    },

    //设置附件
    SET_DOCUMENT_FILES (state, data) {
        state.document_all.files = data;
    },
    //设置通知选项
    SET_DOCUMENT_NOTICE (state, data) {
        state.document_all.process.msg_time = data;
    },
    //设置通知方式
    SET_DOCUMENT_NOTICE_WAYS (state, data) {
        state.document_all.process.way = data;
    },
    //设置审核附件
    SET_FILE_APPROVAL (state, data) {
        state.document_all.process.approval_file = data;
    },
    //设置审核流程数据
    SET_APPROVAL_approval_where (state, data) {
        state.document_all.process.approval_where = data;
    },
    //设置审核流程数据
    SET_APPROVAL_approval_copy (state, data) {
        state.document_all.process.approval_copy = data;
    },
    //设置当前流程
    SET_DOCUMENT_PROCESS_liucheng (state, data) {
        state.document_all.process.liucheng_id = data;
    },


    //设置部门
    SET_DOCUMENT_PROCESS_department (state, data) {
        state.document_all.process.department = data;
    },


    //设置签章 
    SET_DOCUMENT_PROCESS_signature (state, data) {
        state.document_all.process.signature = data;
    },
    //清空数据(头部)
    SET_DOCUMENT_ALL (state, data) {
        state.document_all.header = data
    },

    SET_DOCUMENT_ALL_DATA (state, data) {
        state.document_all = data
    },
    //清空数据（附件）
    RESET_SET_DOCUMENT_FILES (state, data) {
        state.document_all.files = [];
    },
    // ------------------------------------------------------------------
    // ------------------------------------------------------------------
    // 快速发文
    //设置审核头部数据
    SET_QUICK_DOCUMENT_HEADER (state, data) {
        state.quick_draft.header = data;
    },

    //设置字号数据(名称)
    SET_QUICK_DOCUMENT_WORD_NO (state, data) {
        state.quick_draft.header.word_no.value.word_no = data;
    },
    //设置字号数据(id)
    SET_QUICK_DOCUMENT_WORD_NO_ID (state, data) {
        state.quick_draft.header.word_no.value.id = data;
    },

    //设置套红模板内容
    SET_QUICK_DOCUMENT_red_template (state, data) {
        state.quick_draft.process.red_template_model.content = data
    },
    // 设置套红模板
    SET_QUICK_REDTEMPLATEDATA (state, data) {
        state.quick_draft.process.red_template_model = data
    },
    //设置头部选择的数据（value）
    // 发文
    SET_QUICK_DOCUMENT_HEADER_issuer (state, data) {
        state.quick_draft.header.issuer.value = data;
    },
    SET_QUICK_DOCUMENT_HEADER_main_delivery (state, data) {
        state.quick_draft.header.main_delivery.value = data;
    },
    SET_QUICK_DOCUMENT_HEADER_copy_users (state, data) {
        state.quick_draft.header.copy_users.value = data;
    },
    // 收文
    SET_QUICK_DOCUMENT_HEADER_received_delivery (state, data) {
        state.quick_draft.header.received_delivery.value = data;
    },
    SET_QUICK_DOCUMENT_HEADER_receiving_unit (state, data) {
        state.quick_draft.header.receiving_unit.value = data;
    },
    SET_QUICK_DOCUMENT_HEADER_receiving_user (state, data) {
        state.quick_draft.header.receiving_user.value = data;
    },
    //签报

    //设置接收人
    SET_QUICK_DOCUMENT_HEADER_reviewer (state, data) {
        state.quick_draft.header.reviewer.value = data;
    },


    //设置正文数据
    SET_QUICK_DOCUMENT_CONTENT (state, data) {
        state.quick_draft.content = data;
    },

    //设置快速回复
    SET_QUICK_DOCUMENT_PROCESS_opinion (state, data) {
        state.quick_draft.process.opinion = data;
    },
    //设置当前流程
    SET_QUICK_DOCUMENT_PROCESS_liucheng (state, data) {
        state.quick_draft.process.liucheng_id = data;
    },

    //设置附件
    SET_QUICK_DOCUMENT_FILES (state, data) {
        state.quick_draft.files = data;
    },
    //设置通知选项
    SET_QUICK_DOCUMENT_NOTICE (state, data) {
        state.quick_draft.process.msg_time = data;
    },
    //设置审核附件
    SET_QUICK_DOCUMENT_APPROVAL (state, data) {
        state.quick_draft.process.approval_file = data;
    },
    //设置审核流程数据
    SET_QUICK_DOCUMENT_approval_where (state, data) {
        state.quick_draft.process.approval_where = data;
    },
    //设置审核流程数据
    SET_QUICK_DOCUMENT_approval_copy (state, data) {
        state.quick_draft.process.approval_copy = data;
    },

    //设置部门
    SET_QUICK_DOCUMENT_PROCESS_department (state, data) {
        state.quick_draft.process.department = data;
    },


    //设置签章 
    SET_QUICK_DOCUMENT_PROCESS_signature (state, data) {
        state.quick_draft.process.signature = data;
    },
    //清空数据
    SET_QUICK_DOCUMENT_ALL (state, data) {
        state.quick_draft = data;
    },

    // ------------------------------------------------------------------
    // 审核

    //设置审核头部数据
    SET_LEFTDATA_FIELDS_issuer (state, data) {
        state.leftdata.fields.issuer.value = data;
    },
    SET_LEFTDATA_FIELDS_distribute_time (state, data) {
        state.leftdata.distribute_time = data;
    },
    SET_LEFTDATA_FIELDS_main_delivery (state, data) {
        state.leftdata.fields.main_delivery.value = data;
    },
    SET_LEFTDATA_FIELDS_reviewer (state, data) {
        state.leftdata.fields.reviewer.value = data;
    },
    SET_LEFTDATA_FIELDS_copy_users (state, data) {
        state.leftdata.fields.copy_users.value = data;
    },
    SET_LEFTDATA_FIELDS_received_delivery (state, data) {
        state.leftdata.fields.received_delivery.value = data;
    },
    SET_LEFTDATA_FIELDS_receiving_unit (state, data) {
        state.leftdata.fields.receiving_unit.value = data;
    },
    SET_LEFTDATA_FIELDS_receiving_user (state, data) {
        state.leftdata.fields.receiving_user.value = data;
    },

    //设置使用/删除签章
    SET_LEFTDATA_use_signature (state, data) {
        state.use_zhang = data
    },
    //设置别人使用的签章
    SET_LEFTDATA_other_zhang (state, data) {
        state.other_zhang = data
    },
    // 设置套红模板
    SET_LEFTDATA_red_template (state, data) {
        state.leftdata.red_template_model = data
    },
    // 重置vuex
    RESET_Vuex_TOEXAMINE (state, data) {
        state.leftdata = {
            auth: null,
            can_approval: null,
            red_template_model: {
                content: '',
                id: '',
                name: ''
            },
            fields: null,
            content: null,
            enclosure: "",
            process_urgent_level: 1,
            templete_id: null,
            deptid: null,
            id: null,
            type: null,
            distribute_id: null,
            status: null,
            button: null,
            is_fast: null,
            process_id: null,
            red_templete_content: "",
        };
        state.toexamine = {
            where_id: "",
            explain: "",
            status: 3,
            files: "",
            time: "",
            way: "4,1",
            notice: 1,
            process_urgent_level: 1,
            signature: [],
        };
    },
    // 清除附件
    SET_FILE_percent (state, data) {
        state.percent = data;
    },
    // 设置有无 button权限
    SET_TOEXAMINE_btn (state, data) {
        state.leftdata.button = data;
    },
    SET_TOEXAMINE_status (state, data) {
        state.leftdata.status = data;
    },
    // 审核
    // 设置有无权限审批
    SET_TOEXAMINE_auth (state, data) {
        state.leftdata.auth = data;
    },
    // 审核
    // 设置有无权限审批
    SET_TOEXAMINE_can_approval (state, data) {
        state.leftdata.can_approval = data;
    },
    //设置套红模板的内容
    SET_TOEXAMINE_red_templete_content (state, data) {
        state.leftdata.red_templete_content = data;
    },
    // 设置发文审核where_id
    SET_TOEXAMINE_where_id (state, data) {
        state.toexamine.where_id = data;
    },
    // 设置发文审核处理意见
    SET_TOEXAMINE_explain (state, data) {
        state.toexamine.explain = data;
    },

    // 设置发文审核审批附件
    SET_TOEXAMINE_files (state, data) {
        state.toexamine.files = data;
    },

    // 设置发文审核time
    SET_TOEXAMINE_time (state, data) {
        state.toexamine.time = data;
    },

    // 设置发文审核流程通知
    SET_TOEXAMINE_notice (state, data) {
        state.toexamine.notice = data;
    },
    // 重置流程通知，时间
    SET_TOEXAMINE_timeandnotice (state) {
        state.toexamine.time = "";
        state.toexamine.notice = 1;
    },

    // 设置发文信息leftdata.fields
    SET_LEFTDATA_fields (state, data) {
        state.leftdata.fields = data;
    },
    // 设置正文内容leftdata.content
    SET_LEFTDATA_content (state, data) {
        state.leftdata.content = data;
    },
    // 设置上传附件信息leftdata.info
    SET_LEFTDATA_enclosure (state, data) {
        state.leftdata.enclosure = data;
    },
    // 设置模板id
    SET_LEFTDATA_templete_id (state, data) {
        state.leftdata.templete_id = data;
    },

    // 设置模板id
    SET_LEFTDATA_deptid (state, data) {
        state.leftdata.deptid = data;
    },

    // 	公文的id 修改必填
    SET_LEFTDATA_id (state, data) {
        state.leftdata.id = data;
    },

    // 	1发文 2收文 3签报
    SET_LEFTDATA_type (state, data) {
        state.leftdata.type = data;
    },

    // 	公文分发记录id，如果是转收文，则必填
    SET_LEFTDATA_distribute_id (state, data) {
        state.leftdata.distribute_id = data;
    },

    //设置token
    SET_TOKEN (state, data) {
        state.token = data
    }
};
