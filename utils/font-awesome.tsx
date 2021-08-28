import { config, library } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faBars,
  faEnvelope,
  faSyncAlt,
  faCoins,
  faFileSignature,
  faChartBar,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";

config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

library.add(
  faGoogle,
  faGithub,
  faBars,
  faEnvelope,
  faSyncAlt,
  faCoins,
  faFileSignature,
  faChartBar,
  faMoon,
  faSun
);
