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
            const csss = [];
            const css = code.matchAll(/import ["']\.\/[^"]+?\.css['"];/ug);
            if (css) {
                for (const match of css) {
                    const path = `${dirname(id)}/${match[0].replace(/import ['"]\.\/(.*)['"];/u, '$1',)}`;
                    const data = readFileSync(path, 'utf8');
                    csss.push(data);
                }
            }
            const scss = code.matchAll(/import ["']\.\/[^"]+?\.scss['"];/ug);
            if (scss) {
                for (const match of scss) {
                    const path = `${dirname(id)}/${match[0].replace(/import ['"]\.\/(.*)['"];/u, '$1',)}`;
                    const data = compileString(readFileSync(path, 'utf8'),).css;
                    csss.push(data);
                }
            }
            if (csss.length > 0) {
                return writeCss(
                    id,
                    csss.join('\n'),
                    code
                        .replace(/import ["']\.\/[^"]+?\.s?css['"];/ug, ''),
                );
            }
            return null;
        }
    };
}