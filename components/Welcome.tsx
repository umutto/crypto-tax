import React from "react";
import AuthScreen from "./AuthScreen";

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
          <img
            src="/polygon.png"
            className="md:mr-5 h-32 md:h-48 mt-5 md:mt-0"
            alt="Crypto Tax Calculator"
          />
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
