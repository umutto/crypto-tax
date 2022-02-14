import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

import { Loader } from ".";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Toggler = dynamic(() => import("./Toggler"), { loading: Loader });

import LogoIcon from "../public/logo_icon.svg";

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
      <nav className="flex md:flex-row flex-col w-full items-center border-b bg-gray-50 dark:bg-gray-800 border-gray-300 shadow-sm p-1 md:p-2 mb-6 md:mb-4 z-10">
        <div className="flex w-full items-center">
          <Link href="/">
            <a
              className="inline-flex items-center p-2 mr-2 text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-600"
              title="Crypto Tax Calculator"
            >
              <LogoIcon className="mr-3 md:mr-5 h-14 w-14 -my-4" />
              <span className="text-2xl md:text-3xl font-bold">TaxMan</span>
            </a>
          </Link>
          <button
            className="inline-flex p-3 hover:bg-blue-600 hover:text-white dark:text-white rounded md:hidden ml-auto outline-none"
            onClick={this.toggleActive}
            title="Toggle menu"
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
