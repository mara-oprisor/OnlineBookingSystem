/// <reference types="vite/client" />

interface ImportMeta {
    globEager(pattern: string): Record<string, { default: string }>;
}
