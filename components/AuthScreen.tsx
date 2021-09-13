import { signIn } from "next-auth/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AuthScreen() {
  return (
    <>
      <button
        className="bg-white hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded shadow mt-14"
        type="button"
        onClick={() => signIn("google")}
      >
        <FontAwesomeIcon icon={["fab", "google"]} size="lg" fixedWidth /> Sign in with
        Google
      </button>
      <p className="bg-gray-100 text-gray-600 p-4 mt-10 mx-3 rounded text-sm text-center">
        This is a closed project, intended for personal use only. But in case you are
        interested to set up your own, you can check the source on{" "}
        <a
          className="text-blue-500 hover:text-blue-700"
          href="https://github.com/umutto/crypto-tax-calculator"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        .
      </p>
    </>
  );
}
