/**
 * Kiểm tra datetime-local >= hiện tại + minutes
 * @param {string} value - datetime-local value
 * @param {number} minutes
 * @returns {true|string}
 */
export const validateMinMinutesFromNow = (value, minutes = 30) => {
    if (!value) return 'Vui lòng chọn thời gian';

    const selectedTime = new Date(value);
    const now = new Date();

    const minTime = new Date(now.getTime() + minutes * 60 * 1000);

    if (selectedTime < minTime) {
        return `Cần sau hiện tại ít nhất ${minutes} phút`;
    }

    return true;
};


export const getDatetimeLocalPlusMinutes = (minutes = 60) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutes);

    const pad = (n) => String(n).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
        + `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};


export const toDatetimeLocal = (value) => {
    if (!value) return '';

    const d = new Date(value);

    const pad = (n) => String(n).padStart(2, '0');

    return (
        d.getFullYear() +
        '-' +
        pad(d.getMonth() + 1) +
        '-' +
        pad(d.getDate()) +
        'T' +
        pad(d.getHours()) +
        ':' +
        pad(d.getMinutes())
    );
};
