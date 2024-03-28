const global = window || this || {};
const header = global.document.getElementsByTagName('header')[0];
export default (hash: string, name: string) => {
    const path = `/assets/${name}-${hash}.min.css`;
    if (global.document.querySelector(`link[href='${ path }']`)) {
        return;
    }
    const style= global.document.createElement('link');
    style.setAttribute('rel','stylesheet');
    style.setAttribute('href', path);
    header.appendChild(style);
}