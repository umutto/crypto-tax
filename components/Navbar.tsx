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
      <nav className="flex md:flex-row flex-col w-full items-center border-b border-gray-300 shadow-sm p-1 md:p-3 mb-6">
        <div className="flex w-full items-center">
          <Link href="/">
            <a className="inline-flex items-center p-2 mr-2 ">
              <img src="/polygon.png" className="mr-3 h-12 " />
              <span className="md:text-3xl font-bold uppercase">
                Crypto Tax Calculator
              </span>
            </a>
          </Link>
          <button
            className="inline-flex p-3 hover:bg-blue-600 hover:text-white rounded md:hidden ml-auto outline-none"
            onClick={this.toggleActive}
          >
            <FontAwesomeIcon
              className="mr-1"
              icon={["fas", "bars"]}
              size="2x"
              fixedWidth
            />
          </button>
        </div>
        <div
          className={`${
            this.state.active ? "" : "hidden"
          } w-full md:inline-flex md:flex-grow md:w-auto`}
        >
          <div className="md:inline-flex md:flex-row md:ml-auto md:w-auto w-full md:items-center items-start flex flex-col md:h-auto border-t border-gray-300 mt-1 pt-1 md:border-0 md:whitespace-pre">
            <Link href="/portfolio">
              <a className="md:inline-flex md:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-blue-600 hover:text-white ">
                Portfolio
              </a>
            </Link>
            <Link href="/report">
              <a className="md:inline-flex md:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-blue-600 hover:text-white">
                Report
              </a>
            </Link>
            <Link href="/stats">
              <a className="md:inline-flex md:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-blue-600 hover:text-white">
                Stats
              </a>
            </Link>
            <Link href="/sync">
              <a className="md:inline-flex md:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-blue-600 hover:text-white">
                Sync
              </a>
            </Link>
            <Link href="/api/auth/signout">
              <a className="md:inline-flex md:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-red-600 hover:text-white border-t border-gray-100 md:border-0">
                Sign Out
              </a>
            </Link>
          </div>
        </div>
      </nav>
    );
  }
}
