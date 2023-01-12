export default function getPositionStyle(x, y) {
    // returns X/Y coords plus style rules to ensure div stays on screen. For context menu, etc
    let style = {}
    if (x > window.screen.availWidth / 2) {
        style['right'] = 0;
    } else {
        style['left'] = 0;
    }

    if (y > window.screen.availHeight / 2) {
        style['bottom'] = 'var(--button-height)';
    } else {
        style['top'] = 'var(--button-height)';
    }
    return style;
}