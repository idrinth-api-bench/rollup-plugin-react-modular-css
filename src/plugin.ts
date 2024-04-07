import {
    readFileSync,
} from 'fs';
import {
    dirname,
} from 'path';
import {
    compileString,
} from 'sass';
import writeCss from './write-css.js';

export default function () {
    return {
        name: '@idrinth/rollup-plugin-react-modular-css',
        transform ( code: string, id: string ) {
            if (id.endsWith('src/main.tsx',)) {
                return null;
            }
            let modified = true;
            const css = code.matchAll(/import ["']\.\/[^"]+?\.css['"];/ug);
            if (css) {
                for (const match of css) {
                    const path = `${dirname(id)}/${match[0].replace(/import ['"]\.\/(.*)['"];/u, '$1',)}`;
                    const data = readFileSync(path, 'utf8');
                    code = writeCss(id, data, code, match,);
                    modified = true;
                }
            }
            const scss = code.matchAll(/import ["']\.\/[^"]+?\.scss['"];/ug);
            if (scss) {
                for (const match of scss) {
                    const path = `${dirname(id)}/${match[0].replace(/import ['"]\.\/(.*)['"];/u, '$1',)}`;
                    const data = compileString(readFileSync(path, 'utf8'),).css;
                    code = writeCss(id, data, code, match,);
                    modified = true;
                }
            }
            return modified ? code : null;
        }
    };
}