const incoming = [
    {
        path: "/home/incoming",
        name: "incoming",
        component: () =>
            import(
                "@/views/home/components/incoming/incoming.vue"
            ),
        meta: {
            title: "",
            name: "发文模板",
            is_ci: false,
            listswitch: true
        },
    },
];
export default incoming;