import { config, library } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
// import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
// import { faUserCog } from "@fortawesome/free-solid-svg-icons";

config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

// Import @fortawesome/free-brands-svg-icons
library.add(faGoogle);

// Import @fortawesome/free-regular-svg-icons
// library.add(faTimesCircle);

// Import @fortawesome/free-solid-svg-icons
// library.add(faUserCog);
