import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import socket from './socket';  // make sure socket connects properly here

const NotificationListener = () => {
  useEffect(() => {
    // Request notification permission once
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          toast.success('🔔 Notifications enabled');
        }
      });
    }

    // New post notification handler
    const handleNewPosts = ({ savePost }) => {
      console.log('📨 Post Notification received:', savePost);
      toast.success(`🖼️ New post: ${savePost.title}`);

      if (Notification.permission === 'granted') {
        new Notification('🖼️ New Post Created', {
          body: `Title: ${savePost.title}`,
          icon: savePost.ImageUrl || 'https://via.placeholder.com/48'
        });
      }
    };

    // New video post notification handler
    const PushPostvideoNotification = ({ savePostvideo }) => {
      console.log('📨 Video Post Notification received:', savePostvideo);
      toast.success(`🎥 New video post: ${savePostvideo.title}`);

      if (Notification.permission === 'granted') {
        new Notification('🎥 New Video Post Created', {
          body: `Title: ${savePostvideo.title}`,
          icon: 'https://via.placeholder.com/48'
        });
      }
    };

    socket.on('PushPostNotification', handleNewPosts);
    socket.on('PushPostvideoNotification', PushPostvideoNotification);

    return () => {
      socket.off('PushPostNotification', handleNewPosts);
      // Correct event name here:
      socket.off('PushPostvideoNotification', PushPostvideoNotification);
    };
  }, []);

  return <Toaster position="top-center" reverseOrder={false} />;
};

export default NotificationListener;
