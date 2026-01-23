
import { useSelector } from 'react-redux';
import { useAuthInit } from 'hooks/useAuthInit';

export default function AuthInitializer({ children }) {
    useAuthInit();

    const { isAuthInitialized } = useSelector((s) => s.users);

    if (!isAuthInitialized) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fff',
                }}
            >
                <div className="auth-loader" />
                <p
                    style={{
                        marginTop: 16,
                        color: '#666',
                        fontSize: 14,
                        letterSpacing: '0.3px',
                    }}
                >
                    Đang tải…
                </p>

                <style jsx>{`
                    .auth-loader {
                        width: 36px;
                        height: 36px;
                        border: 3px solid #e5e7eb;
                        border-top-color: #111827;
                        border-radius: 50%;
                        animation: spin 0.8s linear infinite;
                    }

                    @keyframes spin {
                        to {
                            transform: rotate(360deg);
                        }
                    }
                `}</style>
            </div>
        );
    }

    return children;
}
