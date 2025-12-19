import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 landing-page">
      <div className="glass-card rounded-[2.5rem] p-12 text-center max-w-md w-full border-white/10">
        <h1 className="text-8xl font-black text-white mb-4 animate-pulse">404</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Lost in Space?</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved to a new dimension.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-white/90 transition-all duration-300 shadow-xl shadow-white/10"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
