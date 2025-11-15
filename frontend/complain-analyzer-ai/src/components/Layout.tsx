import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

function Layout() {
    return (
        <>
            <Outlet />
            <VercelAnalytics />
            <Toaster />
        </>
    );
}

export default Layout;
