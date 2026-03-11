// CustomLogo component

interface CustomLogoProps {
    size?: number | string;
    className?: string;
}

export function CustomLogo({ size = 24, className = "" }: CustomLogoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Background/Base Shape */}
            <rect x="10" y="15" width="80" height="70" rx="20" fill="white" />
            {/* Antenna */}
            <path d="M50 15V5" stroke="white" strokeWidth="6" strokeLinecap="round" />
            <circle cx="50" cy="5" r="5" fill="white" />
            {/* Eyes */}
            <circle cx="35" cy="45" r="8" fill="#075E54" />
            <circle cx="65" cy="45" r="8" fill="#075E54" />
            {/* Smile/Mouth */}
            <path
                d="M35 65 Q 50 75 65 65"
                stroke="#075E54"
                strokeWidth="6"
                strokeLinecap="round"
                fill="transparent"
            />
        </svg>
    );
}
