export const routes = [
    {
        path: '/home',
        name: 'Home',
        component: r => require(['../views/Home.vue'], r),
        children: [
            {
                path: '/homepage',
                name: 'Homepage',
                component: r => require(['../views/navigation/Homepage.vue'], r)
            },
            {
                path: '/cation',
                name: 'Cation',
                component: r => require(['../views/navigation/Cation.vue'], r)
            },
            {
                path: '/shopping',
                name: 'Shopping',
                component: r => require(['../views/navigation/Shopping.vue'], r)
            },
            {
                path: '/my',
                name: 'My',
                component: r => require(['../views/navigation/My.vue'], r)
            }
        ]
    },
    // 全部订单
    {
        path:'/order/:num',
        name:'Order',
        component: r => require(['../views/order/Order.vue'],r)
    },
    // 收货地址
    {
        path:'/address',
        name:'Address',
        component: r => require(['../views/mypage/Address.vue'],r)
    },
    // 编辑地址
    {
        path:'/newAddress',
        name:'NewAddress',
        component: r => require(['../views/mypage/NewAddress.vue'],r)
    },
    // 安全中心
    {
        path:'/security',
        name:'Security',
        component: r => require(['../views/mypage/Security.vue'],r)
    },
    // 我的收藏
    {
        path:'/collection',
        name:'Collection',
        component: r => require(['../views/mypage/Collection.vue'],r)
    },
    // 搜索
    {
        path:'/search',
        name:'Search',
        component: r => require(['../views/Search.vue'],r)
    },
    // 搜索
    {
        path:'/browsing',
        name:'Browsing',
        component: r => require(['../views/order/Browsing.vue'],r)
    },
    // 商品详情
    {
        path: '/details',
        name: 'Details',
        component: r => require(['../views/Details.vue'],r)
    },
    // 登录
    {
        path: '/login',
        name: 'Login',
        component: r => require(['../views/login/Login.vue'],r)
    },
    // 注册
    {
        path: '/registered',
        name: 'Registered',
        component: r => require(['../views/login/Registered.vue'],r)
    },
    // 忘记密码
    {
        path: '/forgotpassword',
        name: 'Forgotpassword',
        component: r => require(['../views/login/Forgotpassword.vue'],r)
    },
    // 找回密码
    {
        path: '/retrievepassword',
        name: 'Retrievepassword',
        component: r => require(['../views/login/Retrievepassword.vue'],r)
    },
    // 设置
    {
        path: '/setupthe',
        name: 'Setupthe',
        component: r => require(['../views/mypage/Setupthe.vue'],r)
    },
    // 工具于服务
    {
        path: '/changetheskin',
        name: 'Changetheskin',
        component: r => require(['../views/mypage/Changetheskin.vue'],r)
    },
    // 提交订单
    {
        path: '/myorder',
        name: 'Myorder',
        component: r => require(['../views/order/Myorder.vue'],r)
    },
    // 重定向
    {
        path: "*",
        redirect: {
            name: 'Login'
        }
    }
]