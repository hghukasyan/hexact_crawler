/**
 * Links crawler
 *
 * @param {String} url
 * @param {String} url
 * Example: node index.js --url=https://hexowatch.com/ --threads=5
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
    links : [],
    debug : true,
    maxThreads: args.threads > 0 ? args.threads : 5,
    threads: 0,
    queue : [],
    timeout: 3000
}

const crawler = (url) => {
    try {
        params.threads++
        delete params.queue[url]
        params.links[url] = ['link', 0, 1]

        if(params.debug === true) {
            console.log(`Fetching page: ${url}`)
        }

        got(url).then(result => {
            const data = linksExtract(result.body, params.arg.origin)
            params.links[url][1] = result.statusCode

            for(let i in data) {
                if (typeof params.links[i] === 'undefined') {
                    if (data[i][2] === 0) {
                        params.links[i] = data[i]
                    } else {
                        if (typeof params.queue[i] === 'undefined') {
                            params.queue[i] = data[i]
                        }
                    }
                }
            }

            params.threads--
        }).catch(error => {
            console.log(error.toString())
            if(error.toString().match('404')) {
                params.links[url][1] = 404
                params.threads--
            }
        })

        return true
    } catch (error) {
        return error
    }
}

// start crawler
crawler(params.arg.origin)

// queue
let i
const queue = setInterval(function() {
    i = 0
    for(let url in params.queue) {
        i++
        crawler(url)
        if(i > params.maxThreads - params.threads + 1) {
            break
        }
    }

    // finish crawler
    if(params.queue.length === 0 && params.threads === 0) {
        if(params.debug === true) {
        //    console.log(params.links)
        }
        console.log(`Total links count: ${Object.keys(params.links).length}`)
        clearInterval(queue)
    }
}, params.timeout);
