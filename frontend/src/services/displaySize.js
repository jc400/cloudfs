export default function displaySize(bytes){
    let out;
    let b = parseInt(bytes);

    if (b < 1000) {
        out = `${b} bytes`;
    } else if (b < 1000000) {
        out = `${Math.floor(b / 1000)} kB`;
    } else if (b < 1000000000) {
        out = `${Math.floor(b / 1000000)} mB`;
    } else { 
        console.log('in default');
        out = `${b} bytes`;
    }

    return out;
}