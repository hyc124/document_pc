<template>
  <div class="operation">
    <div class="box" v-for="(item,index) in operation.obj" :key="index">
      <div class="title">
        <a-checkbox
          @change="onCheckAllChange($event,item,index)"
          :disabled="grade==1"
          :checked="obj[item.id].checkAll"
        >{{item.modula}}</a-checkbox>
      </div>
      <a-checkbox-group
        @change="onGrupCheck($event,item.id,index)"
        :disabled="grade==1"
        v-model="obj[item.id].arry"
      >
        <div class="content">
          <a-checkbox
            v-for="(item2,index2) in  item.node"
            :key="'o-'+index2"
            :defaultChecked="item2.checked"
            :value="item2.id"
          >{{item2.node_name}}</a-checkbox>
        </div>
      </a-checkbox-group>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    operation: {
      default: null
    },
    grade: {
      default: null
    }
  },
  data() {
    return {
      obj: {
        10001: { checkAll: false, arry: [] },
        10002: { checkAll: false, arry: [] },
        10003: { checkAll: false, arry: [] },
        10004: { checkAll: false, arry: [] },
        10006: { checkAll: false, arry: [] },
        10007: { checkAll: false, arry: [] },
        10008: { checkAll: false, arry: [] }
      },
      indeterminate: false
    };
  },
  methods: {
    onGrupCheck(info, id, index) {
      if (info.length == this.operation.obj[index].node.length) {
        this.obj[id].checkAll = true;
      } else {
        this.obj[id].checkAll = false;
      }
      this.handleObj();
    },
    onCheckAllChange(e, item, index) {
      if (e.target.checked) {
        this.operation.obj[index].node.forEach(el => {
          this.obj[item.id].arry.push(el.id);
        });
        this.obj[item.id].checkAll = true;
      } else {
        this.obj[item.id].arry = [];
        this.obj[item.id].checkAll = false;
      }
      this.handleObj();
    },
    //得到初始选中数据
    get_defaultValue() {
      let _this = this;
      for (let el in this.obj) {
        this.obj[el].arry = [];
        this.obj[el].checkAll = false;
      }
      this.operation.obj.forEach(element => {
        if (element.node.length > 0) {
          element.node.forEach(element2 => {
            if (element2.checked) {
              _this.obj[element.id].arry.push(element2.id);
            }
          });
          if (element.node.length == _this.obj[element.id].arry.length) {
            _this.obj[element.id].checkAll = true;
          }
        }
      });
      this.handleObj();
    },
    handleObj() {
      let _arry = [];
      for (let el in this.obj) {
        _arry.push(...this.obj[el].arry);
      }
      this.operation.ids = _arry;
    }
  },
  watch: {
    "operation.obj": {
      handler(val, oldval) {
        this.get_defaultValue();
      },
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
.operation {
  .box {
    margin-bottom: 30px;
    .title {
      height: 48px;
      background: rgba(245, 247, 250, 1);
      border: 1px solid rgba(235, 238, 245, 1);
      padding: 14px 20px;
      color: #909399ff;
      font-size: 14px;
    }
    .content {
      border: 1px solid rgba(235, 238, 245, 1);
      width: 940px;
      padding: 20px;
      display: flex;
      flex-wrap: wrap;
      /deep/ .active {
        color: #0082efff;
      }
      /deep/ .ant-checkbox-wrapper {
        width: 200px;
        margin-right: 60px;
        margin-left: 0;
        margin-bottom: 20px;
      }
    }
  }
}
</style>