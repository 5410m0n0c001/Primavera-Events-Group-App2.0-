import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],

    // Docker compatibility
    server: {
        host: true, // CRÍTICO para Docker
        port: 5173,
        strictPort: true,
        watch: {
            usePolling: true, // CRÍTICO para Docker en Windows/Mac
            interval: 1000
        }
    },

    preview: {
        host: true,
        port: 4173,
        strictPort: true
    },

    // Build optimizations
    build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'terser',
        target: 'es2015',
        cssCodeSplit: true,
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom'],
                    'router': ['react-router-dom']
                }
            }
        },
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        }
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },

    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom']
    }
})
