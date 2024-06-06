import * as esbuild from 'esbuild';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve(process.cwd(), 'dist', 'server');

const copyDistFilesPlugin = {
  name: 'copy-dist-files',
  setup(build) {
    const options = build.initialOptions;
    const outDir = options.outfile
      ? path.dirname(options.outfile)
      : options.outdir;

    build.onEnd(async (result) => {
      if (result.errors.length > 0) {
        return;
      }

      await fs.cp(
        path.join(process.cwd(), 'package.server.json'),
        path.join(outDir, 'package.json'),
      );
    });
  },
};

async function main() {
  /** @type esbuild.BuildOptions */
  const config = {
    entryPoints: ['./src/server/main.ts'],
    outfile: path.join(OUT_DIR, 'main.js'),
    bundle: true,
    platform: 'node',
    target: 'node18',
    logLevel: 'silent',
    define: {
      'import.meta.url': 'import_meta_url',
      'import.meta.dirname': 'import_meta_dirname',
    },
    inject: ['./src/server/polyfill.js'],
    plugins: [copyDistFilesPlugin],
  };

  if (process.env.COMMAND === 'build') {
    const result = await esbuild.build({
      ...config,
    });
    if (result.warnings.length > 0) {
      const messages = await esbuild.formatMessages(
        result.warnings.filter((warning) => warning.id !== 'direct-eval'),
        {
          kind: 'warning',
        },
      );
      for (const message of messages) {
        process.stdout.write(message);
      }
    }

    return;
  }

  const context = await esbuild.context({
    ...config,
    minify: false,
    sourcemap: false,
  });
  await context.watch();
}

main();
