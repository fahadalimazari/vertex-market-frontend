import toast from 'react-hot-toast';

export const exportData = () => {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('vertex_')) {
      data[key] = localStorage.getItem(key);
    }
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vertex_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success('Backup downloaded successfully.');
};

export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        Object.keys(data).forEach(key => {
          if (key.startsWith('vertex_')) {
            localStorage.setItem(key, data[key]);
          }
        });
        toast.success('Backup restored successfully. Please refresh the page.');
        resolve(true);
      } catch (err) {
        toast.error('Invalid backup file.');
        reject(err);
      }
    };
    reader.readAsText(file);
  });
};

export const clearAllData = () => {
  if (window.confirm("Are you sure? This will delete all local data, settings, and orders.")) {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('vertex_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    toast.success('All data cleared. Resetting application...');
    setTimeout(() => window.location.reload(), 1500);
  }
};
