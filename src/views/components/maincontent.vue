<template>
  <div class="maincontent"
       id="maincontent">
    <slot></slot>
  </div>
</template>

<script>
import { get_watermark } from '@/api/maincontent.js'
export default {
  name: 'Maincontent',
  data() {
    return {}
  },
  mounted() {
    this.watermark()
  },
  created() {},
  methods: {
    // 调用shui
    async watermark() {
      let a = await get_watermark()
      if (a.code == 1) {
        this.$watermark.set(a.data)
      }
    },
  },
  created() {},
  watch: {},
  computed: {},
}
</script>

<style lang="less" scoped>
.maincontent {
  padding: 0 20px;
  background: white;
  min-height: calc(100% - 75px);
  position: relative;
  overflow: hidden;
}
</style>