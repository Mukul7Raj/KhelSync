import { useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';

const Notifications = () => {
    const channelRef = useRef(null);
    const subscribedRef = useRef(false);

    useEffect(() => {
        channelRef.current = supabase.channel('realtime:notifications')
            .on('INSERT', payload => {
                console.log('New message!', payload);
            })
            .subscribe(status => {
                console.log('Subscription status:', status);
                subscribedRef.current = true;
            });

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
                channelRef.current = null;
                subscribedRef.current = false;
            }
        };
    }, []);

    return (
        <div>
            <h1>Notifications</h1>
            {/* Your notification UI here */}
        </div>
    );
};

export default Notifications;