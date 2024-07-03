import { defineConfig } from '@umijs/max';

export default defineConfig({
    antd: {},
    access: {},
    model: {},
    initialState: {},
    request: {},
    locale: {
        default: 'en-US',
    },
    layout: {
        title: 'ZT UI',
    },
    routes: [
        {
            path: '/',
            redirect: '/home',
        },
        {
            name: 'Controller',
            path: '/home',
            component: './zt-controller',
        },
        {
            name: 'Network',
            path: '/network/:id',
            component: './zt-controller/network',
            hideInMenu: true,
        },
    ],
    npmClient: 'pnpm',
    proxy: {
        '/api': {
            target: 'http://localhost:19993/',
            headers: {
                // 'X-ZT1-Auth': '123456',
            },
            changeOrigin: true,
        },
    },
});
