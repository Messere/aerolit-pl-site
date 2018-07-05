const openUrl = (url) => {
    location.assign(url);
}

const files = {
    'www': {
        'aerolit.pl': openUrl.bind(this, 'https://aerolit.pl/'),
        'montypython': openUrl.bind(this, 'https://montypython.aerolit.pl/'),
        'niemen': openUrl.bind(this, 'https://niemen.aerolit.pl/forum/'),
        'osjan': openUrl.bind(this, 'https://osjan.aerolit.pl/'),
    },
    'sites': {
        'hosted' : {
            'pikantnasztuka': openUrl.bind(this, 'https://pikantnasztuka.aerolit.pl/'),
            'dziwnonoc': openUrl.bind(this, 'https://dziwnonoc.aerolit.pl/')
        },
        'external' : {

        }
    },
    'readme.txt': 'Hello world!',
};

export default files;
