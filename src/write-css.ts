import {
    writeFileSync,
} from "fs";
import {
    createHash,
} from "crypto";
import CleanCSS from "clean-css";

const minifier = new CleanCSS();

export default (id: string, css: string, code: string, match: string[]): string => {
    const minified = minifier.minify(css).styles;
    const hash = createHash('sha256')
        .update(css,)
        .digest('hex',);
    const name = id
        .replace(/\/[^/]+.[tj]sx?$/u, '',)
        .split('/',)
        .pop();
    writeFileSync(`${process.cwd()}/public/assets/${name}-${hash}.min.css`, minified, 'utf8',);
    return code.replace(
        match[0],
        `import load from '@idrinth/rollup-plugin-react-modular-css';\n(() => load('${hash}', '${name}'))()`,
    );
}