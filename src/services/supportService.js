export const fetchTickets = async () => {
  const sessionStr = localStorage.getItem('vertex_session_v1');
  if (!sessionStr) return [];
  try {
    const session = JSON.parse(sessionStr);
    const res = await fetch('http://localhost:5000/api/v1/tickets', {
      headers: {
        'Authorization': `Bearer ${session.token}`
      }
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching tickets', error);
    return [];
  }
};

export const fetchFaq = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      import('../data/faq').then(module => {
        resolve({ categories: module.faqCategories, articles: module.faqArticles });
      });
    }, 400);
  });
};
