import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class Navbar extends React.Component {
  toggleActive: () => void;
  state: Record<string, boolean>;

  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {
      active: false,
    };

    this.toggleActive = () => {
      this.setState({ active: !this.state.active });
    };
  }

  render() {
    return (
      <nav className="flex w-full items-center border-b border-gray-200 shadow-sm p-1 md:p-3 mb-3 md:mb-6">
        <Link href="/">
          <a className="inline-flex items-center p-2 mr-2 ">
            <img src="/polygon.png" className="mr-3 h-12 " />
            <span className="md:text-3xl font-bold uppercase">Crypto Tax Calculator</span>
          </a>
        </Link>
        <button
          className="inline-flex p-3 hover:bg-blue-600 hover:text-white rounded lg:hidden ml-auto outline-none"
          onClick={this.toggleActive}
        >
          <FontAwesomeIcon className="mr-1" icon={["fas", "bars"]} size="2x" fixedWidth />
        </button>
        <div
          className={`${
            this.state.active ? "" : "hidden"
          }   w-full lg:inline-flex lg:flex-grow lg:w-auto`}
        >
          <div className="lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start  flex flex-col lg:h-auto">
            <Link href="/">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-blue-600 hover:text-white ">
                Home
              </a>
            </Link>
            <Link href="/">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-blue-600 hover:text-white">
                Services
              </a>
            </Link>
            <Link href="/">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-blue-600 hover:text-white">
                About us
              </a>
            </Link>
            <Link href="/">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-blue-600 hover:text-white">
                Contact us
              </a>
            </Link>
            <Link href="/api/auth/signout">
              <a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-blue-600 hover:text-white border-t border-gray-200">
                Sign Out
              </a>
            </Link>
          </div>
        </div>
      </nav>
    );
  }
}
