const roleEditing = [
    {
        path: "/roleset/roleEditing",
        name: "roleEditing",
        component: () =>
            import("@/views/systemset/roleset/roleEditing/roleEditing.vue"),
        meta: {
            title: "角色编辑",
            name: "角色编辑",
            is_ci: false,
            listswitch: true,
        },
    },
];
export default roleEditing;