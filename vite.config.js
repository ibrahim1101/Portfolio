import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function automaticProjectGalleries() {
  const root = path.resolve('public/media/projects');
  const output = path.join(root, '_auto-gallery.json');
  const supported = /\.(png|jpe?g|webp|gif|avif)$/i;
  const generate = () => {
    fs.mkdirSync(root, { recursive: true });
    const galleries = {};
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const dir = path.join(root, entry.name);
      galleries[entry.name] = fs.readdirSync(dir, { withFileTypes: true })
        .filter(file => file.isFile() && supported.test(file.name))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
        .map(file => ({
          file: file.name,
          caption: path.parse(file.name).name.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        }));
    }
    fs.writeFileSync(output, JSON.stringify(galleries, null, 2) + '\n');
  };
  return {
    name: 'automatic-project-galleries',
    buildStart() { generate(); },
    configureServer(server) {
      generate();
      server.watcher.add(root);
      server.watcher.on('all', (event, file) => {
        if (file === output || !file.startsWith(root)) return;
        if (supported.test(file) || event === 'addDir' || event === 'unlinkDir') generate();
      });
    }
  };
}
export default defineConfig({ plugins: [react(), automaticProjectGalleries()], base: './' });
