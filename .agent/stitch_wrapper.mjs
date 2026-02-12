
import { createRequire } from 'module';

const originalWrite = process.stdout.write;
process.stdout.write = function (chunk, encoding, callback) {
    if (chunk) {
        const s = chunk.toString();
        // Specifically silence dotenv/ink logs that start with [dotenv or tip:
        if (s.includes('[dotenv') || s.includes('tip:')) {
            return true;
        }
    }
    return originalWrite.apply(process.stdout, arguments);
};

// Import the CLI module
import('file:///c:/marcom/node_modules/@_davideast/stitch-mcp/dist/cli.js');
