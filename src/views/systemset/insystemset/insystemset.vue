<script src="../../../api/router.js"></script>
<template>
  <div>
    <Maintitle :titleObj="titleObj"></Maintitle>
    <Maincontent>
      <div class="set_system">
        <div class="set_system_title">
          <span>安全设置</span>
        </div>
        <div class="set_system_content">
          <span class="shuiyin">水印</span>
          <a-switch v-model="checked" @change="onChange" />
        </div>
      </div>

      <!--      <div class="set_system">-->
      <!--        <div class="set_system_title">-->
      <!--          <span>短信设置</span>-->
      <!--        </div>-->
      <!--        <div class="set_system_content">-->
      <!--          <span class="note">短信通知</span>-->
      <!--          <a-switch @change="onChange" />-->
      <!--        </div>-->
      <!--        <div @click="short">跳转短信验证</div>-->
      <!--        <div @click="email">跳转邮箱验证</div>-->
      <!--      </div>-->
    </Maincontent>
  </div>
</template>
<script>
import Maintitle from "@/views/components/maintitle.vue";
import Maincontent from "@/views/components/maincontent.vue";
import { getSystemSetting, editSystemSetting } from "@/api/roleset.js";

export default {
  components: {
    Maintitle,
    Maincontent
  },
  data() {
    return {
      // 头部需要的开关集合
      titleObj: {
        retu: false // 返回开关
      },
      checked: "" //是否关闭水印
    };
  },
  methods: {
    async onChange(checked) {
      let watermark = checked ? 1 : 0;
      let { data } = await editSystemSetting({
        field: "watermark",
        lab: watermark
      });
      setTimeout(this.getSystemSetting, 200);
    },
    //获取水印设置
    async getSystemSetting() {
      let { code, data } = await getSystemSetting();
      if (code == 1) {
        this.checked = data.watermark == 1 ? true : false;
      }
    }
  },
  created() {
    this.getSystemSetting();
  }
};
</script>
<style lang="less" scoped>
.set_system {
  padding: 1px;
  .set_system_title {
    color: #303133;
    font-size: 16px;
    margin: 29px 0 0 23px;
    padding:11px 0px;
    font-weight: 600;
    border-bottom: 1px solid #EEEEEE;
  }
  .set_system_content {
    margin-top: 20px;
    .shuiyin {
      padding-right: 40px;
      font-size: 14px;
      padding-left:80px;
    }
    .note {
      padding-right: 50px;
      font-size: 14px;
    }
    /deep/.ant-switch-checked {
      background-color: #00dd00;
    }
  }
}
</style>