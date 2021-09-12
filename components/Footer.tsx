import React from "react";
import Image from "next/image";

import { Toggler } from ".";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class Footer extends React.Component {
  render() {
    const contactMail = process.env.NEXT_PUBLIC_CONTACT_EMAIL
      ? `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}?subject=Inquiry about crypto tax calculator`
      : null;
    return (
      <footer className="w-full border-t bg-gray-50 border-gray-300 md:py-2 mt-8 md:mt-2 dark:bg-gray-800 dark:text-white">
        <div className="flex mx-3 md:mx-5 my-1">
          <span className="flex flex-col md:flex-row flex-1 text-center items-center justify-center m-3 md:my-0">
            <span className="md:mx-1">
              Powered by
              <Image src="/images/vercel.svg" alt="Vercel Logo" width={56} height={12} />.
            </span>
            <span>
              Check out the
              <a
                href="https://github.com/umutto/crypto-tax-calculator"
                target="_blank"
                rel="noopener"
                title="Source on Github"
              >
                <u className="mx-1">source on github.</u>
              </a>
            </span>
          </span>
          <div className="flex md:mr-2 my-4 md:my-0">
            <div className="grid grid-cols-2 mx-0 gap-x-3">
              <a
                className={`col-span-2 ${
                  contactMail ? "md:col-span-1" : ""
                } flex items-center`}
                href="https://github.com/umutto"
                target="_blank"
                rel="noopener"
                title="Github Profile"
              >
                <FontAwesomeIcon
                  className="mr-1"
                  icon={["fab", "github"]}
                  size="lg"
                  fixedWidth
                />
                <span>umutto</span>
              </a>
              {contactMail && (
                <a
                  className="col-span-2 md:col-span-1 flex items-center"
                  href={contactMail}
                  title="Contact"
                >
                  <FontAwesomeIcon
                    className="mr-1"
                    icon={["fas", "envelope"]}
                    size="lg"
                    fixedWidth
                  />
                  <span>Contact</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
    );
  }
}
