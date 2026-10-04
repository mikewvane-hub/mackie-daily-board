export const API_BASE =
  typeof window !== 'undefined' && window.location.pathname.startsWith('/mackie')
    ? '/mackie/api'
    : '/api';
