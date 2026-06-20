import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function localApi() {
    return {
        name: 'local-vercel-api',
        configureServer(server) {
            server.middlewares.use('/api', async (request, response) => {
                try {
                    const url = new URL(request.url, 'http://localhost');
                    request.query = Object.fromEntries(url.searchParams.entries());
                    request.query.path = url.pathname.replace(/^\//, '');

                    if (!['GET', 'HEAD'].includes(request.method)) {
                        const chunks = [];
                        for await (const chunk of request) {
                            chunks.push(chunk);
                        }
                        const rawBody = Buffer.concat(chunks).toString('utf8');
                        request.body = rawBody ? JSON.parse(rawBody) : {};
                    }

                    response.status = (statusCode) => {
                        response.statusCode = statusCode;
                        return response;
                    };
                    response.json = (payload) => {
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify(payload));
                    };

                    const { default: handler } = await import('./api/index.js');
                    await handler(request, response);
                } catch (error) {
                    if (!response.headersSent) {
                        response.statusCode = 500;
                        response.setHeader('Content-Type', 'application/json');
                    }
                    if (!response.writableEnded) {
                        response.end(JSON.stringify({ error: error.message || 'Local API request failed.' }));
                    }
                }
            });
        },
    };
}

export default defineConfig(({ mode }) => {
    const serverEnv = loadEnv(mode, process.cwd(), '');
    for (const [key, value] of Object.entries(serverEnv)) {
        if (process.env[key] === undefined) {
            process.env[key] = value;
        }
    }

    return {
        plugins: [localApi(), react(), tailwindcss()],
    };
});
