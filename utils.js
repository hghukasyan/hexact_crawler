/**
 * urlPretty
 *
 * @param  {String} url
 * @return {Object} url
 */
const urlPretty = (url, origin) => {
    const type = typeof url[3] === 'undefined' ? 'link' : 'image'
    let exclude = false
    url =  type === 'link' ? url[5] : url[3]
    for(let e of ['data:image','#','mailto:']) {
        if(url.match(e)) {
            exclude = true
            break
        }
    }
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
        type,
        exclude,
        internal: url.match(origin) && type === 'link' ? 1 : 0
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
    const urls = []
    let type
    for (url of data.matchAll(/(<img(.*?)src="(.*?)"|<a(.*?)href="(.*?)")/g)) {
        url = urlPretty(url, attr[0])
        if(url.exclude === false) {
            urls[url.url] = [url.type, 0, url.internal]
        }
    }

    return urls
}

module.exports = {
    linksExtract
}