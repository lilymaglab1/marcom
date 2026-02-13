import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api/n8n': {
                // target: 'http://localhost:5678', // Disable local n8n
                target: 'https://marcom-production.up.railway.app', // Connect to LIVE Railway Production n8n (LILYMAG V33)
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/n8n/, '')
            }
        }
    }
})
