/**
 * urlPretty
 *
 * @param  {String} url
 * @return {Object} url
 */
const urlPretty = (url, origin) => {
    const type = url.substr(0, 4) === 'href' ? 'link' : 'image'
    url = url.slice(0, -1)
    url = url.slice(type === 'link' ? 6 : 5)

    if(!url.match('//')) {
        if(url.charAt(0) === '/') {
            url = url.slice(1)
        }
        url = `${origin}/${url}`
    }
    if(url.slice(-1) === '/') {
        url = url.slice(0, -1)
    }

    return {
        url,
        status: 0,
        type
    }
}

/**
 * linksExtract
 *
 * @param {String} data
 * @param {Array} attributes
 * @return {Array} urls
 */
const linksExtract = (data, ...attr) => {
    const urls = new Set()
    for (url of data.matchAll(/(src="(.*?)"|href="(.*?)")/g)) {
        urls.add(urlPretty(url[1], attr[0]))
    }

    return urls
}

module.exports = {
    linksExtract
}