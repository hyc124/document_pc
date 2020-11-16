<template>
  <div class="logintransfer"></div>
</template>
<script>
import { LoginTransfer } from "@/api/public.js";
import { tokeninfo } from "@/api/login.js";
import { get_roloe_menu } from "@/api/router.js";
export default {
  name: "logintransfer",
  data() {
    return {};
  },
  created() {
    let _this = this;
    if (this.$route.query.token) {
      sessionStorage.setItem("token", this.$route.query.token);
      tokeninfo().then(data => {
        this.$store.commit("USERINFO", data.data);
        this.addroloe_menu();
        if (_this.$route.query.grade) {
          this.$router.push({
            path: "/home/incoming",
            query: {
              file_type: _this.$route.query.file_type,
              id: _this.$route.query.id
            }
          });
        } else {
          this.$router.push({ name: "home" });
        }
      });
    } else {
      LoginTransfer(this.$route.query).then(data => {
        this.$store.commit("USERINFO", data.data.userinfo);
        sessionStorage.setItem("token", data.data.token);
        this.addroloe_menu();
        this.$router.push({ name: "home" });
      });
    }
  },
  methods: {
    addroloe_menu() {
      get_roloe_menu().then(data => {
        this.$store.commit("SET_LEFTDATA_jurisdiction", data.data);
      });
    }
  }
};
</script>
