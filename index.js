/**
 * Links crawler
 *
 * @param --url
 *   Example: node index.js --url=https://hexowatch.com/
 *
 * @return
 *  Array links and total count (in console)
 */
const cheerio = require('cheerio')
const args = require("yargs").argv
const got = require('got')
const validUrl = require('valid-url')
const url = require('url')

if (!validUrl.isUri(args.url)){
    console.log('Please input url')
    return
}

const arg = new URL(args.url);
const links = []
const debug = true

const crawler = async (url) => {
    try {
        const result = await got(url)
        const $ = cheerio.load(result.body)
        const data = []
        $('a').each((index, element) => {
            data.push($(element).attr('href'))
        })

        if(debug === true) {
            console.log(`Fetching page: ${url}`)
        }

        for(let link of data) {
            link = urlPretty(link)
            if(!links.includes(link)) { // if need can exclude external links match(arg.host)
               links.push(link)
               if(link.match(arg.host) && !link.match('#')) { // check only origin url and exclude anchors
                   await crawler(link)
               }
            }
        }

        return true
    } catch (error) {
        return true
    }
}

const urlPretty = (url) => {
    if(!url.match('//')) {
        if(url.charAt(0) === '/') {
            url = url.slice(1)
        }
        url = `${arg.origin}/${url}`
    }
    if(url.slice(-1) === '/') {
        url = url.slice(0, -1)
    }

    return url
}

(async () => {
    // start crawler
    links.push(urlPretty(arg.origin))
    await crawler(arg.origin)

    // output
    console.log(links)
    console.log(`Total links count: ${links.length}`)
})()
