/**
 * Links crawler
 *
 * @param --url
 *   Example: node index.js --url=https://hexowatch.com/
 *
 * @return
 *  Array links and total count (in console)
 */
const args = require("yargs").argv
const got = require('got')
const validUrl = require('valid-url')
const url = require('url')
const { linksExtract } = require('./utils')

if (!validUrl.isUri(args.url)){
    console.log('Please input url')
    return
}

const params = {
    arg : new URL(args.url),
    links : new Set,
    debug : true,
    maxThreads: 5,
    threads: 0,
    queue : new Set,
    timeout: 1000
}

const crawler = async (url) => {
    try {
        const result = await got(url)
        const data = linksExtract(result.body, params.arg.origin)

        if(params.debug === true) {
            console.log(`Fetching page: ${url}`)
        }

        console.log(data)

        return true
    } catch (error) {
        return true
    }
}

(async () => {
    // start crawler
    await crawler(params.arg.origin)

    // output
    console.log(params.links)
    console.log(`Total links count: ${params.links.length}`)
})()

// queue
const queue = setInterval(function() {
    console.log(params.queue)
}, params.timeout);