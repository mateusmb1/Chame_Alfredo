import React, { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

interface MobileLayoutProps {
    children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
    const { setOnNewMessage } = useApp();

    useEffect(() => {
        setOnNewMessage((message) => {
            // Get current user role from localStorage
            const technician = localStorage.getItem('technician');
            const client = localStorage.getItem('client'); // Assuming client login exists or is similar

            let shouldPlayMatch = false;

            if (technician) {
                // Technician only hears messages from admin
                if (message.senderType === 'admin') shouldPlayMatch = true;
            } else if (client) {
                // Client hears messages from admin or technicians
                if (message.senderType !== 'client') shouldPlayMatch = true;
            } else {
                // Generic mobile user (manager?)
                if (message.senderType !== 'admin') shouldPlayMatch = true;
            }

            if (shouldPlayMatch) {
                try {
                    const audio = new Audio('/notification.mp3');
                    audio.play().catch(() => { });
                } catch (e) { }
            }
        });
    }, [setOnNewMessage]);

    return <>{children}</>;
};

export default MobileLayout;
