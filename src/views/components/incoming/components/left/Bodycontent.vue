<template>
  <div class="bodycontent">
    <div class="upload" v-if="update_flag">
      <SvgIcon item="downloads" />
      <span style="margin: 0 10px 0 6px">上传文件</span>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="true"
        :beforeUpload="beforeUpload"
        :customRequest="customRequest"
        v-if="
          leftdata.auth.can_approval == 0 || leftdata.status == 20
            ? false
            : true
        "
      >
        <span style="color: #0082ef" class="hand">点击上传</span>
      </a-upload>
      <span class="tstext">(支持格式：txt,docx文件)</span>
    </div>

    <div class="box">
      <div class="box2">
        <a-button
          class="top-center-btn"
          @click="onEmpty"
          v-if="leftdata.auth.can_approval == 1||leftdata.status==20"
          >清空</a-button
        >
        <div
          class="main-top-center twoform-inline twoformh"
          id="editor"
          ref="editor"
        ></div>
        <div ref="signature_box" class="flex-end">
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
            v-for="(item, index) in get_state.other_zhang"
            :key="index"
          >
            <div
              v-if="item.handle == 1"
              class="del"
              @click.stop="delete_signature(index, 1)"
            ></div>
            <div
              v-if="item.handle == 1"
              class="zoom"
              @mousedown="zoomElement(index, $event, 1)"
            ></div>
            <div
              v-if="item.handle == 1"
              class="mask"
              @mousedown="move_signature_down(index, $event, 1)"
            ></div>
            <img
              class="zhang"
              :src="`data:image/png;base64,${item.img_data}`"
              alt
            />
          </div>
          <div
            class="seal seal2"
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
            v-for="(item, index) in get_state.use_zhang"
            :key="'use' + index"
            :data-inx="index"
          >
            <div class="del" @click.stop="delete_signature(index, 2)"></div>
            <div class="zoom" @mousedown="zoomElement(index, $event, 2)"></div>
            <div
              class="mask"
              @mousedown="move_signature_down(index, $event, 2)"
            ></div>

            <img
              class="zhang"
              :src="`data:image/png;base64,${item.img_data}`"
              alt
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SvgIcon from "@/views/components/svgicon.vue";
import { get_word } from "@/api/public.js";
import { randomnumber, public_data_files, contenFilters } from "@/js/public.js";
import { HttpUrl } from "@/js/public.js";
export default {
  name: "Bodycontent",
  props: {
    manager: {
      default: null,
    },
  },
  data() {
    return {
      HttpUrl,
      upload_state: false,
      files: [
        // 支持上传文件类型
        "txt",
        "docx",
      ],
      content_data: this.$store.state.leftdata.content,
      //签章移动
      move_signature: {
        ismove: false, //用于隐藏显示图标
        isStartMove: false, //用于移动防抖
      },
      update_flag: false,
    };
  },
  filters: {
    img(urls, url) {
      let text = String(urls).startsWith("http");
      let imgurl = "";
      if (text) {
        imgurl = urls;
      } else {
        imgurl = url + urls;
      }
      return imgurl;
    },
  },
  components: {
    SvgIcon,
  },
  computed: {
    leftdata() {
      return this.$store.state.leftdata;
    },
    get_state() {
      return this.$store.state;
    },
  },
  mounted() {
    this.editor = new this.$E("#editor");
    this.editor.customConfig.onchange = (html) => {
      this.edit_ele();
    };
    this.editor.create();
    this.editor.txt.html(`${this.content_data}`);

    if (this.leftdata.auth.can_approval == 1||this.leftdata.status==20) {
      if (this.manager.template_info) {
        let _template_type_arr = this.manager.template_info.content_type.split(
          ","
        );
        if (_template_type_arr.includes("2")) {
          this.editor.$textElem.attr("contenteditable", true);
        } else {
          this.editor.$textElem.attr("contenteditable", false);
        }

        if (this.manager.template_info.content_type.split(",").includes("1")) {
          this.update_flag = true;
        } else {
          this.update_flag = false;
        }
      } else {
        this.editor.$textElem.attr("contenteditable", true);
        this.update_flag = true;
      }
    } else {
      this.editor.$textElem.attr("contenteditable", false);
      this.update_flag = false;
    }

    if (this.manager.status == 3) {
      this.editor.$textElem.attr("contenteditable", false);
      this.update_flag = false;
    }
  },
  created() {
    this.$bus.$on("Set_content_data_data", this.set_content_data);
  },
  methods: {
    // 编辑正文的时候改变签章的位置
    edit_ele() {
      let text_H = document.querySelector(".w-e-text-container").clientHeight;
      document.querySelectorAll(".seal2").forEach((element) => {
        let ele_H = parseInt(element.style?.top ? element.style?.top : 0);
        if (ele_H + 132 + element.clientHeight > text_H) {
          // element.style.top = `${text_H - 132 - element.clientHeight}px`;
          let ele_arr = Number(element.getAttribute("data-inx"));
          this.get_state.use_zhang[ele_arr].position.top =
            text_H - element.clientHeight;
        }
      });
    },
    //缩放签章(val=1：别人的签章;val=2：自己使用的签章)
    zoomElement(index, e, val) {
      let box2 = null;
      if (val == 1) {
        box2 = document.querySelectorAll(".seal")[index];
      } else {
        box2 = document.querySelectorAll(".seal2")[index];
      }

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
        // box2.style.height = b + 'px'
      };
      window.onmouseup = () => {
        window.onmousemove = null;
        window.onmouseup = null;
        let _signature_arr =
          val == 2
            ? [...this.get_state.use_zhang]
            : [...this.get_state.other_zhang];
        _signature_arr[index].position.width = a;
        if (val == 1) {
          this.$store.commit("SET_LEFTDATA_other_zhang", _signature_arr);
        } else {
          this.$store.commit("SET_LEFTDATA_use_signature", _signature_arr);
        }
      };
    },
    //移动签章
    move_signature_down(index, event, val) {
      let _dom = null;
      if (val == 1) {
        _dom = document.querySelectorAll(".seal")[index];
      } else {
        _dom = document.querySelectorAll(".seal2")[index];
      }

      let disX = event.clientX - _dom.offsetLeft;
      let disY = event.clientY - _dom.offsetTop;
      this.move_signature.isStartMove = true;

      //设置层级
      let _signature_arr =
        val == 2
          ? [...this.get_state.use_zhang]
          : [...this.get_state.other_zhang];

      let _that_zindex = _dom.style.zIndex;
      var zindex_arr = _signature_arr.map((x) => x.position.zindex);
      let _max_zindex = Math.max(...zindex_arr);

      _signature_arr.forEach((el) => {
        if (_max_zindex == el.position.zindex) {
          el.position.zindex = _signature_arr[index].position.zindex;
        }
      });
      _signature_arr[index].position.zindex = _max_zindex;

      window.onmousemove = (e) => {
        if (!this.move_signature.isStartMove) {
          return;
        }

        let left = e.clientX - disX;
        let top = e.clientY - disY;

        if (left > 548 - _dom.offsetWidth + 24) {
          left = 548 - _dom.offsetWidth + 24;
        }
        if (left < 24) {
          left = 24;
        }

        if (top < 10) {
          top = 10;
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
          if (val == 1) {
            this.$store.commit("SET_LEFTDATA_other_zhang", _signature_arr);
          } else {
            this.$store.commit("SET_LEFTDATA_use_signature", _signature_arr);
          }
        };
      };
    },
    // 点击清楚正文里面的内容
    onEmpty() {
      this.editor.txt.html("");
    },
    beforeUpload(files) {
      return public_data_files(files, this.files, 50);
    },
    customRequest(files) {
      randomnumber(files, this.callback);
    },
    callback(data) {
      let path = `${data.url}/${data.data.key}`;
      get_word({ path: path }).then((data) => {
        this.editor.txt.append(
          `<pre style="font-family:FangSong;">${contenFilters(data.data)}</pre>`
        );
      });
    },
    // 提交修改正文内容
    set_content_data() {
      this.$store.commit("SET_LEFTDATA_content", this.editor.txt.html());
    },
    //删除签章
    delete_signature(index, val) {
      if (val == 1) {
        let _arr = [...this.get_state.other_zhang];
        _arr.splice(index, 1);
        this.$store.commit("SET_LEFTDATA_other_zhang", _arr);
      } else {
        this.get_state.use_zhang.splice(index, 1);
      }
    },
  },
};
</script>
<style lang="less" scoped>
@import url("../../../../getmanage/pendingtrial/compoentscss/index");
.top-center-btn {
  position: absolute;
  top: 4px;
  right: 15px;
  z-index: 10;
  height: 24px;
  padding: 0 10px;
  font-size: 12px;
}
.tstext {
  position: absolute;
  z-index: 11;
  top: 0px;
  right: 200px;
  color: #c0c6cc;
}
#editor {
  position: relative;
  z-index: 1;
}
.upload {
  margin-bottom: 0px;
}
/deep/#editor {
  height: 614px;
  position: relative;
  z-index: 1;
  padding: 0;
}
/deep/ .w-e-toolbar {
  position: relative;
  top: 0px;
  width: 100%;
  z-index: 99999;
  border-left: none !important;
  border-right: none !important;
}
/deep/ .w-e-text-container {
  width: 596px !important;
  margin: 0 auto;
  min-height: 570px;
  border: none !important;
  height: auto !important;
  font-size: 19px;
  background: white;
}

.box {
  position: relative;
  display: flex;
  justify-content: center;
  overflow: auto;
  width: 100%;
  height: 605px;
  margin: 0 auto;
  border: 1px solid #ccc;
  background: #e6e6e6;
}
.box2 {
  position: relative;
  width: 100%;
  height: 600px;
}
.flex-end {
  position: absolute;
  width: 596px;
  left: 50%;
  transform: translate(-50%);
  height: 0;
  top: 33px;
  z-index: 10;
}
.seal {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 142px;
  height: auto;
  z-index: 2;
  &:hover {
    .hold-all {
      display: flex;
    }
  }
  .del {
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    background: url("../../../../../assets/adddraft/x.png");
    background-size: 20px 20px;
    z-index: 11;
  }
  .zoom {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    background: url("../../../../../assets/adddraft/scroll.png");
    background-size: 20px 20px;
    z-index: 11;
  }
  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    z-index: 10;
  }

  .hold-all {
    display: none;
    align-items: center;
    position: absolute;
    top: 0px;
    right: 0;
    background-color: #d5d5d5;
    opacity: 0.85;
    text-align: center;
    border: 1px #adadad solid;
    padding: 3px 0;
    z-index: 11;

    .item {
      width: 20px;
      height: 20px;
      margin: 0 5px;
    }
    .del {
      background: url("../../../../../assets/adddraft/qianzhang-delete.png");
      background-size: 20px 20px;
      cursor: pointer;
    }
    .move {
      background: url("../../../../../assets/adddraft/tuodong.png");
      background-size: 20px 20px;
      cursor: move;
    }
  }
  .ismove {
    display: flex !important;
  }

  .zhang {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 9;
    user-select: none;
  }

  .to-big {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
}

/deep/ .w-e-text-container {
  min-height: 570px;
  border: none !important;
  /deep/pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
/deep/.w-e-text {
  position: relative;
  height: auto !important;
  min-height: 560px;
  overflow-y: inherit;
  width: 548px !important;
  margin: 0 auto;
  padding: 0;
  p {
    margin: 0;
  }
  * {
    max-width: 548px;
  }
}
</style>