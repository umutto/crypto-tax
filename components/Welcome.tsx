import React from "react";

export default class Welcome extends React.Component<{
  user?: Record<string, string | null | undefined>;
}> {
  render() {
    return this.props.user ? (
      <div className="w-full">
        <div className="flex flex-col md:flex-row items-center justify-center">
          <h1 className="text-3xl m-0 text-center">
            Welcome back,{" "}
            <span className="text-blue-600 font-bold capitalize">
              {this.props.user.name?.split(" ")[0]}!
            </span>
          </h1>
        </div>
      </div>
    ) : (
      <div className="flex flex-col md:flex-row items-center justify-center">
        <img src="/polygon.png" className="md:mr-5 h-32 md:h-48" />
        <h1 className="text-6xl leading-5 m-0 text-center">
          <span className="text-blue-600 font-bold">Crypto</span> Tax Calculator
        </h1>
      </div>
    );
  }
}
