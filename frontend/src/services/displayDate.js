export default function displayDate(date){
    const dateObj = new Date(date);
    if (new Date() - dateObj < 1000*60*60*24) {
        return dateObj.toLocaleTimeString();
    } else {
        return dateObj.toLocaleDateString();
    }
}