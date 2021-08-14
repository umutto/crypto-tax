import Layout from "../layouts/layout";
import { useSession } from "next-auth/client";

import { Header } from "../components";
import { AuthScreen } from "./authscreen";
import { Listings } from "./listings";

export default function Home() {
  const [session] = useSession();

  return (
    <Layout>
      <>
        <Header user={session?.user}></Header>
        {!session && <AuthScreen></AuthScreen>}
        {session && <Listings></Listings>}
      </>
    </Layout>
  );
}
