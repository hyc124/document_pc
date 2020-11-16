<template>
  <div class="maintitle">
    <span class="hand flex-col"
          @click="onClick">
      <img class="retuLeft"
           v-if="titleObj.retu"
           src="../../assets/left.png"
           alt />
      <span class="fwb"> {{title}}</span>
    </span>
    <slot></slot>
  </div>
</template>

<script>
import SvgIcon from '@/views/components/svgicon.vue'
export default {
  name: 'Maintitle',
  data() {
    return {
      title: '',
    }
  },
  props: ['titleObj'],
  methods: {
    onClick() {
      this.$emit('go_back')
    },
  },
  created() {
    this.title = this.$route.meta.name
  },
  watch: {
    $route(to, from) {
      this.title = to.meta.name
    },
  },
  components: {
    SvgIcon,
  },
}
</script>

<style lang="less" scoped>
.maintitle {
  padding: 0 20px;
  height: 60px;
  background: white;
  margin-bottom: 15px;
  font-size: 18px;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  box-shadow:0px 0px 10px rgba(00, 00, 00, .04);
}
.retuLeft {
  width: 16px;
  height: 12px;
  margin-right: 5px;
}
.fwb {
  font-weight: 900;
}
</style>