// src/components/HashRedirect.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function HashRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = window.location.pathname;
    const authPaths = ['/update-password', '/forgot-password', '/error'];

    if (authPaths.includes(path) && !window.location.hash) {
      const search = window.location.search;
      navigate(path + search, { replace: true });
    }
  }, [navigate, location]);

  return null;
}