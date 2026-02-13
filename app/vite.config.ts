import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api/n8n': {
                target: 'https://primary-production-89e96.up.railway.app',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/n8n/, '')
            }
        }
    }
})
