export const validateMinMinutesFromNow = (value, minutes = 30) => {
    if (!value) return 'Vui lòng chọn thời gian';

    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);

    const pad = (n) => String(n).padStart(2, '0');
    const minValue =
        `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
        `T${pad(now.getHours())}:${pad(now.getMinutes())}`;

    return value >= minValue
        ? true
        : `Cần sau hiện tại ít nhất ${minutes} phút`;
};


export const getDatetimeLocalPlusMinutes = (minutes = 60) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutes);

    const pad = (n) => String(n).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
        + `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const formatDateTime = (value, locale = 'vi-VN') => {
    if (!value) return '-';

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

export const formatDateTimeString = (value) => {
    if (!value || typeof value !== 'string') return '-';

    // value: YYYY-MM-DDTHH:mm
    const [date, time] = value.split('T');
    if (!date || !time) return '-';

    const [year, month, day] = date.split('-');

    return `${day}-${month}-${year} ${time}`;
};
