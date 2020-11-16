<template>
  <div class="mian">
    <a-table
      :columns="columns"
      :data-source="data"
      :row-selection="rowSelection"
      :pagination="false"
    >
      <span slot="operation" slot-scope="item,record">
        <div class="flex-col operation">
          <a-button type="danger">删除</a-button>
          <div @click="editclick(record,2)">同步组织架构</div>
        </div>
      </span>
    </a-table>
  </div>
</template>
<script>
export default {
  name: "Main",
  data() {
    return {
      data: null,
      columns: null,
      rowSelection: null,
    };
  },
  created() {
    this.columns = [
      {
        title: "序号",
        dataIndex: "indexid",
        key: "indexid",
        width: 80,
      },
      {
        title: "应用名称",
        dataIndex: "name",
        key: "name",
        scopedSlots: { customRender: "name" },
        width: 100,
      },
      {
        title: "应用Secret",
        dataIndex: "secret",
        key: "secret",
        ellipsis: true,
      },
      {
        title: "应用Agentld",
        dataIndex: "agentld",
        key: "agentld",
        width: 150,
      },
      {
        title: "添加时间",
        dataIndex: "adddate",
        key: "adddate",
      },
      {
        title: "操作",
        key: "operation",
        dataIndex: "operation",
        scopedSlots: { customRender: "operation" },
        width: 200,
      },
    ];
    this.data = [
      {
        key: "1",
        indexid: "1",
        name: "新闻公告",
        secret: "zN8RFYSYM7Dep09n9Ed9966dasdsdasdf55454",
        agentld: "1000109",
        adddate: "2020-03-31 09:25:42",
        tags: ["nice", "developer"],
      },
      {
        key: "2",
        indexid: "2",
        name: "护理排版",
        secret: "zN8RFYSYM7Dep09n9Ed9966dasdsdasdf55454",
        agentld: "1000109",
        adddate: "2020-03-31 09:25:42",
        tags: ["loser"],
      },
      {
        key: "3",
        indexid: "3",
        name: "投诉意见",
        secret: "zN8RFYSYM7Dep09n9Ed9966dasdsdasdf55454",
        agentld: "1000109",
        adddate: "2020-03-31 09:25:42",
        tags: ["loser"],
      },
      {
        key: "4",
        indexid: "4",
        name: "投诉意见",
        secret: "zN8RFYSYM7Dep09n9Ed9966dasdsdasdf55454",
        agentld: "1000109",
        adddate: "2020-03-31 09:25:42",
        tags: ["loser"],
      },
    ];
    this.rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          selectedRows
        );
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
      },
    };
  },
  methods: {
    editclick(el, num) {
      console.log(el);
    },
  },
};
</script>
<style lang="less" scoped>
.main {
  padding: 12px 0;
  .operation {
    //  justify-content: space-between;
    div {
      cursor: pointer;
    }
    div:hover {
      color: #0082ef;
    }
    /deep/.ant-btn-danger {
      width: 48px;
      height: 22px;
      padding: 0;
      margin-right: 10px;
    }
  }
}
</style>