const addDraft = [
  {
    path: "/draft/addDraft",
    name: "addDraft",
    component: () =>
      import(
        "@/views/sendout/draft/adddraft.vue"
      ),
    meta: {
      title: "",
      name: "发文拟稿",
      is_ci: false,
      listswitch: true
    },
  },
  {
    path: "/draft/quickPost",
    name: "quickPost",
    component: () =>
      import(
        "@/views/sendout/quick_post/quick_post.vue"
      ),
    meta: {
      title: "",
      name: "快速发文",
      is_ci: false,
      listswitch: true
    },
  },

];
export default addDraft;