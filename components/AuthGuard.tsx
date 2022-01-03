import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { Loader } from ".";

export function AuthGuard({ children }: { children: JSX.Element }) {
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.push("/");
    }
  }, [loading, router, session]);

  if (loading) {
    return <Loader />;
  }

  if (!loading && session) {
    return <>{children}</>;
  }

  return null;
}
