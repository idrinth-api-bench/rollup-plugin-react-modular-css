import {
    readFileSync,
    writeFileSync,
} from 'fs';
import {
    dirname,
} from 'path';
import CleanCSS from 'clean-css';
import {
    createHash,
} from 'crypto';

const minifier = new CleanCSS();

export default function () {
    return {
        name: '@idrinth/rollup-plugin-react-modular-css',
        transform ( code: string, id: string ) {
            if (id.endsWith('src/main.tsx',)) {
                return null;
            }
            let matches = code.match(/import ["']\.\/[^"]+?\.css['"];/ug);
            if (matches) {
                for (const match of matches) {
                    const path = `${dirname(id)}/${match.replace(/import ['"]\.\/(.*)['"];/u, '$1',)}`;
                    const minified = minifier.minify(readFileSync(path, 'utf8')).styles;
                    const hash = createHash('sha256')
                        .update(minified,)
                        .digest('hex',);
                    const name = id
                        .replace(/\/[^/]+.[tj]sx?$/u, '',)
                        .split('/',)
                        .pop();
                    writeFileSync(`${process.cwd()}/public/assets/${name}-${hash}.min.css`, minified, 'utf8',);
                    code.replace(
                        matches[0],
                        `import load from '@idrinth/rollup-plugin-react-modular-css';\n(() => load('${hash}', '${name}'))()`,
                    );
                }
                return code;
            }
            return null;
        }
    };
}