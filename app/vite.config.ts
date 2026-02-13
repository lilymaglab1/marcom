import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api/n8n': {
                target: 'http://localhost:5678',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/n8n/, '')
            }
        }
    }
})
