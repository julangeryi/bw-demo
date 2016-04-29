function loadJs(url, pos, async) {
    document.write(['<script src="', url, '" type="text/javascript">', '</script>'].join(""));
}

function getUrlParam(key)
{
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + key + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if(results == null)
        return null;
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}


/*
 * Loads Localization files for Cloud Control Center.
 * The first priority is URL query string (for example locale=en-US),
 * if Url query string is not specified, checks whether locale is stored in localStorage.
 * After loading the expected locale file, we finally store the locale 
 * preference to localStorage so that next time it comes back OCC will display in his language.
 */
(function () {
    const SUPPORTED_LOCALE = [ "en-US", "zh-CN", "jp-JP", "pt-BR" ];
    const DEFAULT_LOCALE = "en-US";

    var loadLangFile = function (locale) {
        // console.log("Loading locale file: " + locale); 

        // Resets the "localization" variable in case it is already contains L10N resources.
        // This typically happens when user manually change the locale setting.
        if(typeof(localization) != "undefined")
            localization = null; 
        loadJs(["js/resources/", locale, ".js"].join(""));
    },
    storeLocalePref = function (locale) {
        if(window.localStorage)
            window.localStorage.locale = locale;
    };

    window.c3L10NManager = {
        init: function () {
            var locale = getUrlParam("locale") || window.localStorage.locale; 
            if(locale) {
                if($.inArray(locale, SUPPORTED_LOCALE) == -1)
                    locale = DEFAULT_LOCALE; 
            }
            else
                locale = DEFAULT_LOCALE; 
            
            loadLangFile(locale);
            storeLocalePref(locale);
        },
        changeLocale: function (locale) {
            location.href = location.protocol + "//" + location.host + (location.port === "" ? "" : (":" + location.port)) + location.pathname + "?locale=" + locale;
        }
    };

    c3L10NManager.init();
})(window);
