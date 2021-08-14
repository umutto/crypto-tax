import { signIn } from "next-auth/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Header } from "../components";

export function AuthScreen() {
  return (
    <>
      <p className="text-gray-500 pt-10 pb-3 text-sm">You are not signed in.</p>
      <button
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded shadow"
        type="button"
        onClick={() => signIn("google")}
      >
        <FontAwesomeIcon icon={["fab", "google"]} size="lg" fixedWidth /> Sign in with
        Google
      </button>
    </>
  );
}
