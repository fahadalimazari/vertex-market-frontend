import { useState, useEffect } from 'react'
import { userProfile as initialUserProfile } from '../../data/user'
import { authService } from '../../services/auth/authService'
import { useAuth } from '../AuthContext'
import toast from 'react-hot-toast'

export const useUser = () => {
  const { refreshSession } = useAuth()
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('vertex_user_v1')
    return saved ? JSON.parse(saved) : initialUserProfile
  })

  useEffect(() => {
    localStorage.setItem('vertex_user_v1', JSON.stringify(userProfile))
  }, [userProfile])

  const updateUserProfile = async (newData) => {
    setUserProfile(prev => ({ ...prev, ...newData }))
    try {
      // Sync to backend
      const payload = {
        name: newData.fullName || newData.name,
        avatar: newData.avatar
      };
      await authService.updateProfile(payload);
      await refreshSession();
    } catch (error) {
      console.error('Failed to sync profile update to backend', error);
    }
  }

  const updateAvatar = async (avatarData) => {
    // If it's a file, we upload it
    if (avatarData instanceof File) {
      const formData = new FormData();
      formData.append('image', avatarData);
      
      try {
        const sessionStr = localStorage.getItem('vertex_session_v1');
        const token = sessionStr ? JSON.parse(sessionStr).token : null;
        
        const res = await fetch('http://localhost:5000/api/v1/upload', {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: formData
        });
        const data = await res.json();
        
        if (data.success) {
          const fullUrl = `http://localhost:5000${data.url}`;
          setUserProfile(prev => ({ ...prev, avatar: fullUrl }));
          await authService.updateProfile({ avatar: fullUrl });
          await refreshSession();
          return fullUrl;
        } else {
          throw new Error(data.error || 'Upload failed');
        }
      } catch (error) {
        console.error('Failed to upload avatar', error);
        toast.error('Failed to upload image. Using local preview.');
        const backupUrl = URL.createObjectURL(avatarData);
        setUserProfile(prev => ({ ...prev, avatar: backupUrl }));
        return backupUrl;
      }
    } else if (typeof avatarData === 'string') {
      setUserProfile(prev => ({ ...prev, avatar: avatarData }));
      try {
        await authService.updateProfile({ avatar: avatarData });
        await refreshSession();
      } catch (e) {
        console.error('Failed to sync avatar update to backend', e);
      }
      return avatarData;
    }
  }

  return { userProfile, updateUserProfile, updateAvatar }
}
