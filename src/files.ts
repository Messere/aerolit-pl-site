import macarena from "./Bin/Macarena";

/**
 * default contents of filesystem
 */

const openUrl = (url) => {
    location.assign(url);
}

const files = {
    'bin': {
        'macarena': macarena,
        'src': openUrl.bind(this, 'https://github.com/Messere'),
    },
    'www': {
        'aerolit.pl': openUrl.bind(this, 'https://aerolit.pl/'),
        'messer': openUrl.bind(this, 'http://messer.aerolit.pl/'),
        'montypython': openUrl.bind(this, 'https://montypython.aerolit.pl/'),
        'niemen': openUrl.bind(this, 'https://niemen.aerolit.pl/forum/'),
        'osjan': openUrl.bind(this, 'https://osjan.aerolit.pl/'),
    },
    'sites': {
        'hosted' : {
            'pikantnasztuka': openUrl.bind(this, 'https://pikantnasztuka.aerolit.pl/'),
            'dziwnonoc': openUrl.bind(this, 'https://dziwnonoc.aerolit.pl/'),
        },
        'external' : {
            'facebook': openUrl.bind(this, 'https://www.facebook.com/darek.sieradzki.1'),
            'linkedin': openUrl.bind(this, 'https://www.linkedin.com/in/dsier/'),
            'github': openUrl.bind(this, 'https://github.com/Messere'),
            'twitter': openUrl.bind(this, 'https://twitter.com/DarekSieradzki'),
        }
    },
    'readme.txt': "Written as an excersise in TypeScript programming.\n\nReleased under MIT.\nTo see/fork source code execute /bin/src",
};

export default files;
