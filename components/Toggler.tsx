// /* Toggle B */
// input:checked ~ .dot {
//     transform: translateX(100%);
//   }
//   input:checked ~ .block {
//     background-color: #48bb78;
//   }

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "../styles/home.module.scss";

const toggleTheme = () => {
  if (localStorage.theme === "dark") {
    document.documentElement.classList.remove("dark");
    localStorage.theme = "light";
  } else {
    document.documentElement.classList.add("dark");
    localStorage.theme = "dark";
  }
};

export default function Toggler() {
  return (
    <div className={styles["theme-toggle"] + " relative w-full px-3 pt-1 pb-2 md:p-0"}>
      <label
        htmlFor="toggleTheme"
        className="cursor-pointer flex items-center w-full md:w-auto"
      >
        <div className="font-bold mr-2 md:hidden">Dark mode</div>
        <div className="relative">
          <input
            type="checkbox"
            id="toggleTheme"
            name="toggleTheme"
            className="sr-only"
            onClick={toggleTheme}
            defaultChecked={localStorage.theme === "dark"}
          />
          <div
            className={styles.block + " bg-gray-600 w-14 h-8 rounded-full shadow"}
          ></div>
          <div
            className={
              styles.dot +
              " absolute left-1 top-1 w-6 h-6 rounded-full transition-transform flex items-center justify-center"
            }
          >
            <FontAwesomeIcon
              icon={["fas", "sun"]}
              fixedWidth
              className={styles["icon-light"]}
            />
            <FontAwesomeIcon
              icon={["fas", "moon"]}
              fixedWidth
              className={styles["icon-dark"]}
            />
          </div>
        </div>
      </label>
    </div>
  );
}
