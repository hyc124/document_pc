<template>
  <div class="home">
    <Content />
    <MianBott />
  </div>
</template>
<script>
import Content from '@/views/home/components/content.vue'
import MianBott from '@/views/home/components/mian_bott.vue'
import { get_wait_file_count } from '@/api/home.js'
import { get_roloe_menu } from '@/api/router.js'
export default {
  components: {
    Content,
    MianBott,
  },
  name: 'Home',
  data() {
    return {
      data: null,
    }
  },
  mounted() {},
  methods: {
    // 获取用户权限
    addroloe_menu() {
      get_roloe_menu().then((data) => {
        this.$store.commit('SET_LEFTDATA_jurisdiction', data.data)
      })
    },
  },
  created() {
    if (this.$route.query.updateJurisdiction) {
      this.addroloe_menu()
    }
  },
}
</script>
<style lang="less" scoped>
</style>