import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";

export const meta = () => {
  return [
    { title: "SmartResume | Auth" },
    {
      name: "description",
      content: "Login to your account to continue",
    },
  ];
};

const auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1];
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(next || "/");
    }
  }, [auth.isAuthenticated, next]);

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          <div className="flex flex-col items-center text-center gap-2">
            <h1>Welcome</h1>
            <h2>Log In to continue using SmartResume</h2>
          </div>
          <div>
            {isLoading ? (
              <button className="auth-button animate-pulse">
                Signing you in ...
              </button>
            ) : auth.isAuthenticated ? (
              <button className="auth-button" onClick={auth.signOut}>
                <p>Log Out</p>
              </button>
            ) : (
              <button className="auth-button" onClick={auth.signIn}>
                <p>Sign In</p>
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default auth;
