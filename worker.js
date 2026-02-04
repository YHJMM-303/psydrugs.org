export default {
    async fetch(request, env, ctx) {
        // 1. 获取请求的 URL
        const url = new URL(request.url);

        // 2. 尝试从 ASSETS (public目录) 获取对应文件
        let response = await env.ASSETS.fetch(request);

        // 3. 如果找到了 (200) 或者没修改 (304)，直接返回
        if (response.status >= 200 && response.status < 400) {
            return response;
        }

        // 4. (可选) 如果是 404，尝试返回 index.html (防止 SPA 刷新白屏)
        // 如果你只是纯静态博客，可以删掉下面这几行
        const index = await env.ASSETS.fetch(new URL("/index.html", url));
        if (index.status >= 200 && index.status < 400) {
            return index;
        }

        // 5. 真的找不到了
        return new Response("Not Found", { status: 404 });
    }
};