
<template>
  <div class="enclosure">
    <div class="flex-col">
      <span class="left">附件方式</span>
      <a-checkbox @change="onChange" v-model="value">上传附件</a-checkbox>
    </div>
    <div class="Mask" v-if="Edit"></div>
  </div>
</template>

<script>
export default {
  name: "Enclosure",
  props: ["Listdata"],
  components: {},
  data() {
    return {
      value: true //0不允许 1允许
    };
  },
  computed: {
    Edit() {
      return this.$route.query.edit != undefined;
    }
  },
  created() {
    if (this.Listdata.fujian == 0) {
      this.value = false;
    } else {
      this.value = true;
    }
  },
  methods: {
    onChange(e) {
      let val = 0;
      if (e.target.checked) {
        val = 1;
      } else {
        val = 0;
      }
      this.$emit("compileonFujian", val);
    }
  }
};
</script>

<style lang="less" scoped>
.Mask {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 2;
}
.enclosure {
  position: relative;
  padding-top: 14px;
  width: 1200px;

  .flex-col {
    width: 100%;
    height: 46px;
    line-height: 46px;
    background-color: #fff;
    border: 1px solid #ccc;
  }
  .left {
    text-align: center;
    display: inline-block;
    color: #303133;
    font-size: 14px;
    background-color: #f9f9f9;
    width: 150px;
    height: 100%;
    border-right: 1px solid #ccc;
    margin-right: 31px;
  }
  .radioleft {
    margin-right: 40px;
  }
}
</style>