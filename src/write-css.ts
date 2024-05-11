import {
    writeFileSync,
} from 'fs';
import {
    createHash,
} from 'crypto';
import CleanCSS from 'clean-css';

const minifier = new CleanCSS();

export default (id: string, css: string, code: string): string => {
    const minified = minifier.minify(css).styles;
    const hash = createHash('sha256')
        .update(css,)
        .digest('hex',);
    const name = id
        .replace(/\.[tj]sx?$/u, '',)
        .replace(/\/index$/u, '',)
        .split('/',)
        .pop();
    writeFileSync(`${process.cwd()}/public/assets/${name}-${hash}.min.css`, minified, 'utf8',);
    return `import load from '@idrinth/rollup-plugin-react-modular-css/src/load.js';\n(() => load('${hash}', '${name}'))()\n${code}`;
}
