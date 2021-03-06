import macarena from "../Bin/Macarena";
import ITerminal from "../Terminal/ITerminal";
import asciiArt from "./Ascii";

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
        src: openUrl.bind(this, "https://github.com/Messere/aerolit-pl-site"),
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
    "test": {
        "exec-file": (args: string[], terminal: ITerminal) => {
            terminal.printLn("lorem ipsum");
        },
        "text-file": "lorem ipsum",
    },
    "www": {
        "aerolit.pl": openUrl.bind(this, "https://aerolit.pl/"),
        "messer": openUrl.bind(this, "https://messer.aerolit.pl/"),
        "montypython": openUrl.bind(this, "https://montypython.aerolit.pl/"),
        "niemen": openUrl.bind(this, "https://niemen.aerolit.pl/forum/"),
        "osjan": openUrl.bind(this, "https://osjan.aerolit.pl/"),
    },
};

export default files;
