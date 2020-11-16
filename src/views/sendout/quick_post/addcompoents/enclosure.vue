<template>
  <div class="addInpostrafts-enclosure">
    <div class="title">
      <span class="text">附件内容</span>
      <a-button @click="reste_data">清空</a-button>
    </div>
    <div class="addInpostrafts-enclosure-textbox">
      <div class="add-upload">
        <a-upload name="file"
                  style="margin-right:8px"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :multiple="true"
                  :showUploadList="false"
                  :beforeUpload="beforeUpload"
                  :customRequest="customRequest"
                  :disabled="upload_state">
          <div class="flex-center">
            <i class="upload-icon"></i>
            <span>上传附件</span>
            <span class="upload-text">点击上传</span>
          </div>
        </a-upload>
      </div>

      <div class="addInpostrafts-enclosure-textbox-inbox-tltle file-item"
           v-for="(item,index) in vuex_percent"
           :key="index">
        <div class="left">
          <div :class="get_file_img(item.suffix)"></div>
          <div class="msg">
            <span class="addInpostrafts-enclosure-textbox-inbox-tltle-text">{{item.oldname}}</span>
            <span class="addInpostrafts-enclosure-textbox-inbox-tltle-file-size">{{item.size}}K</span>
          </div>
        </div>

        <div class="right">
          <div v-if="[
        'txt',
        'doc',
        'docx',
        'pdf',
        'png',
        'jpg',
        'jpe',
        'bmp'
      ].includes(item.suffix)"
               class="addInpostrafts-enclosure-textbox-inbox-tltle-rightimg"
               @click="look(item)"></div>
          <div class="addInpostrafts-enclosure-textbox-inbox-tltle-rightimgs"
               @click="dele(index)"></div>
        </div>
      </div>
      <div class="addInpostrafts-enclosure-textbox-inbox-tltle file-item"
           v-show="!that_reFresh">
        <div class="left">
          <div :class="get_file_img(that_percent.suffix)"></div>
          <div class="msg">
            <span class="addInpostrafts-enclosure-textbox-inbox-tltle-text">{{that_percent.name}}</span>
            <span class="addInpostrafts-enclosure-textbox-inbox-tltle-file-size">{{that_percent.size}}K</span>
          </div>
        </div>

        <a-progress :percent="progress"
                    size="small" />
        <span class="quxiao"
              @click="quxiao">取消</span>
      </div>
    </div>

    <a-modal v-model="visible"
             title="预览附件内容"
             ok-text="确认"
             cancel-text="取消"
             @ok="visible=false">
      <pre class="view-file-box"
           v-html="that_view_file_text">
      </pre>
    </a-modal>
  </div>
</template>
<script>
import {
  public_data_files,
  randomnumber,
  preview_url,
  get_file_img,
} from '@/js/public'
import { get_word } from '@/api/public'
export default {
  name: 'Enclosure',
  data() {
    return {
      headers: {
        authorization: 'authorization-text',
      },
      visible: false,
      // 当前预览的文件的路径
      look_path: null,
      //----------------------------------
      //文件上传进度
      progress: 0,
      that_reFresh: true, //当前文件是否上传成功//当前文件是否上传成功，默认true代表成功(不显示正在上传)
      upload_state: false, //按钮状态
      that_percent: {}, //当前文件数据
      that_file_index: null, //当前文件的下标(用于显示隐藏)

      //用于取消判断的文件列表数据
      false_percent: [],
      quxiao_id: null, //当前取消id

      //用于渲染以及提交的文件列表数据
      vuex_percent: [],
      //当前文件的大小
      that_file_size: null,
      that_view_file_text: '',
    }
  },
  components: {},
  created() {
    this.$bus.$off('document_files_quick')
    this.$bus.$on('document_files_quick', this.set_files)
  },
  computed: {
    get_files() {
      return this.$store.state.document_all.files
    },
  },
  methods: {
    //获取文件图片
    get_file_img,
    //获取文件前缀
    get_suffix(item) {
      let suffix = null
      if (item.old_name) {
        suffix = item.old_name.split('.')[item.old_name.split('.').length - 1]
      } else {
        suffix = item.data.key.split('.')[item.data.key.split('.').length - 1]
      }
      return suffix
    },
    transformFile(file) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          const canvas = document.createElement('canvas')
          const img = document.createElement('img')
          img.src = reader.result
          img.onload = () => {
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)
            ctx.fillStyle = 'red'
            ctx.textBaseline = 'middle'
            ctx.fillText('Ant Design', 20, 20)
            canvas.toBlob(resolve)
          }
        }
      })
    },
    handleChange() {},

    //向vuex发送数据
    set_files() {
      this.$store.commit('SET_QUICK_DOCUMENT_FILES', this.vuex_percent)
    },
    // 判断上传文件是否符合要求
    beforeUpload(file) {
      let _type = [
        // 支持上传文件类型
        'txt',
        'docx',
        'pptx',
        'ppt',
        'pdf',
        'xls',
        'xlsx',
        'mp3',
        'mp4',
        'zip',
        'rar',
        'png',
        'jpg',
        'jpeg',
        'bmp',
      ]
      return public_data_files(file, _type)
    },
    // 获取上传文件信息以及从后端获取token
    customRequest(files) {
      this.false_percent.push(files.file)
      this.that_reFresh = false
      this.that_file_size = files.file.size

      //设置正在上传的图片
      this.that_percent.suffix = files.file.type.split('/')[
        files.file.type.split('/').length - 1
      ]
      this.that_percent.name = files.file.name
      // 获取随机数
      let nums = Math.floor(Math.random() * (95 - 75 + 1)) + 75
      let timer = setInterval(() => {
        if (this.progress < nums) {
          this.progress += 1
        } else {
          clearInterval(timer)
        }
      }, 100)
      this.upload_state = true
      let { file } = files
      randomnumber(files, this.saveFile)
    },
    // callback获取七牛云返回的数据
    saveFile(data) {
      this.progress = 100
      this.progress = 0
      setTimeout(() => {
        this.upload_state = false
      }, 200)
      this.that_percent = data
      //设置当前文件的后缀
      let suffix = data.data.key.split('.')[data.data.key.split('.').length - 1]
      this.that_percent.suffix = suffix
      this.that_reFresh = true
      if (this.quxiao_id !== data.uid) {
        this.vuex_percent.push({
          oldname: data.name,
          path: data.url + '/' + data.data.key,
          size: data.size,
          suffix,
        })
      }
    },
    //查看，删除
    async look(item) {
      let suffix = item.path.split('.')[item.path.split('.').length - 1]
      this.look_path = item.path
      if (suffix === 'txt') {
        let data = await get_word({
          path: this.look_path,
          file_type: 1,
        })
        this.that_view_file_text = data.data
        this.visible = true
      } else if (suffix === 'png' || suffix === 'jpg' || suffix == 'pdf') {
        window.open(this.look_path)
      } else {
        window.open(preview_url + '?src=' + this.look_path)
      }
    },
    dele(index) {
      this.$confirm({
        icon: 'info-circle',
        title: '提示',
        content: '是否删除该文件？',
        okText: '确认',
        cancelText: '取消',
        onOk: async function () {
          this.vuex_percent.splice(index, 1)
        }.bind(this),
        onCancel() {},
      })
    },

    //取消正在上传
    quxiao() {
      //当已经向实际使用的数组中添加了数据的时候
      //那么就删除实际数据的内容

      //当确实是因为网络等方面的问题，实际数据还没有该文件
      if (this.false_percent.length !== this.vuex_percent.length) {
        if (this.false_percent.length > 0) {
          this.quxiao_id = this.false_percent[this.false_percent.length - 1].uid
        }
      } else {
        //实际文件已经push了，但是用户还是点到了取消
        let that_url = this.that_percent.url + '/' + this.that_percent.data.key
        this.vuex_percent.forEach((el, inx) => {
          if (el.path == that_url) {
            this.vuex_percent.splice(inx, 1)
          }
        })
      }
      this.that_reFresh = true
      this.that_percent = {}
    },
    //清空内容
    reste_data() {
      this.vuex_percent = []
    },
  },
  watch: {
    get_files() {
      this.vuex_percent = this.get_files
    },
  },
}
</script>
<style lang="less" scoped>
@import url('../../css/enclosure.less');
</style>