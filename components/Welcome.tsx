import React from "react";
import dynamic from "next/dynamic";

import { Loader } from ".";
const AuthScreen = dynamic(() => import("./AuthScreen"), { loading: Loader });

import Logo from "../public/logo_transparent_fit.svg";

export default class Welcome extends React.Component<{
  user?: Record<string, string | null | undefined>;
}> {
  render() {
    return this.props.user ? (
      <div className="w-full">
        <div className="flex flex-col md:flex-row items-center justify-center">
          <h1 className="text-3xl m-0 text-center dark:text-white text-shadow-crypto">
            Welcome back,{" "}
            <span className="text-blue-600 dark:text-blue-400 font-bold capitalize">
              {this.props.user.name?.split(" ")[0]}!
            </span>
          </h1>
        </div>
      </div>
    ) : (
      <>
        <div className="flex flex-col md:flex-row items-center justify-center">
          <Logo className="md:mr-5 h-44 md:h-60 mt-5 md:mt-0 text-blue-900 dark:text-gray-200" />
          <h1 className="text-6xl m-0 text-center dark:text-white text-shadow-crypto">
            <span className="text-blue-600 dark:text-blue-400 font-bold">Crypto</span> Tax
            Calculator
          </h1>
        </div>
        {!this.props.user && <AuthScreen></AuthScreen>}
      </>
    );
  }
}
