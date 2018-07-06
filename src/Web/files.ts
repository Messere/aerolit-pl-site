import macarena from "../Bin/Macarena";
import asciiArt from "./ascii";

/**
 * default contents of filesystem
 */

const openUrl = (url) => {
    location.assign(url);
};

const files = {
    "ascii-art": asciiArt,
    "bin": {
        macarena,
        src: openUrl.bind(this, "https://github.com/Messere"),
    },
    "readme.txt":
        "Written as an excersise in TypeScript programming.\n\n" +
        "Released under MIT.\nTo see/fork source code execute /bin/src",
    "sites": {
        external: {
            facebook: openUrl.bind(this, "https://www.facebook.com/darek.sieradzki.1"),
            github: openUrl.bind(this, "https://github.com/Messere"),
            linkedin: openUrl.bind(this, "https://www.linkedin.com/in/dsier/"),
            twitter: openUrl.bind(this, "https://twitter.com/DarekSieradzki"),
        },
        hosted: {
            dziwnonoc: openUrl.bind(this, "https://dziwnonoc.aerolit.pl/"),
            pikantnasztuka: openUrl.bind(this, "https://pikantnasztuka.aerolit.pl/"),
        },
    },
    "www": {
        "aerolit.pl": openUrl.bind(this, "https://aerolit.pl/"),
        "messer": openUrl.bind(this, "http://messer.aerolit.pl/"),
        "montypython": openUrl.bind(this, "https://montypython.aerolit.pl/"),
        "niemen": openUrl.bind(this, "https://niemen.aerolit.pl/forum/"),
        "osjan": openUrl.bind(this, "https://osjan.aerolit.pl/"),
    },
};

export default files;
