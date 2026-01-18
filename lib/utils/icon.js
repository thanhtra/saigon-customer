export function CopyIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24">
            <path
                fill="currentColor"
                d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1Zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2Zm0 16H8V7h11v14Z"
            />
        </svg>
    );
}

export function ShareIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24">
            <path
                fill="currentColor"
                d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.02-4.11A2.99 2.99 0 1 0 14 5c0 .24.04.47.09.7L7.07 9.81A3 3 0 1 0 7 14.2l7.02 4.11c-.05.21-.07.43-.07.66a3 3 0 1 0 3-2.89Z"
            />
        </svg>
    );
}

export function PhoneIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24">
            <path
                fill="currentColor"
                d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24 11.36 11.36 0 0 0 3.56.57 1 1 0 0 1 1 1V21a1 1 0 0 1-1 1A17 17 0 0 1 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.56 1 1 0 0 1-.24 1.01l-2.2 2.22Z"
            />
        </svg>
    );
}

export function ZaloIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#1677ff" />
            <text
                x="12"
                y="16"
                textAnchor="middle"
                fontSize="10"
                fill="#fff"
                fontWeight="bold"
            >
                Zalo
            </text>
        </svg>
    );
}

export function ZaloIconBtn({ size = 24 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            aria-hidden
        >
            <circle cx="12" cy="12" r="12" fill="#1677ff" />

            <text
                x="12"
                y="16.5"
                textAnchor="middle"
                fontSize="12"
                fill="#fff"
                fontWeight="800"
                fontFamily="Arial, Helvetica, sans-serif"
            >
                Z
            </text>
        </svg>
    );
}


export function CalendarIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24">
            <path
                fill="currentColor"
                d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm14 9H3v8a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-8ZM4 7h16V7a1 1 0 0 0-1-1h-1v1a1 1 0 1 1-2 0V6H8v1a1 1 0 1 1-2 0V6H5a1 1 0 0 0-1 1Z"
            />
        </svg>
    );
}

export function RoomRentalIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24">
            <path
                fill="currentColor"
                d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5Z"
            />
        </svg>
    );
}

export function ApartmentIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24">
            <path
                fill="currentColor"
                d="M4 2h10a2 2 0 0 1 2 2v16h-2v-2H6v2H4V2Zm2 4v2h2V6H6Zm4 0v2h2V6h-2Zm0 4v2h2v-2h-2Zm-4 0v2h2v-2H6Z"
            />
        </svg>
    );
}

export function HouseIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24">
            <path
                fill="currentColor"
                d="M12 3 2 11h3v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9h3L12 3Z"
            />
        </svg>
    );
}

export function ShopIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24">
            <path
                fill="currentColor"
                d="M3 4h18l-1.5 6H4.5L3 4Zm2 8h14v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8Z"
            />
        </svg>
    );
}
