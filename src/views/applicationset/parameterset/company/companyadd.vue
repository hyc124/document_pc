<template>
  <div>
    <company-detail :path_type="2" />
  </div>
</template>
<script>
import companyDetail from "@/views/applicationset/parameterset/company/components/companyDetail";
import company from "./company";
export default {
  name: "companyadd",
  data() {
    return {};
  },
  components: { companyDetail },
};
</script>
<style lang="less" scoped>
</style>