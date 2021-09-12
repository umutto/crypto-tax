import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Toggler } from ".";

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
      <nav className="flex md:flex-row flex-col w-full items-center border-b bg-gray-50 dark:bg-gray-800 border-gray-300 shadow-sm p-1 md:p-2 mb-6 md:mb-4">
        <div className="flex w-full items-center">
          <Link href="/">
            <a className="inline-flex items-center p-2 mr-2">
              <img src="/polygon.png" className="mr-2 h-11" />
              <span className="md:text-3xl font-bold uppercase text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-600">
                Crypto Tax Calculator
              </span>
            </a>
          </Link>
          <button
            className="inline-flex p-3 hover:bg-blue-600 hover:text-white dark:text-white rounded md:hidden ml-auto outline-none"
            onClick={this.toggleActive}
          >
            <FontAwesomeIcon icon={["fas", "bars"]} size="2x" fixedWidth />
          </button>
        </div>
        <div
          className={`${
            this.state.active ? "" : "hidden"
          } w-full md:inline-flex md:flex-grow md:w-auto`}
        >
          <div className="md:inline-flex md:flex-row md:ml-auto md:w-auto w-full md:items-center items-start flex flex-col md:h-auto border-t border-gray-300 mt-1 pt-1 md:border-0 md:whitespace-pre transition">
            <Link href="/portfolio">
              <a className="md:inline-flex md:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-blue-600 hover:text-white dark:text-white dark:hover:text-white transition duration-100">
                Portfolio
              </a>
            </Link>
            <Link href="/report">
              <a className="md:inline-flex md:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-blue-600 hover:text-white dark:text-white dark:hover:text-white transition duration-100">
                Report
              </a>
            </Link>
            <Link href="/stats">
              <a className="md:inline-flex md:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-blue-600 hover:text-white dark:text-white dark:hover:text-white transition duration-100">
                Stats
              </a>
            </Link>
            <Link href="/sync">
              <a className="md:inline-flex md:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-blue-600 hover:text-white dark:text-white dark:hover:text-white transition duration-100">
                Sync
              </a>
            </Link>
            <Toggler />
            <Link href="/api/auth/signout">
              <a className="md:inline-flex md:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-red-600 hover:text-white dark:text-white dark:hover:text-white border-t border-gray-100 md:border-0 transition duration-100">
                Sign Out
              </a>
            </Link>
          </div>
        </div>
      </nav>
    );
  }
}
