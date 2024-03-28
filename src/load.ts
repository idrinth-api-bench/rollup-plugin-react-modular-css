
const header = document.getElementsByTagName('header')[0];
export default (hash: string, name: string) => {
    const path = `/assets/${name}-${hash}.min.css`;
    if (document.querySelector(`link[href='${ path }']`)) {
        return;
    }
    const style= document.createElement('link');
    style.setAttribute('rel','stylesheet');
    style.setAttribute('href', path);
    header.appendChild(style);
}