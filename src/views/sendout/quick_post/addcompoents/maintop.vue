<template>
  <div class="addInpostrafts-main-top">
    <div class="title">
      <span class="text">正文内容</span>
      <div class="upload hand">
        <a-upload
          name="avatar"
          :showUploadList="false"
          :multiple="true"
          :beforeUpload="beforeUpload"
          :customRequest="customRequest"
          :disabled="upload_state"
        >
          <div v-show="!upload_state" class="upload">
            <i class="upload-icon"></i>
            导入正文内容
            <span style="font-size: 12px; color: #c0c6cc"
              >(上传格式txt,docx)</span
            >
          </div>
          <div v-show="upload_state" class="upload">
            <a-icon type="loading" />
            <span>上传中...</span>
          </div>
        </a-upload>
      </div>
    </div>

    <div class="box">
      <a-button class="top-center-btn" @click="onEmpty">清空</a-button>
      <div class="box2">
        <div class="main-top-center" id="editor" ref="editor"></div>
        <div
          ref="signature_box"
          class="flex-end"
          v-show="get_process.signature && get_process.signature.length > 0"
        >
          <div
            class="seal"
            :style="
              'z-index:' +
              item.zindex +
              'px;top:' +
              item.position.top +
              'px;left:' +
              item.position.left +
              'px;width:' +
              item.position.width +
              'px'
            "
            v-for="(item, index) in get_process.signature"
            :key="index"
            :data-inx="index"
          >
            <div class="del" @click.stop="delete_signature(index)"></div>
            <div class="zoom" @mousedown="zoomElement(index, $event)"></div>
            <div
              class="mask"
              @mousedown="move_signature_down(index, $event)"
            ></div>
            <img
              class="zhang"
              :src="'data:image/png;base64,' + item.signature_img"
              alt
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { public_data_files, randomnumber, contenFilters } from "@/js/public";
import { get_word } from "@/api/public";
export default {
  name: "Maintop",
  data() {
    return {
      headers: {
        authorization: "authorization-text",
      },
      text: "",
      //----------------------------------
      //文件上传进度
      progress: 0,
      that_reFresh: false, //当前文件是否上传成功
      upload_state: false, //按钮状态
      that_percent: {}, //当前文件数据
      percent: [], // 上传文件的数据

      //用于vuex的文件数据
      vuex_percent: [],
      that_file_size: null,

      //副文本
      editor: null,

      //上传按钮状态
      upload_flag: false,

      //签章图片
      signature_img: null,
      //签章移动
      move_signature: {
        ismove: false, //用于隐藏显示图标
        isStartMove: false, //用于移动防抖
      },
    };
  },
  components: {},
  created() {
    //接收父组件的提交申请
    this.$bus.$off("document_content_quick");
    this.$bus.$on("document_content_quick", this.set_content);
  },
  computed: {
    get_content() {
      return this.$store.state.quick_draft.content;
    },
    get_process() {
      return this.$store.state.quick_draft.process;
    },
  },
  mounted() {
    //创建副文本
    this.editor = new this.$E("#editor");
    this.editor.customConfig.onchange = (html) => {
      this.edit_ele();
    };
    this.editor.create();
    //当是草稿箱数据的时候获取正文数据
    if (this.get_content.text) {
      this.editor.txt.append(
        `<pre style="font-family:FangSong;">${contenFilters(
          this.get_content.text
        )}</pre>`
      );
    }
  },
  methods: {
    // 编辑正文的时候改变签章的位置
    edit_ele() {
      let text_H = document.querySelector(".w-e-text-container").clientHeight;
      document.querySelectorAll(".seal").forEach((element) => {
        let ele_H = parseInt(element.style?.top ? element.style?.top : 0);
        if (ele_H + 132 + element.clientHeight > text_H) {
          let ele_arr = Number(element.getAttribute("data-inx"));
          this.get_process.signature[ele_arr].position.top =
            text_H - 132 - element.clientHeight;
        }
      });
    },
    //缩放签章
    zoomElement(index, e) {
      let box2 = document.querySelectorAll(".seal")[index];
      e = e || window.event;
      e.stopPropagation();
      e.cancelBubble = true;
      var width = box2.offsetWidth;
      var height = box2.offsetHeight;
      var nowX = e.clientX;
      var nowY = e.clientY;

      var a = "";
      var b = "";
      window.onmousemove = function (e) {
        e = e || window.event;
        a = width + e.clientX - nowX;
        b = height + e.clientY - nowY;
        if (a > 170) {
          a = 170;
        }
        if (a < 120) {
          a = 120;
        }
        box2.style.width = a + "px";
      };
      window.onmouseup = () => {
        window.onmousemove = null;
        window.onmouseup = null;
        let _signature_arr = [...this.get_process.signature];
        _signature_arr[index].position.width = a;
        this.$store.commit(
          "SET_QUICK_DOCUMENT_PROCESS_signature",
          _signature_arr
        );
      };
    },
    //删除签章
    delete_signature(index) {
      let _signature_arr = [...this.get_process.signature];
      _signature_arr.splice(index, 1);
      this.$store.commit(
        "SET_QUICK_DOCUMENT_PROCESS_signature",
        _signature_arr
      );
    },
    //移动签章
    move_signature_down(index, event) {
      let _dom = document.querySelectorAll(".seal")[index];
      let disX = event.clientX - _dom.offsetLeft;
      let disY = event.clientY - _dom.offsetTop;
      this.move_signature.isStartMove = true;

      //设置层级
      let _signature_arr = [...this.get_process.signature];
      let _that_zindex = _dom.style.zIndex;
      var zindex_arr = _signature_arr.map((x) => x.position.zindex);
      let _max_zindex = Math.max(...zindex_arr);
      _signature_arr[index].position.zindex = _max_zindex + 1;
      window.onmousemove = (e) => {
        if (!this.move_signature.isStartMove) {
          return;
        }

        let left = e.clientX - disX;
        let top = e.clientY - disY;

        if (left > 548 - _dom.offsetWidth + 20) {
          left = 548 - _dom.offsetWidth + 20;
        }
        if (left < 20) {
          left = 20;
        }

        if (top < 0) {
          top = 0;
        }
        if (
          top >
          document.querySelector(".w-e-text").offsetHeight - _dom.offsetHeight
        ) {
          top =
            document.querySelector(".w-e-text").offsetHeight -
            _dom.offsetHeight;
        }
        if (top < 0) {
          top = 0;
        }

        _dom.style.left = left + "px";
        _dom.style.top = top + "px";

        window.onmouseup = () => {
          window.onmousemove = null;
          window.onmouseup = null;
          this.move_signature.isStartMove = false;

          //设置坐标位置
          _signature_arr[index].position.top = top;
          _signature_arr[index].position.left = left;

          this.$store.commit(
            "SET_QUICK_DOCUMENT_PROCESS_signature",
            _signature_arr
          );
        };
      };
    },
    // 点击清除正文里面的内容
    onEmpty() {
      this.editor.txt.html("");
    },
    //富文本添加内容
    append_editors() {
      this.editor.txt.append(
        `<pre style="font-family:FangSong;">${contenFilters(this.text)}</pre>`
      );
    },
    //向vuex发送数据
    set_content() {
      let content_text = this.editor.txt.html();
      this.$store.commit("SET_QUICK_DOCUMENT_CONTENT", {
        text: content_text,
        file: this.vuex_percent,
      });
    },
    //获取word文件内容
    async get_get_word() {
      let { data } = await get_word({
        path: this.that_percent.url + "/" + this.that_percent.data.key,
      });
      this.text = data;
      this.append_editors();
      this.upload_state = false;
    },
    handleChange() {},
    // 判断上传文件是否符合要求
    beforeUpload(file) {
      return public_data_files(file, ["txt", "docx"]);
    },
    // 获取上传文件信息以及从后端获取token
    customRequest(files) {
      this.that_file_size = files.file.size;
      this.upload_state = true;
      let { file } = files;
      this.uid = file.uid;
      randomnumber(files, this.saveFile);
    },
    // callback获取七牛云返回的数据
    saveFile(data) {
      this.that_reFresh = true;

      this.that_percent = data;

      this.get_get_word();
      this.percent.push(data);
      this.vuex_percent.push({
        oldname: data.name,
        path: data.url + "/" + data.data.key,
        size: this.that_file_size,
      });
    },

    //数据清空
    reste_data() {},
  },
  watch: {
    get_content() {
      this.editor.txt.html(`${this.get_content.text}`);
      this.vuex_percent = this.get_content.file;
    },
  },
};
</script>
<style lang="less" scoped>
@import url("./../../css/maintop.less");
</style>

