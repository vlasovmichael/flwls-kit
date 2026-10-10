// Пока открыто модальное окно, страница под ним не прокручивается.
// Правило ставится в документ самим компонентом: проекты без base.css тоже его получают.
const LOCK = 'html:has(> body.is-modal-open) { overflow: hidden; }';
let installed = false;
export function installModalLock() {
    if (installed || typeof document === 'undefined')
        return;
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(LOCK);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    installed = true;
}
