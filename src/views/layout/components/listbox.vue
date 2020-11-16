<template>
  <div class="listbox" v-show="!listswitch">
    <a-menu
      mode="inline"
      :open-keys="openKeys"
      style="width: 195px;"
      :style="onOff?`height:734px;`:''"
      :multiple="false"
      @openChange="onOpenChange"
      :selected-keys="selectedKeys"
    >
      <template v-for="(itme) in data">
        <a-sub-menu v-if="itme.name!=''" :key="itme.name">
          <span slot="title">
            <span>{{itme.name}}</span>
          </span>
          <a-menu-item v-for="(info) in itme.childrens" :key="info.path">
            <router-link :to="info.path" class="flex-col">
              <span class="listbox-dian">·</span>
              {{info.name}}
            </router-link>
          </a-menu-item>
        </a-sub-menu>
        <template v-else v-for="(info) in itme.childrens">
          <a-menu-item v-if="info.code=='system_role_left'&&powers[8]!=''" :key="info.code+1">
            <router-link to="/organizational">组织架构设置</router-link>
          </a-menu-item>
          <a-menu-item :key="info.path">
            <div class="listbox-name-dian" v-if="remindOnOff&&info.path=='/accept'"></div>
            <router-link :to="info.path">{{info.name}}</router-link>
          </a-menu-item>
          <a-menu-item v-if="info.code=='system_role_left'&&powers[6]!=''" :key="info.code+2">
            <router-link to="/applicationSet">公文设置</router-link>
          </a-menu-item>
        </template>
      </template>
    </a-menu>
  </div>
</template>
<script>
export default {
  name: "ListBox",
  data() {
    return {
      rootSubmenuKeys: [],
      data: [],
      listswitch: false,
      // 左边导航栏高度
      left_height: 0,
      // 跳转到特点页面需要判断权限
      arry: [
        "/sendout",
        "/getmanage",
        "/sign",
        "/webservice",
        "/applicationSet",
        "/systemset"
      ],
      onOff: false
    };
  },
  methods: {
    dataHandel(arr, index) {
      let result = {},
        obj = {};
      let power = this.$store.state.jurisdiction[index];
      arr.forEach(item => {
        if (item?.meta?.is_ci && this.working(power, item)) {
          if (!result[item.meta.title]) {
            result[item.meta.title] = {
              name: item.meta.title,
              childrens: [
                {
                  name: item.meta.name,
                  path: item.path,
                  code: item.meta.code,
                  num: item.meta.num
                }
              ]
            };
          } else {
            result[item.meta.title].childrens.push({
              name: item.meta.name,
              path: item.path,
              code: item.meta.code
            });
          }
        }
      });
      return result;
    },
    // 返回第一个对象第一个属性
    objone() {
      for (const key in this.data) {
        return this.data[key];
      }
    },
    // 加工函数，处理是否渲染
    working(power, item) {
      let yseno;
      let code = item.meta.code;
      if (code != "yes") {
        yseno = power.includes(code);
      } else {
        yseno = true;
      }
      return yseno;
    },
    // 展开及关闭菜单分类回调函数
    onOpenChange(openKeys) {
      this.$store.commit("ADDOPENKEYS", { arrays: openKeys });
    }
  },
  created() {
    window.document.title = this.$route.meta.name;
    if (this.$route.matched[0].meta.onOff) {
      this.onOff = true;
    } else {
      this.onOff = false;
    }
    // 监听路由的跳转
    this.$router.beforeEach((to, from, next) => {
      let routes = {
        children: this.$router.options.routes
      };
      let route = this.$route.matched;
      routes = routes.children.find((e, index) => {
        if (e.name == to.matched[0].name) {
          e.index = index;
          return e;
        }
      });
      if (routes.children != undefined) {
        this.data = this.dataHandel(routes.children, routes.index);
      }
      // to.path 目标路由
      if (
        to.path !== "/login" &&
        sessionStorage.getItem("token") == undefined &&
        to.path !== "/logintransfer"
      ) {
        next("/login");
      } else {
        if (this.arry.includes(to.path) && to.path !== "/login") {
          next(`${this.objone().childrens[0].path}`);
        } else {
          next();
        }
      }
    });
    // 进来就获取路由信息
    let routes = {
      children: this.$router.options.routes
    };
    let routerinfo = this.$route;
    this.$store.commit("ADDOPENCHANG", {
      title: routerinfo.meta.title,
      key: routerinfo.path
    });
    this.$store.commit("CLICKHEADER", { num: routerinfo.meta.num });
    this.listswitch = this.$route.meta.listswitch;
    let route = this.$route.matched;
    for (let i = 0; i < route.length - 1; i++) {
      routes = routes.children.find((e, index) => {
        if (e.name == route[i].name) {
          e.index = index;
          return e;
        }
      });
    }
    this.data = this.dataHandel(routes.children, routes.index);
  },
  watch: {
    $route(to, from) {
      if (to.matched[0].meta.onOff) {
        this.onOff = true;
      } else {
        this.onOff = false;
      }
      window.document.title = to.meta.name;
      this.$store.commit("ADDOPENCHANG", {
        title: to.meta.title,
        key: to.path
      });
      this.$store.commit("CLICKHEADER", { num: to.meta.num });
      this.listswitch = this.$route.meta.listswitch;
    }
  },
  computed: {
    // 获取当前选中菜单列表
    selectedKeys() {
      return this.$store.state.selectedKeys;
    },
    // 获取当前展开菜单列表
    openKeys() {
      return this.$store.state.openKeys;
    },
    // 公文交换未读提醒状态
    remindOnOff() {
      return this.$store.state.remindOnOff;
    },
    // 权限数据
    powers() {
      return this.$store.state.jurisdiction;
    }
  }
};
</script>

<style lang="less">
.listbox {
  display: inline-block;
  width: 200px;
  background: #ffffff;
  margin-right: 10px;
  overflow-y: auto;
  .listbox-name-dian {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: red;
    position: absolute;
    top: 8px;
    left: 83px;
  }
  .listbox-dian {
    font-size: 35px;
    line-height: 20px;
    position: relative;
    top: 6px;
  }
  .ant-menu-inline,
  .ant-menu-vertical,
  .ant-menu-vertical-left {
    border: none;
  }
}
</style>