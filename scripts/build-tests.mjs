import { build, transform } from 'esbuild';
import { createInstrumenter } from 'istanbul-lib-instrument';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
await build({
    entryPoints: ['tests/index.jsx'],
    outfile: '.test-build/tests.js',
    bundle: true,
    format: 'iife',
    platform: 'browser',
    jsx: 'automatic',
    define: {
        'process.env.NODE_ENV': '"test"',
        'import.meta.env.BASE_URL': '"/"',
    },
    plugins: [
        {
            name: 'coverage',
            setup(build) {
                build.onLoad({ filter: /\.[jt]sx?$/ }, async (args) => {
                    if (!args.path.includes(path.sep + 'src' + path.sep))
                        return;
                    const source = await readFile(args.path, 'utf8');
                    const compiled = await transform(source, {
                        loader: args.path.endsWith('jsx') ? 'jsx' : 'js',
                        jsx: 'automatic',
                        sourcemap: 'inline',
                        sourcefile: args.path,
                    });
                    const instrumenter = createInstrumenter({
                        esModules: true,
                        produceSourceMap: true,
                    });
                    return {
                        contents: instrumenter.instrumentSync(
                            compiled.code,
                            args.path,
                        ),
                        loader: 'js',
                        resolveDir: path.dirname(args.path),
                    };
                });
            },
        },
    ],
});
