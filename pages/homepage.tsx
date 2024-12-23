import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Homepage = () => {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div>
      <h1>Welcome to the Homepage</h1>
    </div>
  );
};

export default Homepage;