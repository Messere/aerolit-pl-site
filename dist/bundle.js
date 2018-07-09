(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*!
 * UAParser.js v0.7.18
 * Lightweight JavaScript-based User-Agent string parser
 * https://github.com/faisalman/ua-parser-js
 *
 * Copyright © 2012-2016 Faisal Salman <fyzlman@gmail.com>
 * Dual licensed under GPLv2 or MIT
 */

(function (window, undefined) {

    'use strict';

    //////////////
    // Constants
    /////////////


    var LIBVERSION  = '0.7.18',
        EMPTY       = '',
        UNKNOWN     = '?',
        FUNC_TYPE   = 'function',
        UNDEF_TYPE  = 'undefined',
        OBJ_TYPE    = 'object',
        STR_TYPE    = 'string',
        MAJOR       = 'major', // deprecated
        MODEL       = 'model',
        NAME        = 'name',
        TYPE        = 'type',
        VENDOR      = 'vendor',
        VERSION     = 'version',
        ARCHITECTURE= 'architecture',
        CONSOLE     = 'console',
        MOBILE      = 'mobile',
        TABLET      = 'tablet',
        SMARTTV     = 'smarttv',
        WEARABLE    = 'wearable',
        EMBEDDED    = 'embedded';


    ///////////
    // Helper
    //////////


    var util = {
        extend : function (regexes, extensions) {
            var margedRegexes = {};
            for (var i in regexes) {
                if (extensions[i] && extensions[i].length % 2 === 0) {
                    margedRegexes[i] = extensions[i].concat(regexes[i]);
                } else {
                    margedRegexes[i] = regexes[i];
                }
            }
            return margedRegexes;
        },
        has : function (str1, str2) {
          if (typeof str1 === "string") {
            return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
          } else {
            return false;
          }
        },
        lowerize : function (str) {
            return str.toLowerCase();
        },
        major : function (version) {
            return typeof(version) === STR_TYPE ? version.replace(/[^\d\.]/g,'').split(".")[0] : undefined;
        },
        trim : function (str) {
          return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        }
    };


    ///////////////
    // Map helper
    //////////////


    var mapper = {

        rgx : function (ua, arrays) {

            //var result = {},
            var i = 0, j, k, p, q, matches, match;//, args = arguments;

            /*// construct object barebones
            for (p = 0; p < args[1].length; p++) {
                q = args[1][p];
                result[typeof q === OBJ_TYPE ? q[0] : q] = undefined;
            }*/

            // loop through all regexes maps
            while (i < arrays.length && !matches) {

                var regex = arrays[i],       // even sequence (0,2,4,..)
                    props = arrays[i + 1];   // odd sequence (1,3,5,..)
                j = k = 0;

                // try matching uastring with regexes
                while (j < regex.length && !matches) {

                    matches = regex[j++].exec(ua);

                    if (!!matches) {
                        for (p = 0; p < props.length; p++) {
                            match = matches[++k];
                            q = props[p];
                            // check if given property is actually array
                            if (typeof q === OBJ_TYPE && q.length > 0) {
                                if (q.length == 2) {
                                    if (typeof q[1] == FUNC_TYPE) {
                                        // assign modified match
                                        this[q[0]] = q[1].call(this, match);
                                    } else {
                                        // assign given value, ignore regex match
                                        this[q[0]] = q[1];
                                    }
                                } else if (q.length == 3) {
                                    // check whether function or regex
                                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                                        // call function (usually string mapper)
                                        this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                                    } else {
                                        // sanitize match using given regex
                                        this[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                                    }
                                } else if (q.length == 4) {
                                        this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                                }
                            } else {
                                this[q] = match ? match : undefined;
                            }
                        }
                    }
                }
                i += 2;
            }
            // console.log(this);
            //return this;
        },

        str : function (str, map) {

            for (var i in map) {
                // check if array
                if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                    for (var j = 0; j < map[i].length; j++) {
                        if (util.has(map[i][j], str)) {
                            return (i === UNKNOWN) ? undefined : i;
                        }
                    }
                } else if (util.has(map[i], str)) {
                    return (i === UNKNOWN) ? undefined : i;
                }
            }
            return str;
        }
    };


    ///////////////
    // String map
    //////////////


    var maps = {

        browser : {
            oldsafari : {
                version : {
                    '1.0'   : '/8',
                    '1.2'   : '/1',
                    '1.3'   : '/3',
                    '2.0'   : '/412',
                    '2.0.2' : '/416',
                    '2.0.3' : '/417',
                    '2.0.4' : '/419',
                    '?'     : '/'
                }
            }
        },

        device : {
            amazon : {
                model : {
                    'Fire Phone' : ['SD', 'KF']
                }
            },
            sprint : {
                model : {
                    'Evo Shift 4G' : '7373KT'
                },
                vendor : {
                    'HTC'       : 'APA',
                    'Sprint'    : 'Sprint'
                }
            }
        },

        os : {
            windows : {
                version : {
                    'ME'        : '4.90',
                    'NT 3.11'   : 'NT3.51',
                    'NT 4.0'    : 'NT4.0',
                    '2000'      : 'NT 5.0',
                    'XP'        : ['NT 5.1', 'NT 5.2'],
                    'Vista'     : 'NT 6.0',
                    '7'         : 'NT 6.1',
                    '8'         : 'NT 6.2',
                    '8.1'       : 'NT 6.3',
                    '10'        : ['NT 6.4', 'NT 10.0'],
                    'RT'        : 'ARM'
                }
            }
        }
    };


    //////////////
    // Regex map
    /////////////


    var regexes = {

        browser : [[

            // Presto based
            /(opera\smini)\/([\w\.-]+)/i,                                       // Opera Mini
            /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,                      // Opera Mobi/Tablet
            /(opera).+version\/([\w\.]+)/i,                                     // Opera > 9.80
            /(opera)[\/\s]+([\w\.]+)/i                                          // Opera < 9.80
            ], [NAME, VERSION], [

            /(opios)[\/\s]+([\w\.]+)/i                                          // Opera mini on iphone >= 8.0
            ], [[NAME, 'Opera Mini'], VERSION], [

            /\s(opr)\/([\w\.]+)/i                                               // Opera Webkit
            ], [[NAME, 'Opera'], VERSION], [

            // Mixed
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i,
                                                                                // Lunascape/Maxthon/Netfront/Jasmine/Blazer

            // Trident based
            /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,
                                                                                // Avant/IEMobile/SlimBrowser/Baidu
            /(?:ms|\()(ie)\s([\w\.]+)/i,                                        // Internet Explorer

            // Webkit/KHTML based
            /(rekonq)\/([\w\.]*)/i,                                             // Rekonq
            /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark)\/([\w\.-]+)/i
                                                                                // Chromium/Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser
            ], [NAME, VERSION], [

            /(trident).+rv[:\s]([\w\.]+).+like\sgecko/i                         // IE11
            ], [[NAME, 'IE'], VERSION], [

            /(edge|edgios|edgea)\/((\d+)?[\w\.]+)/i                             // Microsoft Edge
            ], [[NAME, 'Edge'], VERSION], [

            /(yabrowser)\/([\w\.]+)/i                                           // Yandex
            ], [[NAME, 'Yandex'], VERSION], [

            /(puffin)\/([\w\.]+)/i                                              // Puffin
            ], [[NAME, 'Puffin'], VERSION], [

            /((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i
                                                                                // UCBrowser
            ], [[NAME, 'UCBrowser'], VERSION], [

            /(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
            ], [[NAME, /_/g, ' '], VERSION], [

            /(micromessenger)\/([\w\.]+)/i                                      // WeChat
            ], [[NAME, 'WeChat'], VERSION], [

            /(qqbrowserlite)\/([\w\.]+)/i                                       // QQBrowserLite
            ], [NAME, VERSION], [

            /(QQ)\/([\d\.]+)/i                                                  // QQ, aka ShouQ
            ], [NAME, VERSION], [

            /m?(qqbrowser)[\/\s]?([\w\.]+)/i                                    // QQBrowser
            ], [NAME, VERSION], [

            /(BIDUBrowser)[\/\s]?([\w\.]+)/i                                    // Baidu Browser
            ], [NAME, VERSION], [

            /(2345Explorer)[\/\s]?([\w\.]+)/i                                   // 2345 Browser
            ], [NAME, VERSION], [

            /(MetaSr)[\/\s]?([\w\.]+)/i                                         // SouGouBrowser
            ], [NAME], [

            /(LBBROWSER)/i                                      // LieBao Browser
            ], [NAME], [

            /xiaomi\/miuibrowser\/([\w\.]+)/i                                   // MIUI Browser
            ], [VERSION, [NAME, 'MIUI Browser']], [

            /;fbav\/([\w\.]+);/i                                                // Facebook App for iOS & Android
            ], [VERSION, [NAME, 'Facebook']], [

            /headlesschrome(?:\/([\w\.]+)|\s)/i                                 // Chrome Headless
            ], [VERSION, [NAME, 'Chrome Headless']], [

            /\swv\).+(chrome)\/([\w\.]+)/i                                      // Chrome WebView
            ], [[NAME, /(.+)/, '$1 WebView'], VERSION], [

            /((?:oculus|samsung)browser)\/([\w\.]+)/i
            ], [[NAME, /(.+(?:g|us))(.+)/, '$1 $2'], VERSION], [                // Oculus / Samsung Browser

            /android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i        // Android Browser
            ], [VERSION, [NAME, 'Android Browser']], [

            /(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i
                                                                                // Chrome/OmniWeb/Arora/Tizen/Nokia
            ], [NAME, VERSION], [

            /(dolfin)\/([\w\.]+)/i                                              // Dolphin
            ], [[NAME, 'Dolphin'], VERSION], [

            /((?:android.+)crmo|crios)\/([\w\.]+)/i                             // Chrome for Android/iOS
            ], [[NAME, 'Chrome'], VERSION], [

            /(coast)\/([\w\.]+)/i                                               // Opera Coast
            ], [[NAME, 'Opera Coast'], VERSION], [

            /fxios\/([\w\.-]+)/i                                                // Firefox for iOS
            ], [VERSION, [NAME, 'Firefox']], [

            /version\/([\w\.]+).+?mobile\/\w+\s(safari)/i                       // Mobile Safari
            ], [VERSION, [NAME, 'Mobile Safari']], [

            /version\/([\w\.]+).+?(mobile\s?safari|safari)/i                    // Safari & Safari Mobile
            ], [VERSION, NAME], [

            /webkit.+?(gsa)\/([\w\.]+).+?(mobile\s?safari|safari)(\/[\w\.]+)/i  // Google Search Appliance on iOS
            ], [[NAME, 'GSA'], VERSION], [

            /webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i                     // Safari < 3.0
            ], [NAME, [VERSION, mapper.str, maps.browser.oldsafari.version]], [

            /(konqueror)\/([\w\.]+)/i,                                          // Konqueror
            /(webkit|khtml)\/([\w\.]+)/i
            ], [NAME, VERSION], [

            // Gecko based
            /(navigator|netscape)\/([\w\.-]+)/i                                 // Netscape
            ], [[NAME, 'Netscape'], VERSION], [
            /(swiftfox)/i,                                                      // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
                                                                                // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
            /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i,

                                                                                // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,                          // Mozilla

            // Other
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
                                                                                // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir
            /(links)\s\(([\w\.]+)/i,                                            // Links
            /(gobrowser)\/?([\w\.]*)/i,                                         // GoBrowser
            /(ice\s?browser)\/v?([\w\._]+)/i,                                   // ICE Browser
            /(mosaic)[\/\s]([\w\.]+)/i                                          // Mosaic
            ], [NAME, VERSION]

            /* /////////////////////
            // Media players BEGIN
            ////////////////////////

            , [

            /(apple(?:coremedia|))\/((\d+)[\w\._]+)/i,                          // Generic Apple CoreMedia
            /(coremedia) v((\d+)[\w\._]+)/i
            ], [NAME, VERSION], [

            /(aqualung|lyssna|bsplayer)\/((\d+)?[\w\.-]+)/i                     // Aqualung/Lyssna/BSPlayer
            ], [NAME, VERSION], [

            /(ares|ossproxy)\s((\d+)[\w\.-]+)/i                                 // Ares/OSSProxy
            ], [NAME, VERSION], [

            /(audacious|audimusicstream|amarok|bass|core|dalvik|gnomemplayer|music on console|nsplayer|psp-internetradioplayer|videos)\/((\d+)[\w\.-]+)/i,
                                                                                // Audacious/AudiMusicStream/Amarok/BASS/OpenCORE/Dalvik/GnomeMplayer/MoC
                                                                                // NSPlayer/PSP-InternetRadioPlayer/Videos
            /(clementine|music player daemon)\s((\d+)[\w\.-]+)/i,               // Clementine/MPD
            /(lg player|nexplayer)\s((\d+)[\d\.]+)/i,
            /player\/(nexplayer|lg player)\s((\d+)[\w\.-]+)/i                   // NexPlayer/LG Player
            ], [NAME, VERSION], [
            /(nexplayer)\s((\d+)[\w\.-]+)/i                                     // Nexplayer
            ], [NAME, VERSION], [

            /(flrp)\/((\d+)[\w\.-]+)/i                                          // Flip Player
            ], [[NAME, 'Flip Player'], VERSION], [

            /(fstream|nativehost|queryseekspider|ia-archiver|facebookexternalhit)/i
                                                                                // FStream/NativeHost/QuerySeekSpider/IA Archiver/facebookexternalhit
            ], [NAME], [

            /(gstreamer) souphttpsrc (?:\([^\)]+\)){0,1} libsoup\/((\d+)[\w\.-]+)/i
                                                                                // Gstreamer
            ], [NAME, VERSION], [

            /(htc streaming player)\s[\w_]+\s\/\s((\d+)[\d\.]+)/i,              // HTC Streaming Player
            /(java|python-urllib|python-requests|wget|libcurl)\/((\d+)[\w\.-_]+)/i,
                                                                                // Java/urllib/requests/wget/cURL
            /(lavf)((\d+)[\d\.]+)/i                                             // Lavf (FFMPEG)
            ], [NAME, VERSION], [

            /(htc_one_s)\/((\d+)[\d\.]+)/i                                      // HTC One S
            ], [[NAME, /_/g, ' '], VERSION], [

            /(mplayer)(?:\s|\/)(?:(?:sherpya-){0,1}svn)(?:-|\s)(r\d+(?:-\d+[\w\.-]+){0,1})/i
                                                                                // MPlayer SVN
            ], [NAME, VERSION], [

            /(mplayer)(?:\s|\/|[unkow-]+)((\d+)[\w\.-]+)/i                      // MPlayer
            ], [NAME, VERSION], [

            /(mplayer)/i,                                                       // MPlayer (no other info)
            /(yourmuze)/i,                                                      // YourMuze
            /(media player classic|nero showtime)/i                             // Media Player Classic/Nero ShowTime
            ], [NAME], [

            /(nero (?:home|scout))\/((\d+)[\w\.-]+)/i                           // Nero Home/Nero Scout
            ], [NAME, VERSION], [

            /(nokia\d+)\/((\d+)[\w\.-]+)/i                                      // Nokia
            ], [NAME, VERSION], [

            /\s(songbird)\/((\d+)[\w\.-]+)/i                                    // Songbird/Philips-Songbird
            ], [NAME, VERSION], [

            /(winamp)3 version ((\d+)[\w\.-]+)/i,                               // Winamp
            /(winamp)\s((\d+)[\w\.-]+)/i,
            /(winamp)mpeg\/((\d+)[\w\.-]+)/i
            ], [NAME, VERSION], [

            /(ocms-bot|tapinradio|tunein radio|unknown|winamp|inlight radio)/i  // OCMS-bot/tap in radio/tunein/unknown/winamp (no other info)
                                                                                // inlight radio
            ], [NAME], [

            /(quicktime|rma|radioapp|radioclientapplication|soundtap|totem|stagefright|streamium)\/((\d+)[\w\.-]+)/i
                                                                                // QuickTime/RealMedia/RadioApp/RadioClientApplication/
                                                                                // SoundTap/Totem/Stagefright/Streamium
            ], [NAME, VERSION], [

            /(smp)((\d+)[\d\.]+)/i                                              // SMP
            ], [NAME, VERSION], [

            /(vlc) media player - version ((\d+)[\w\.]+)/i,                     // VLC Videolan
            /(vlc)\/((\d+)[\w\.-]+)/i,
            /(xbmc|gvfs|xine|xmms|irapp)\/((\d+)[\w\.-]+)/i,                    // XBMC/gvfs/Xine/XMMS/irapp
            /(foobar2000)\/((\d+)[\d\.]+)/i,                                    // Foobar2000
            /(itunes)\/((\d+)[\d\.]+)/i                                         // iTunes
            ], [NAME, VERSION], [

            /(wmplayer)\/((\d+)[\w\.-]+)/i,                                     // Windows Media Player
            /(windows-media-player)\/((\d+)[\w\.-]+)/i
            ], [[NAME, /-/g, ' '], VERSION], [

            /windows\/((\d+)[\w\.-]+) upnp\/[\d\.]+ dlnadoc\/[\d\.]+ (home media server)/i
                                                                                // Windows Media Server
            ], [VERSION, [NAME, 'Windows']], [

            /(com\.riseupradioalarm)\/((\d+)[\d\.]*)/i                          // RiseUP Radio Alarm
            ], [NAME, VERSION], [

            /(rad.io)\s((\d+)[\d\.]+)/i,                                        // Rad.io
            /(radio.(?:de|at|fr))\s((\d+)[\d\.]+)/i
            ], [[NAME, 'rad.io'], VERSION]

            //////////////////////
            // Media players END
            ////////////////////*/

        ],

        cpu : [[

            /(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i                     // AMD64
            ], [[ARCHITECTURE, 'amd64']], [

            /(ia32(?=;))/i                                                      // IA32 (quicktime)
            ], [[ARCHITECTURE, util.lowerize]], [

            /((?:i[346]|x)86)[;\)]/i                                            // IA32
            ], [[ARCHITECTURE, 'ia32']], [

            // PocketPC mistakenly identified as PowerPC
            /windows\s(ce|mobile);\sppc;/i
            ], [[ARCHITECTURE, 'arm']], [

            /((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i                           // PowerPC
            ], [[ARCHITECTURE, /ower/, '', util.lowerize]], [

            /(sun4\w)[;\)]/i                                                    // SPARC
            ], [[ARCHITECTURE, 'sparc']], [

            /((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i
                                                                                // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
            ], [[ARCHITECTURE, util.lowerize]]
        ],

        device : [[

            /\((ipad|playbook);[\w\s\);-]+(rim|apple)/i                         // iPad/PlayBook
            ], [MODEL, VENDOR, [TYPE, TABLET]], [

            /applecoremedia\/[\w\.]+ \((ipad)/                                  // iPad
            ], [MODEL, [VENDOR, 'Apple'], [TYPE, TABLET]], [

            /(apple\s{0,1}tv)/i                                                 // Apple TV
            ], [[MODEL, 'Apple TV'], [VENDOR, 'Apple']], [

            /(archos)\s(gamepad2?)/i,                                           // Archos
            /(hp).+(touchpad)/i,                                                // HP TouchPad
            /(hp).+(tablet)/i,                                                  // HP Tablet
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /\s(nook)[\w\s]+build\/(\w+)/i,                                     // Nook
            /(dell)\s(strea[kpr\s\d]*[\dko])/i                                  // Dell Streak
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(kf[A-z]+)\sbuild\/.+silk\//i                                      // Kindle Fire HD
            ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [
            /(sd|kf)[0349hijorstuw]+\sbuild\/.+silk\//i                         // Fire Phone
            ], [[MODEL, mapper.str, maps.device.amazon.model], [VENDOR, 'Amazon'], [TYPE, MOBILE]], [

            /\((ip[honed|\s\w*]+);.+(apple)/i                                   // iPod/iPhone
            ], [MODEL, VENDOR, [TYPE, MOBILE]], [
            /\((ip[honed|\s\w*]+);/i                                            // iPod/iPhone
            ], [MODEL, [VENDOR, 'Apple'], [TYPE, MOBILE]], [

            /(blackberry)[\s-]?(\w+)/i,                                         // BlackBerry
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i,
                                                                                // BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
            /(hp)\s([\w\s]+\w)/i,                                               // HP iPAQ
            /(asus)-?(\w+)/i                                                    // Asus
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /\(bb10;\s(\w+)/i                                                   // BlackBerry 10
            ], [MODEL, [VENDOR, 'BlackBerry'], [TYPE, MOBILE]], [
                                                                                // Asus Tablets
            /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone)/i
            ], [MODEL, [VENDOR, 'Asus'], [TYPE, TABLET]], [

            /(sony)\s(tablet\s[ps])\sbuild\//i,                                  // Sony
            /(sony)?(?:sgp.+)\sbuild\//i
            ], [[VENDOR, 'Sony'], [MODEL, 'Xperia Tablet'], [TYPE, TABLET]], [
            /android.+\s([c-g]\d{4}|so[-l]\w+)\sbuild\//i
            ], [MODEL, [VENDOR, 'Sony'], [TYPE, MOBILE]], [

            /\s(ouya)\s/i,                                                      // Ouya
            /(nintendo)\s([wids3u]+)/i                                          // Nintendo
            ], [VENDOR, MODEL, [TYPE, CONSOLE]], [

            /android.+;\s(shield)\sbuild/i                                      // Nvidia
            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [

            /(playstation\s[34portablevi]+)/i                                   // Playstation
            ], [MODEL, [VENDOR, 'Sony'], [TYPE, CONSOLE]], [

            /(sprint\s(\w+))/i                                                  // Sprint Phones
            ], [[VENDOR, mapper.str, maps.device.sprint.vendor], [MODEL, mapper.str, maps.device.sprint.model], [TYPE, MOBILE]], [

            /(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i                         // Lenovo tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i,                               // HTC
            /(zte)-(\w*)/i,                                                     // ZTE
            /(alcatel|geeksphone|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i
                                                                                // Alcatel/GeeksPhone/Lenovo/Nexian/Panasonic/Sony
            ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [

            /(nexus\s9)/i                                                       // HTC Nexus 9
            ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [

            /d\/huawei([\w\s-]+)[;\)]/i,
            /(nexus\s6p)/i                                                      // Huawei
            ], [MODEL, [VENDOR, 'Huawei'], [TYPE, MOBILE]], [

            /(microsoft);\s(lumia[\s\w]+)/i                                     // Microsoft Lumia
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /[\s\(;](xbox(?:\sone)?)[\s\);]/i                                   // Microsoft Xbox
            ], [MODEL, [VENDOR, 'Microsoft'], [TYPE, CONSOLE]], [
            /(kin\.[onetw]{3})/i                                                // Microsoft Kin
            ], [[MODEL, /\./g, ' '], [VENDOR, 'Microsoft'], [TYPE, MOBILE]], [

                                                                                // Motorola
            /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?:?(\s4g)?)[\w\s]+build\//i,
            /mot[\s-]?(\w*)/i,
            /(XT\d{3,4}) build\//i,
            /(nexus\s6)/i
            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, MOBILE]], [
            /android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i
            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, TABLET]], [

            /hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i            // HbbTV devices
            ], [[VENDOR, util.trim], [MODEL, util.trim], [TYPE, SMARTTV]], [

            /hbbtv.+maple;(\d+)/i
            ], [[MODEL, /^/, 'SmartTV'], [VENDOR, 'Samsung'], [TYPE, SMARTTV]], [

            /\(dtv[\);].+(aquos)/i                                              // Sharp
            ], [MODEL, [VENDOR, 'Sharp'], [TYPE, SMARTTV]], [

            /android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,
            /((SM-T\w+))/i
            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, TABLET]], [                  // Samsung
            /smart-tv.+(samsung)/i
            ], [VENDOR, [TYPE, SMARTTV], MODEL], [
            /((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,
            /(sam[sung]*)[\s-]*(\w+-?[\w-]*)/i,
            /sec-((sgh\w+))/i
            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, MOBILE]], [

            /sie-(\w*)/i                                                        // Siemens
            ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [

            /(maemo|nokia).*(n900|lumia\s\d+)/i,                                // Nokia
            /(nokia)[\s_-]?([\w-]*)/i
            ], [[VENDOR, 'Nokia'], MODEL, [TYPE, MOBILE]], [

            /android\s3\.[\s\w;-]{10}(a\d{3})/i                                 // Acer
            ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

            /android.+([vl]k\-?\d{3})\s+build/i                                 // LG Tablet
            ], [MODEL, [VENDOR, 'LG'], [TYPE, TABLET]], [
            /android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i                     // LG Tablet
            ], [[VENDOR, 'LG'], MODEL, [TYPE, TABLET]], [
            /(lg) netcast\.tv/i                                                 // LG SmartTV
            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
            /(nexus\s[45])/i,                                                   // LG
            /lg[e;\s\/-]+(\w*)/i,
            /android.+lg(\-?[\d\w]+)\s+build/i
            ], [MODEL, [VENDOR, 'LG'], [TYPE, MOBILE]], [

            /android.+(ideatab[a-z0-9\-\s]+)/i                                  // Lenovo
            ], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [

            /linux;.+((jolla));/i                                               // Jolla
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /((pebble))app\/[\d\.]+\s/i                                         // Pebble
            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [

            /android.+;\s(oppo)\s?([\w\s]+)\sbuild/i                            // OPPO
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /crkey/i                                                            // Google Chromecast
            ], [[MODEL, 'Chromecast'], [VENDOR, 'Google']], [

            /android.+;\s(glass)\s\d/i                                          // Google Glass
            ], [MODEL, [VENDOR, 'Google'], [TYPE, WEARABLE]], [

            /android.+;\s(pixel c)\s/i                                          // Google Pixel C
            ], [MODEL, [VENDOR, 'Google'], [TYPE, TABLET]], [

            /android.+;\s(pixel xl|pixel)\s/i                                   // Google Pixel
            ], [MODEL, [VENDOR, 'Google'], [TYPE, MOBILE]], [

            /android.+;\s(\w+)\s+build\/hm\1/i,                                 // Xiaomi Hongmi 'numeric' models
            /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,               // Xiaomi Hongmi
            /android.+(mi[\s\-_]*(?:one|one[\s_]plus|note lte)?[\s_]*(?:\d?\w?)[\s_]*(?:plus)?)\s+build/i,    // Xiaomi Mi
            /android.+(redmi[\s\-_]*(?:note)?(?:[\s_]*[\w\s]+))\s+build/i       // Redmi Phones
            ], [[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, MOBILE]], [
            /android.+(mi[\s\-_]*(?:pad)(?:[\s_]*[\w\s]+))\s+build/i            // Mi Pad tablets
            ],[[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, TABLET]], [
            /android.+;\s(m[1-5]\snote)\sbuild/i                                // Meizu Tablet
            ], [MODEL, [VENDOR, 'Meizu'], [TYPE, TABLET]], [

            /android.+a000(1)\s+build/i,                                        // OnePlus
            /android.+oneplus\s(a\d{4})\s+build/i
            ], [MODEL, [VENDOR, 'OnePlus'], [TYPE, MOBILE]], [

            /android.+[;\/]\s*(RCT[\d\w]+)\s+build/i                            // RCA Tablets
            ], [MODEL, [VENDOR, 'RCA'], [TYPE, TABLET]], [

            /android.+[;\/\s]+(Venue[\d\s]{2,7})\s+build/i                      // Dell Venue Tablets
            ], [MODEL, [VENDOR, 'Dell'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i                         // Verizon Tablet
            ], [MODEL, [VENDOR, 'Verizon'], [TYPE, TABLET]], [

            /android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i     // Barnes & Noble Tablet
            ], [[VENDOR, 'Barnes & Noble'], MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i                           // Barnes & Noble Tablet
            ], [MODEL, [VENDOR, 'NuVision'], [TYPE, TABLET]], [

            /android.+;\s(k88)\sbuild/i                                         // ZTE K Series Tablet
            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(gen\d{3})\s+build.*49h/i                         // Swiss GEN Mobile
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, MOBILE]], [

            /android.+[;\/]\s*(zur\d{3})\s+build/i                              // Swiss ZUR Tablet
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, TABLET]], [

            /android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i                         // Zeki Tablets
            ], [MODEL, [VENDOR, 'Zeki'], [TYPE, TABLET]], [

            /(android).+[;\/]\s+([YR]\d{2})\s+build/i,
            /android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(\w{5})\sbuild/i        // Dragon Touch Tablet
            ], [[VENDOR, 'Dragon Touch'], MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*(NS-?\w{0,9})\sbuild/i                            // Insignia Tablets
            ], [MODEL, [VENDOR, 'Insignia'], [TYPE, TABLET]], [

            /android.+[;\/]\s*((NX|Next)-?\w{0,9})\s+build/i                    // NextBook Tablets
            ], [MODEL, [VENDOR, 'NextBook'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Xtreme\_)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i
            ], [[VENDOR, 'Voice'], MODEL, [TYPE, MOBILE]], [                    // Voice Xtreme Phones

            /android.+[;\/]\s*(LVTEL\-)?(V1[12])\s+build/i                     // LvTel Phones
            ], [[VENDOR, 'LvTel'], MODEL, [TYPE, MOBILE]], [

            /android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i          // Envizen Tablets
            ], [MODEL, [VENDOR, 'Envizen'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(\w{1,9})\s+build/i          // Le Pan Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i                         // MachSpeed Tablets
            ], [MODEL, [VENDOR, 'MachSpeed'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i                // Trinity Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*TU_(1491)\s+build/i                               // Rotor Tablets
            ], [MODEL, [VENDOR, 'Rotor'], [TYPE, TABLET]], [

            /android.+(KS(.+))\s+build/i                                        // Amazon Kindle Tablets
            ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [

            /android.+(Gigaset)[\s\-]+(Q\w{1,9})\s+build/i                      // Gigaset Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /\s(tablet|tab)[;\/]/i,                                             // Unidentifiable Tablet
            /\s(mobile)(?:[;\/]|\ssafari)/i                                     // Unidentifiable Mobile
            ], [[TYPE, util.lowerize], VENDOR, MODEL], [

            /(android[\w\.\s\-]{0,9});.+build/i                                 // Generic Android Device
            ], [MODEL, [VENDOR, 'Generic']]


        /*//////////////////////////
            // TODO: move to string map
            ////////////////////////////

            /(C6603)/i                                                          // Sony Xperia Z C6603
            ], [[MODEL, 'Xperia Z C6603'], [VENDOR, 'Sony'], [TYPE, MOBILE]], [
            /(C6903)/i                                                          // Sony Xperia Z 1
            ], [[MODEL, 'Xperia Z 1'], [VENDOR, 'Sony'], [TYPE, MOBILE]], [

            /(SM-G900[F|H])/i                                                   // Samsung Galaxy S5
            ], [[MODEL, 'Galaxy S5'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G7102)/i                                                       // Samsung Galaxy Grand 2
            ], [[MODEL, 'Galaxy Grand 2'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G530H)/i                                                       // Samsung Galaxy Grand Prime
            ], [[MODEL, 'Galaxy Grand Prime'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G313HZ)/i                                                      // Samsung Galaxy V
            ], [[MODEL, 'Galaxy V'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-T805)/i                                                        // Samsung Galaxy Tab S 10.5
            ], [[MODEL, 'Galaxy Tab S 10.5'], [VENDOR, 'Samsung'], [TYPE, TABLET]], [
            /(SM-G800F)/i                                                       // Samsung Galaxy S5 Mini
            ], [[MODEL, 'Galaxy S5 Mini'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-T311)/i                                                        // Samsung Galaxy Tab 3 8.0
            ], [[MODEL, 'Galaxy Tab 3 8.0'], [VENDOR, 'Samsung'], [TYPE, TABLET]], [

            /(T3C)/i                                                            // Advan Vandroid T3C
            ], [MODEL, [VENDOR, 'Advan'], [TYPE, TABLET]], [
            /(ADVAN T1J\+)/i                                                    // Advan Vandroid T1J+
            ], [[MODEL, 'Vandroid T1J+'], [VENDOR, 'Advan'], [TYPE, TABLET]], [
            /(ADVAN S4A)/i                                                      // Advan Vandroid S4A
            ], [[MODEL, 'Vandroid S4A'], [VENDOR, 'Advan'], [TYPE, MOBILE]], [

            /(V972M)/i                                                          // ZTE V972M
            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, MOBILE]], [

            /(i-mobile)\s(IQ\s[\d\.]+)/i                                        // i-mobile IQ
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /(IQ6.3)/i                                                          // i-mobile IQ IQ 6.3
            ], [[MODEL, 'IQ 6.3'], [VENDOR, 'i-mobile'], [TYPE, MOBILE]], [
            /(i-mobile)\s(i-style\s[\d\.]+)/i                                   // i-mobile i-STYLE
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /(i-STYLE2.1)/i                                                     // i-mobile i-STYLE 2.1
            ], [[MODEL, 'i-STYLE 2.1'], [VENDOR, 'i-mobile'], [TYPE, MOBILE]], [

            /(mobiistar touch LAI 512)/i                                        // mobiistar touch LAI 512
            ], [[MODEL, 'Touch LAI 512'], [VENDOR, 'mobiistar'], [TYPE, MOBILE]], [

            /////////////
            // END TODO
            ///////////*/

        ],

        engine : [[

            /windows.+\sedge\/([\w\.]+)/i                                       // EdgeHTML
            ], [VERSION, [NAME, 'EdgeHTML']], [

            /(presto)\/([\w\.]+)/i,                                             // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i,     // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m
            /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,                          // KHTML/Tasman/Links
            /(icab)[\/\s]([23]\.[\d\.]+)/i                                      // iCab
            ], [NAME, VERSION], [

            /rv\:([\w\.]{1,9}).+(gecko)/i                                       // Gecko
            ], [VERSION, NAME]
        ],

        os : [[

            // Windows based
            /microsoft\s(windows)\s(vista|xp)/i                                 // Windows (iTunes)
            ], [NAME, VERSION], [
            /(windows)\snt\s6\.2;\s(arm)/i,                                     // Windows RT
            /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i,                   // Windows Phone
            /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i
            ], [NAME, [VERSION, mapper.str, maps.os.windows.version]], [
            /(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i
            ], [[NAME, 'Windows'], [VERSION, mapper.str, maps.os.windows.version]], [

            // Mobile/Embedded OS
            /\((bb)(10);/i                                                      // BlackBerry 10
            ], [[NAME, 'BlackBerry'], VERSION], [
            /(blackberry)\w*\/?([\w\.]*)/i,                                     // Blackberry
            /(tizen)[\/\s]([\w\.]+)/i,                                          // Tizen
            /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]*)/i,
                                                                                // Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki
            /linux;.+(sailfish);/i                                              // Sailfish OS
            ], [NAME, VERSION], [
            /(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]*)/i                  // Symbian
            ], [[NAME, 'Symbian'], VERSION], [
            /\((series40);/i                                                    // Series 40
            ], [NAME], [
            /mozilla.+\(mobile;.+gecko.+firefox/i                               // Firefox OS
            ], [[NAME, 'Firefox OS'], VERSION], [

            // Console
            /(nintendo|playstation)\s([wids34portablevu]+)/i,                   // Nintendo/Playstation

            // GNU/Linux based
            /(mint)[\/\s\(]?(\w*)/i,                                            // Mint
            /(mageia|vectorlinux)[;\s]/i,                                       // Mageia/VectorLinux
            /(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]*)/i,
                                                                                // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
                                                                                // Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
            /(hurd|linux)\s?([\w\.]*)/i,                                        // Hurd/Linux
            /(gnu)\s?([\w\.]*)/i                                                // GNU
            ], [NAME, VERSION], [

            /(cros)\s[\w]+\s([\w\.]+\w)/i                                       // Chromium OS
            ], [[NAME, 'Chromium OS'], VERSION],[

            // Solaris
            /(sunos)\s?([\w\.\d]*)/i                                            // Solaris
            ], [[NAME, 'Solaris'], VERSION], [

            // BSD based
            /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]*)/i                    // FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
            ], [NAME, VERSION],[

            /(haiku)\s(\w+)/i                                                   // Haiku
            ], [NAME, VERSION],[

            /cfnetwork\/.+darwin/i,
            /ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i             // iOS
            ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [

            /(mac\sos\sx)\s?([\w\s\.]*)/i,
            /(macintosh|mac(?=_powerpc)\s)/i                                    // Mac OS
            ], [[NAME, 'Mac OS'], [VERSION, /_/g, '.']], [

            // Other
            /((?:open)?solaris)[\/\s-]?([\w\.]*)/i,                             // Solaris
            /(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i,                                // AIX
            /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,
                                                                                // Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS
            /(unix)\s?([\w\.]*)/i                                               // UNIX
            ], [NAME, VERSION]
        ]
    };


    /////////////////
    // Constructor
    ////////////////
    /*
    var Browser = function (name, version) {
        this[NAME] = name;
        this[VERSION] = version;
    };
    var CPU = function (arch) {
        this[ARCHITECTURE] = arch;
    };
    var Device = function (vendor, model, type) {
        this[VENDOR] = vendor;
        this[MODEL] = model;
        this[TYPE] = type;
    };
    var Engine = Browser;
    var OS = Browser;
    */
    var UAParser = function (uastring, extensions) {

        if (typeof uastring === 'object') {
            extensions = uastring;
            uastring = undefined;
        }

        if (!(this instanceof UAParser)) {
            return new UAParser(uastring, extensions).getResult();
        }

        var ua = uastring || ((window && window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : EMPTY);
        var rgxmap = extensions ? util.extend(regexes, extensions) : regexes;
        //var browser = new Browser();
        //var cpu = new CPU();
        //var device = new Device();
        //var engine = new Engine();
        //var os = new OS();

        this.getBrowser = function () {
            var browser = { name: undefined, version: undefined };
            mapper.rgx.call(browser, ua, rgxmap.browser);
            browser.major = util.major(browser.version); // deprecated
            return browser;
        };
        this.getCPU = function () {
            var cpu = { architecture: undefined };
            mapper.rgx.call(cpu, ua, rgxmap.cpu);
            return cpu;
        };
        this.getDevice = function () {
            var device = { vendor: undefined, model: undefined, type: undefined };
            mapper.rgx.call(device, ua, rgxmap.device);
            return device;
        };
        this.getEngine = function () {
            var engine = { name: undefined, version: undefined };
            mapper.rgx.call(engine, ua, rgxmap.engine);
            return engine;
        };
        this.getOS = function () {
            var os = { name: undefined, version: undefined };
            mapper.rgx.call(os, ua, rgxmap.os);
            return os;
        };
        this.getResult = function () {
            return {
                ua      : this.getUA(),
                browser : this.getBrowser(),
                engine  : this.getEngine(),
                os      : this.getOS(),
                device  : this.getDevice(),
                cpu     : this.getCPU()
            };
        };
        this.getUA = function () {
            return ua;
        };
        this.setUA = function (uastring) {
            ua = uastring;
            //browser = new Browser();
            //cpu = new CPU();
            //device = new Device();
            //engine = new Engine();
            //os = new OS();
            return this;
        };
        return this;
    };

    UAParser.VERSION = LIBVERSION;
    UAParser.BROWSER = {
        NAME    : NAME,
        MAJOR   : MAJOR, // deprecated
        VERSION : VERSION
    };
    UAParser.CPU = {
        ARCHITECTURE : ARCHITECTURE
    };
    UAParser.DEVICE = {
        MODEL   : MODEL,
        VENDOR  : VENDOR,
        TYPE    : TYPE,
        CONSOLE : CONSOLE,
        MOBILE  : MOBILE,
        SMARTTV : SMARTTV,
        TABLET  : TABLET,
        WEARABLE: WEARABLE,
        EMBEDDED: EMBEDDED
    };
    UAParser.ENGINE = {
        NAME    : NAME,
        VERSION : VERSION
    };
    UAParser.OS = {
        NAME    : NAME,
        VERSION : VERSION
    };
    //UAParser.Utils = util;

    ///////////
    // Export
    //////////


    // check js environment
    if (typeof(exports) !== UNDEF_TYPE) {
        // nodejs env
        if (typeof module !== UNDEF_TYPE && module.exports) {
            exports = module.exports = UAParser;
        }
        // TODO: test!!!!!!!!
        /*
        if (require && require.main === module && process) {
            // cli
            var jsonize = function (arr) {
                var res = [];
                for (var i in arr) {
                    res.push(new UAParser(arr[i]).getResult());
                }
                process.stdout.write(JSON.stringify(res, null, 2) + '\n');
            };
            if (process.stdin.isTTY) {
                // via args
                jsonize(process.argv.slice(2));
            } else {
                // via pipe
                var str = '';
                process.stdin.on('readable', function() {
                    var read = process.stdin.read();
                    if (read !== null) {
                        str += read;
                    }
                });
                process.stdin.on('end', function () {
                    jsonize(str.replace(/\n$/, '').split('\n'));
                });
            }
        }
        */
        exports.UAParser = UAParser;
    } else {
        // requirejs env (optional)
        if (typeof(define) === FUNC_TYPE && define.amd) {
            define(function () {
                return UAParser;
            });
        } else if (window) {
            // browser env
            window.UAParser = UAParser;
        }
    }

    // jQuery/Zepto specific (optional)
    // Note:
    //   In AMD env the global scope should be kept clean, but jQuery is an exception.
    //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
    //   and we should catch that.
    var $ = window && (window.jQuery || window.Zepto);
    if (typeof $ !== UNDEF_TYPE) {
        var parser = new UAParser();
        $.ua = parser.getResult();
        $.ua.get = function () {
            return parser.getUA();
        };
        $.ua.set = function (uastring) {
            parser.setUA(uastring);
            var result = parser.getResult();
            for (var prop in result) {
                $.ua[prop] = result[prop];
            }
        };
    }

})(typeof window === 'object' ? window : this);

},{}],2:[function(require,module,exports){
"use strict";var __awaiter=this&&this.__awaiter||function(n,a,e,t){return new(e||(e=Promise))(function(r,o){function c(n){try{u(t.next(n))}catch(n){o(n)}}function i(n){try{u(t.throw(n))}catch(n){o(n)}}function u(n){n.done?r(n.value):new e(function(a){a(n.value)}).then(c,i)}u((t=t.apply(n,a||[])).next())})};function macarena(n,a,e=5400){return __awaiter(this,void 0,void 0,function*(){const n=["Macarena\n    o\n   .|.\n    /\\","acarena \n    o\n   \\|.\n    >\\\n","carena M\n    o\n   \\|/\n   /<\n","arena Ma\n    o\n    //\n    >\\\n","rena Mac\n    o\n    X\n   /<\n","ena Maca\n   <o\n    \\\n    >\\\n","na Macar\n   <o>\n    |\n   /<\n","a Macare\n    o>\n   <|\n    >\\\n"," Macaren\n    o\n   <|>\n   /<\n"];let t=0;const r=setInterval(()=>{a.clear(),a.printLn(n[t]),++t>=n.length&&(t=0)},200);yield new Promise(n=>setTimeout(n,e)),clearInterval(r)})}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=macarena;

},{}],3:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class CatCommand{constructor(t){this.fileSystem=t}showHelp(t){t.printLn("cat <file> - show contents of the <file>")}execute(t,e){const s=t[0]||null;if(null===s)e.printLn("file: missing operand");else if(this.fileSystem.exists(s)){const t=this.fileSystem.getFile(s);t.isDir?e.printLn(`cat: ${s}: Is a directory`):e.printLn(t.getContents().toString())}else e.printLn(`cat: ${s}: No such file or directory`)}}exports.default=CatCommand;

},{}],4:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class CdCommand{constructor(e){this.fileSystem=e}showHelp(e){e.printLn("cd <dir> - changes current working directory to <dir>"),e.printLn("cd       - changes current directory to /")}execute(e,t){if(0===e.length)this.fileSystem.setCwd("/");else if(this.fileSystem.exists(e[0])){this.fileSystem.getFile(e[0]).isDir?this.fileSystem.setCwd(e[0]):t.printLn(`cd: ${e[0]}: Not a directory`)}else t.printLn(`cd: ${e[0]}: No such file or directory`)}}exports.default=CdCommand;

},{}],5:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class ClearCommand{showHelp(e){e.printLn("clear - clears the screen")}execute(e,r){r.clear()}}exports.default=ClearCommand;

},{}],6:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class FileCommand{constructor(e){this.fileSystem=e}showHelp(e){e.printLn("file <path> - show file type")}execute(e,t){const i=e[0]||null;if(null===i)t.printLn("file: missing operand");else if(this.fileSystem.exists(i)){const e=this.fileSystem.getFile(i);e.isDir?t.printLn(`${i}: directory`):e.isExecutable?t.printLn(`${i}: ECMAScript executable`):t.printLn(`${i}: text file`)}else t.printLn(`${i}: cannot open \`${i}' (No such file or directory)`)}}exports.default=FileCommand;

},{}],7:[function(require,module,exports){
"use strict";var __awaiter=this&&this.__awaiter||function(t,n,e,o){return new(e||(e=Promise))(function(r,i){function s(t){try{u(o.next(t))}catch(t){i(t)}}function a(t){try{u(o.throw(t))}catch(t){i(t)}}function u(t){t.done?r(t.value):new e(function(n){n(t.value)}).then(s,a)}u((o=o.apply(t,n||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});class FortuneCommand{constructor(){this.apiEndpoint="https://helloacm.com/api/fortune/"}showHelp(t){t.printLn("fortune - show random, possibly even funny, quote")}execute(t,n){return __awaiter(this,void 0,void 0,function*(){try{const t=yield fetch(this.apiEndpoint);if(200!==t.status)throw new Error(t.statusText);n.printLn(yield t.json())}catch(t){n.printLn(`Error fetching the cookie for you: ${t.message}`)}})}}exports.default=FortuneCommand;

},{}],8:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class HelpCommand{constructor(n){this.commands=n}showHelp(n){n.printLn("Built in help"),n.printLn("Usage:"),n.printLn(" help           - shows all commands"),n.printLn(" help <command> - shows help for command")}execute(n,e){n.length>0?this.showCommandHelp(n[0],e):this.showSelfHelp(e)}showCommandHelp(n,e){const o=this.commands[n]||null;o?o.showHelp(e):e.printLn(`Unknown command: ${n}`)}showSelfHelp(n){n.printLn(""),n.print("Commands: ");for(const e of Object.keys(this.commands))n.print(e+" ");n.printLn("Type help <command name> for details")}}exports.default=HelpCommand;

},{}],9:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class LsCommand{constructor(e){this.fileSystem=e}showHelp(e){e.printLn("ls - list contents of current directory")}execute(e,t){const s=e[0]||this.fileSystem.getCwd();if(!this.fileSystem.exists(s))return void t.printLn(`ls: cannot access '${s}': No such file or directory`);const i=this.fileSystem.getFile(s);if(i.isDir){const e=i.getContents();for(const s of Object.keys(e))this.printFileName(e[s],t)}else this.printFileName(i,t)}printFileName(e,t){t.printLn(e.name,this.getFileClassName(e))}getFileClassName(e){return e.isDir?"file-dir":e.isExecutable?"file-executable":""}}exports.default=LsCommand;

},{}],10:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class PsCommand{constructor(t,e,s){this.uaParser=t,this.uptime=e,this.location=s}showHelp(t){t.printLn("ps - show process information")}execute(t,e){const s=this.uptime.getUptimeAsString(),r=`${this.uaParser.getBrowser().name} ${this.location.getHref()}`;e.printLn("PID     TIME CMD"),e.printLn(`  1 ${s} ${r}`)}}exports.default=PsCommand;

},{}],11:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class PwdCommand{constructor(e){this.fileSystem=e}showHelp(e){e.printLn("pwd - show current working directory")}execute(e,t){t.printLn(this.fileSystem.getCwd())}}exports.default=PwdCommand;

},{}],12:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class RmCommand{constructor(e){this.fileSystem=e}showHelp(e){e.printLn("rm <file>        - remove <file>"),e.printLn("rm -r <dir|file> - remove directories recursively")}execute(e,i){const r=e.shift(),t="-r"===r,s=t?e.shift():r;if(void 0===s)i.printLn("rm: missing operand");else if(this.fileSystem.exists(s)){!this.fileSystem.getFile(s).isDir||t?this.fileSystem.remove(s):i.printLn(`rm: cannot remove '${s}': Is a directory`)}else i.printLn(`rm: cannot remove '${s}': No such file or directory`)}}exports.default=RmCommand;

},{}],13:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class RmdirCommand{constructor(e){this.fileSystem=e}showHelp(e){e.printLn("rmdir <dir> - remove empty directory <dir>")}execute(e,i){const r=e.shift();if(void 0===r)i.printLn("rmdir: missing operand");else if(this.fileSystem.exists(r)){const e=this.fileSystem.getFile(r);e.isDir?e.isEmpty()?this.fileSystem.remove(r):i.printLn(`rmdir: failed to remove '${r}': Directory not empty`):i.printLn(`rmdir: failed to remove '${r}': Not a directory`)}else i.printLn(`rmdir: failed to remove '${r}': No such file or directory`)}}exports.default=RmdirCommand;

},{}],14:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class UnameCommand{constructor(e){this.uaParser=e}showHelp(e){e.printLn("uname    - shows information about the system"),e.printLn("uname -a - shows detailed information about the system")}execute(e,s){"-a"===e[0]?this.showDetails(s):this.showBasic(s)}showDetails(e){const s=this.uaParser.getOS().name+" "+this.uaParser.getOS().version,t=this.uaParser.getCPU().architecture,a=this.uaParser.getBrowser().name+" "+this.uaParser.getBrowser().version;e.printLn(`${s} ${a} ${t}`)}showBasic(e){e.printLn(this.uaParser.getOS().name)}}exports.default=UnameCommand;

},{}],15:[function(require,module,exports){
"use strict";var __awaiter=this&&this.__awaiter||function(e,t,i,s){return new(i||(i=Promise))(function(r,n){function l(e){try{o(s.next(e))}catch(e){n(e)}}function a(e){try{o(s.throw(e))}catch(e){n(e)}}function o(e){e.done?r(e.value):new i(function(t){t(e.value)}).then(l,a)}o((s=s.apply(e,t||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const TextFileNode_1=require("../File/TextFileNode");class WgetCommand{constructor(e){this.fileSystem=e}showHelp(e){e.printLn("wget <url>       - retrieve and print url contents"),e.printLn("wget <url> <file - retrieve url contents and save it to file"),e.printLn("Note that cross origin request restrictions apply.")}execute(e,t){return __awaiter(this,void 0,void 0,function*(){const i=this.validateArgs(e);if(i.valid)try{const e=yield fetch(i.url);if(200!==e.status)throw new Error(e.statusText);const s=yield e.text();i.saveToFile?this.saveTextFile(i.dir,i.name,s):t.printLn(s)}catch(e){t.printLn(`wget: ${e.message}`)}else t.printLn(`wget: ${i.errorMessage}`)})}saveTextFile(e,t,i){const s=new TextFileNode_1.default(t,i);this.fileSystem.add(e,s)}validateArgs(e){const t=e[0]||null,i=e[1]||null,s={saveToFile:!1,url:t,valid:!1};if(null===t)s.errorMessage="missing url";else if(null!==i&&this.fileSystem.exists(i))s.errorMessage=`${i} already exists`;else if(null!==i){const e=i.split(this.fileSystem.directorySeparator),t=e.pop(),r=e.join(this.fileSystem.directorySeparator);if(this.fileSystem.exists(r)){this.fileSystem.getFile(r).isDir?(s.valid=!0,s.saveToFile=!0,s.dir=r,s.name=t):s.errorMessage=`${r}: is not a directory`}else s.errorMessage=`${i}: invalid path`}else s.valid=!0;return s}}exports.default=WgetCommand;

},{"../File/TextFileNode":20}],16:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class WhoamiCommand{showHelp(e){e.printLn("whoami - print the user name")}execute(e,o){o.printLn("How should I know?")}}exports.default=WhoamiCommand;

},{}],17:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const DirNode_1=require("../File/DirNode"),ExecutableFileNode_1=require("../File/ExecutableFileNode"),TextFileNode_1=require("../File/TextFileNode");class InMemoryFileSystem{constructor(e={}){this.directorySeparator="/",this.directories=e,this.currentWorkingDirectory=[]}getCwd(){return this.directorySeparator+this.currentWorkingDirectory.join(this.directorySeparator)}setCwd(e){const t=this.getCanonicalPath(e);if(!this.canonicalPathExists(t))throw Error(`${e} does not exist`);if(!this.getFileByCanonicalPath(t).isDir)throw Error(`${e} is not a directory`);this.currentWorkingDirectory=t}exists(e){const t=this.getCanonicalPath(e);return this.canonicalPathExists(t)}getFile(e){const t=this.getCanonicalPath(e);return this.getFileByCanonicalPath(t)}remove(e){const t=this.getCanonicalPath(e);if(!this.canonicalPathExists(t))throw new Error(`${e} does not exist`);{let e=this.directories,r=null;for(let i=0;i<t.length;i++)r=t[i],i<t.length-1&&(e=e[r]);delete e[r]}}add(e,t){const r=this.getCanonicalPath(e);if(!this.getFileByCanonicalPath(r).isDir)throw new Error(`${e} is not a directory`);if(this.canonicalPathExists([...r,t.name]))throw new Error(`${t.name} already exists under ${e}`);let i=this.directories;for(const e of r)i=i[e];i[t.name]=t.getContents()}canonicalPathExists(e){let t=this.directories;for(const r of e)if(null===(t=t[r]||null))return!1;return!0}getFileByCanonicalPath(e){if(!this.canonicalPathExists(e))throw new Error("file does not exist");let t=this.directories,r=null;for(let i=0;i<e.length;i++)r=e[i],i<e.length-1&&(t=t[r]);return this.getFileNodeFromFileSystem(r,t[r])}getFileNodeFromFileSystem(e,t){switch(null===e&&(e=this.directorySeparator,t=this.directories),typeof t){case"object":return new DirNode_1.default(e,this.getDirectoryChildren(t));case"function":return new ExecutableFileNode_1.default(e,t);case"string":return new TextFileNode_1.default(e,t)}throw new Error(`Unsupported object type '${typeof t}' for '${e}' entry in filesystem`)}getDirectoryChildren(e){const t={};for(const r of Object.keys(e))t[r]=this.getFileNodeFromFileSystem(r,e[r]);return t}getCanonicalPath(e){null===e&&(e=this.getCwd());let t=[];e[0]!==this.directorySeparator&&(t=[...this.currentWorkingDirectory]);const r=e.split(this.directorySeparator);for(const e of r)switch(e){case"":case".":continue;case"..":t.pop();break;default:t.push(e)}return t}}exports.default=InMemoryFileSystem;

},{"../File/DirNode":18,"../File/ExecutableFileNode":19,"../File/TextFileNode":20}],18:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class DirNode{constructor(e,t){this.isDir=!0,this.isFile=!1,this.isExecutable=!1,this.name=e,this.children=t}execute(){throw new Error("Not executable")}getContents(){return this.children}isEmpty(){return 0===Object.keys(this.children).length}}exports.default=DirNode;

},{}],19:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class ExecutableFileNode{constructor(e,t){this.isDir=!1,this.isFile=!0,this.isExecutable=!0,this.name=e,this.callback=t}execute(){this.callback()}getContents(){return this.callback}}exports.default=ExecutableFileNode;

},{}],20:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class TextFileNode{constructor(e,t){this.isDir=!1,this.isFile=!0,this.isExecutable=!1,this.name=e,this.contents=t}execute(){throw new Error("Not executable")}getContents(){return this.contents}}exports.default=TextFileNode;

},{}],21:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class DocumentLocation{getHref(){return document.location.href}}exports.default=DocumentLocation;

},{}],22:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class CommandLineParser{constructor(e,t){this.commands=e,this.fileSystem=t}handle(e){const t=e.split(/\s+/),s=t.shift(),i=[...t];return this.isBuiltIn(s)?this.commands[s].execute.bind(this.commands[s],i):this.isExecutable(s)?this.fileSystem.getFile(s).getContents().bind(null,i):e=>{e.printLn(`${s}: command not found`)}}isBuiltIn(e){return null!==(this.commands[e]||null)}isExecutable(e){return this.fileSystem.exists(e)&&this.fileSystem.getFile(e).isExecutable}}exports.default=CommandLineParser;

},{}],23:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class PromptWithCwd{constructor(t,e,s){this.prefix=e,this.suffix=s,this.fileSystem=t}getPrompt(){return this.prefix+this.fileSystem.getCwd()+this.suffix}}exports.default=PromptWithCwd;

},{}],24:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class SimpleTerminal{constructor(t,i,n){this.errorCount=0,this.maxErrorCount=100,this.prompt=t,this.terminal=n,this.commandLineParser=i}print(t,i){this.terminal.print(t,i)}printLn(t,i){this.terminal.printLn(t,i)}input(t){this.terminal.input(this.prompt.getPrompt(),t)}renderTo(t){t.appendChild(this.terminal.container)}start(){this.handleCommandLine(null)}clear(){this.terminal.clear()}handleException(t){if(this.printLn(""),this.printLn(t.message,"error"),this.errorCount++,!(this.errorCount<this.maxErrorCount))throw new Error("Too many errors, aborting");this.handleCommandLine(null)}handleCommandLine(t){try{if(this.printLn(""),"exit"===t)return void this.clear();if(null!==t&&""!==t.trim()){const i=this.commandLineParser.handle(t)(this);void 0===i?this.input(this.handleCommandLine.bind(this)):i.then(()=>{this.input(this.handleCommandLine.bind(this))})}else this.input(this.handleCommandLine.bind(this))}catch(t){this.handleException(t)}}}exports.default=SimpleTerminal;

},{}],25:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class Terminal{constructor(){this.firstPrompt=!0,this.container=document.createElement("div"),this.container.className="Terminal",this.innerWindow=document.createElement("div"),this.output=document.createElement("p"),this.inputLine=document.createElement("span"),this.cursor=document.createElement("span"),this.inputElement=document.createElement("p"),this.inputElement.appendChild(this.inputLine),this.inputElement.appendChild(this.cursor),this.innerWindow.appendChild(this.output),this.innerWindow.appendChild(this.inputElement),this.container.appendChild(this.innerWindow),this.setBackgroundColor("black"),this.setTextColor("white"),this.setTextSize("1em"),this.setWidth("100%"),this.setHeight("100%"),this.container.style.fontFamily="Monaco, Courier",this.container.style.margin="0",this.innerWindow.style.padding="10px",this.inputElement.style.margin="0",this.output.style.margin="0",this.output.style.display="inline",this.cursor.style.background="white",this.cursor.innerHTML="C",this.cursor.style.display="none",this.inputElement.style.display="none"}print(t,e){const i=this.makeNewLine(t,e);i.style.display="inline",this.output.appendChild(i)}printLn(t,e){const i=this.makeNewLine(t,e);this.output.appendChild(i)}input(t,e){const i=document.createElement("input");i.style.position="absolute",i.style.zIndex="-100",i.style.outline="none",i.style.border="none",i.style.opacity="0",i.style.fontSize="0.2em",this.inputLine.textContent="",this.inputElement.style.display="inline-block",this.container.appendChild(i),this.fireCursorInterval(i),t.length&&this.print(t,"prompt"),i.onblur=(()=>{this.cursor.style.display="none"}),i.onfocus=(()=>{i.value=this.inputLine.textContent,this.cursor.style.display="inline"}),this.container.onclick=(()=>{i.focus()}),i.onkeydown=(t=>{37===t.which||39===t.which||38===t.which||40===t.which||9===t.which?t.preventDefault():13!==t.which&&setTimeout(()=>{this.inputLine.textContent=i.value},1)}),i.onkeyup=(t=>{if(13===t.which){this.inputElement.style.display="none";const t=i.value;this.print(t),this.container.removeChild(i),"function"==typeof e&&e(t)}}),this.firstPrompt?(this.firstPrompt=!1,setTimeout(()=>{i.focus()},50)):i.focus()}clear(){this.output.innerHTML=""}setTextSize(t){this.output.style.fontSize=t,this.inputElement.style.fontSize=t}setTextColor(t){this.container.style.color=t,this.cursor.style.background=t}setBackgroundColor(t){this.container.style.background=t}setWidth(t){this.container.style.width=t}setHeight(t){this.container.style.height=t}makeNewLine(t,e){const i=document.createElement("div");return e&&(i.className=e),i.textContent=t,i}fireCursorInterval(t){setInterval(()=>{t.parentElement&&(this.cursor.style.visibility="visible"===this.cursor.style.visibility?"hidden":"visible")},500)}}exports.default=Terminal;

},{}],26:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class Uptime{constructor(t){this.startTime=t}getUptimeInMilliseconds(){return Date.now()-this.startTime}getUptimeAsString(){const t=this.getUptimeInMilliseconds();return this.pad(Math.floor(t/36e5))+":"+this.pad(Math.floor(t%36e5/6e4))+":"+this.pad(Math.floor(t%6e4/1e3))}pad(t){return("00"+t).slice(-2)}}exports.default=Uptime;

},{}],27:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const ua_parser_js_1=require("ua-parser-js"),InMemoryFileSystem_1=require("../FileSystem/InMemoryFileSystem"),DocumentLocation_1=require("../Location/DocumentLocation"),CommandLineParser_1=require("../Parser/CommandLineParser"),PromptWithCwd_1=require("../Prompt/PromptWithCwd"),SimpleTerminal_1=require("../Terminal/SimpleTerminal"),Terminal_1=require("../Terminal/Terminal"),Uptime_1=require("../Uptime/Uptime"),BuiltInCommands_1=require("./BuiltInCommands"),files_1=require("./files"),fileSystem=new InMemoryFileSystem_1.default(files_1.default),prompt=new PromptWithCwd_1.default(fileSystem,"aerolit.pl [","]$ "),uaParser=new ua_parser_js_1.UAParser,uptime=new Uptime_1.default(Date.now()),location=new DocumentLocation_1.default,commands=new BuiltInCommands_1.default(fileSystem,uaParser,uptime,location),commandLineParser=new CommandLineParser_1.default(commands,fileSystem),terminal=new SimpleTerminal_1.default(prompt,commandLineParser,new Terminal_1.default);document.getElementById("main").innerHTML="",terminal.renderTo(document.getElementById("main")),terminal.start();

},{"../FileSystem/InMemoryFileSystem":17,"../Location/DocumentLocation":21,"../Parser/CommandLineParser":22,"../Prompt/PromptWithCwd":23,"../Terminal/SimpleTerminal":24,"../Terminal/Terminal":25,"../Uptime/Uptime":26,"./BuiltInCommands":28,"./files":30,"ua-parser-js":1}],28:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const CatCommand_1=require("../Command/CatCommand"),CdCommand_1=require("../Command/CdCommand"),ClearCommand_1=require("../Command/ClearCommand"),FileCommand_1=require("../Command/FileCommand"),FortuneCommand_1=require("../Command/FortuneCommand"),HelpCommand_1=require("../Command/HelpCommand"),LsCommand_1=require("../Command/LsCommand"),PsCommand_1=require("../Command/PsCommand"),PwdCommand_1=require("../Command/PwdCommand"),RmCommand_1=require("../Command/RmCommand"),RmdirCommand_1=require("../Command/RmdirCommand"),UnameCommand_1=require("../Command/UnameCommand"),WgetCommand_1=require("../Command/WgetCommand"),WhoamiCommand_1=require("../Command/WhoamiCommand");class BuiltInCommands{constructor(m,a,e,d){this.help=new HelpCommand_1.default(this),this.ls=new LsCommand_1.default(m),this.pwd=new PwdCommand_1.default(m),this.cd=new CdCommand_1.default(m),this.cat=new CatCommand_1.default(m),this.file=new FileCommand_1.default(m),this.rm=new RmCommand_1.default(m),this.rmdir=new RmdirCommand_1.default(m),this.clear=new ClearCommand_1.default,this.uname=new UnameCommand_1.default(a),this.ps=new PsCommand_1.default(a,e,d),this.fortune=new FortuneCommand_1.default,this.whoami=new WhoamiCommand_1.default,this.wget=new WgetCommand_1.default(m)}}exports.default=BuiltInCommands;

},{"../Command/CatCommand":3,"../Command/CdCommand":4,"../Command/ClearCommand":5,"../Command/FileCommand":6,"../Command/FortuneCommand":7,"../Command/HelpCommand":8,"../Command/LsCommand":9,"../Command/PsCommand":10,"../Command/PwdCommand":11,"../Command/RmCommand":12,"../Command/RmdirCommand":13,"../Command/UnameCommand":14,"../Command/WgetCommand":15,"../Command/WhoamiCommand":16}],29:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const asciiArt=[];asciiArt["cake.txt"]="\n         (\n         A\n     (  | | (\n     () | | ()\n     || | | ||\n     ||.| |.||\n   / || | | ||\\\n  |  ~~  ~  ~~ |\n  |`-.______.-'| nm\n /|            |\\\n| | 100 Years! | |\n \\ `-.______.-' /\n  `-.________.-'\n\n",asciiArt["candle.txt"]="\n     (\n    ( )\n     |\n    ---\n   |  /|\n  @| //|\n  @|// |\n   |/ /|@\nnm | //|@\n   |// |\n  @|/  |@\n-----------\n",asciiArt["dog.txt"]="\n                                                    ,\n        __                                          \\\\\n     ,@@ \\\\`----------------------------------------- :\n   &      U                                          |\n     `--... | |----------------------------------// /\nBark!     // /                                   \\\\ \\\n        ='=='                                nm  = ==\n\n",asciiArt["octopus.txt"]="\n      .-.\n '   '   `   `\n \\  \"  oo \"  /\n  `--`   '--'nm\n.   ,-' `-.   .\n`__/       \\__'\n",asciiArt["headstone.txt"]="\n         _____\n    ,,''       ``\n   ''             `\n  ||    |          |\n  ||  --|--        |\n  ||    |          |\n  ||    |    RIP   |  nm\n  ||    |  ....... |\n  ||               * -8-\n  ||              ..\\ |/*\n-----------------------\n",asciiArt["kite.txt"]="\n    ~         ~\n     \\______ /\n     /  o   |\n    / , , o |\n   /  \\.   _|\n  /..---''   \\\n \\            ~\n /     __  nm\n|     /  \\\n \\ _ /   >*<\n",asciiArt["penguin.txt"]="\n     _.\n   .' oo\nnm |    >\n  / / : `.\n |_/ /   |\n   |/  ww\n",asciiArt["penguins.txt"]="\n ,-------------------------------.\n| mommy, where's the sea ?        |\n|               ` ._              |\n|        _.      oo `.            |\n| ..   .' oo   <     |  ..  _.    |\n|..... |    > . ' : \\ \\ . .' oo ..|\n|...  / / : `.  .  \\ \\_|  |    > .|\n|... |_/ /   |  |   \\`\\|  / / :`. |\n|....  |/  ww .. ww  .  |_/ /   | |\n| ...................nm.  |/  ww  |\n `-------------------------------'\n",asciiArt["cat.txt"]="\n        |\\___/|\n  nm    | . . |\n        ` =;= '\n  .-.  /   _\n / _ \\/   .  .\n| / \\| -- | ||\n '    --- -  -\n",asciiArt["titanic.txt"]="\n                                      % % %\n                                     %% % %\n              /\\                 % % % % %\n             |  \\___         .'\\ %% %\n             | o \\  \\      .'\\  \\\n             |  o \\ #\\   .'\\  \\.'\n             \\   o \\ #\\.'   \\.'\n             |\\   o \\ #\\   .'\n             \\ \\     \\ #\\.'\n              \\ \\     \\ #\\                nm\n----------------------------------------------\n            -----------------\n              ------------\n                 ------\n                     _______\n       ~~~~         ( ....  )     @@@@\n      ~~,~ ~      ( ........ )   oo @@@\n     ~~:  oo    .o(  ......  )  -  ; @@@\n      ~:c   - .'   (________)    = @@@@\n       /\\  0,`                   /  /\\\n      | |  | \\                  |   | |\n   --------------            ---------------\n      --------                 ----------\n         ---                     -----\n",asciiArt["penguin-on-a-tv-set.txt"]="\n          ._\n         oo `.\n       <     |\n       .' : \\ \\\n       |   \\ \\_|\n  .----- ww -`\\|------.\n .------------------./|\n |   ,--------.  |#|| |\n |  |          | |#|| |\n |  |   IT's   |  o | |\n |  | ........ |  o | |\n |  |          |    | |\n |   `--------'   0 | |\n | XxXxXxXxXxXxX  O |/\n `------------------'\n      `-.--.-.---'~\n       // || \\\\\n      //  ||  \\\\\n     //   ||   \\\\\n    //    ||    \\\\\n   //     ||     \\\\\n  //     ===      \\\\\n //                \\\\\n===            nm  ===\n",exports.default=asciiArt;

},{}],30:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const Macarena_1=require("../Bin/Macarena"),ascii_1=require("./ascii"),openUrl=e=>{location.assign(e)},files={"ascii-art":ascii_1.default,bin:{macarena:Macarena_1.default,src:openUrl.bind(this,"https://github.com/Messere/aerolit-pl-site")},"readme.txt":"Written as an excersise in TypeScript programming.\n\nReleased under MIT.\nTo see/fork source code execute /bin/src",sites:{external:{facebook:openUrl.bind(this,"https://www.facebook.com/darek.sieradzki.1"),github:openUrl.bind(this,"https://github.com/Messere"),linkedin:openUrl.bind(this,"https://www.linkedin.com/in/dsier/"),twitter:openUrl.bind(this,"https://twitter.com/DarekSieradzki")},hosted:{dziwnonoc:openUrl.bind(this,"https://dziwnonoc.aerolit.pl/"),pikantnasztuka:openUrl.bind(this,"https://pikantnasztuka.aerolit.pl/")}},www:{"aerolit.pl":openUrl.bind(this,"https://aerolit.pl/"),messer:openUrl.bind(this,"http://messer.aerolit.pl/"),montypython:openUrl.bind(this,"https://montypython.aerolit.pl/"),niemen:openUrl.bind(this,"https://niemen.aerolit.pl/forum/"),osjan:openUrl.bind(this,"https://osjan.aerolit.pl/")}};exports.default=files;

},{"../Bin/Macarena":2,"./ascii":29}]},{},[27])
//# sourceMappingURL=bundle.js.map
