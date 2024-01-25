const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const app = express()

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap'

let infoRap = []

app.get('/', (req, res) => {
    axios.get(url).then((response) => {
        if(response.status === 200) {
            const html = response.data
            const $ = cheerio.load(html)
            const links = []
            $('#mw-pages a').each((index, element) => {
                const link = $(element).attr('href')
                links.push(link)
            })
            return links
        }
    }).then((links) => {
        test(links)
    })
})

const test = async function (links) {
    for (let link of links) {
        const artist = await axios.get("https://es.wikipedia.org/" + link).then((response2) => {
            const html2 = response2.data
            const $ = cheerio.load(html2)
            let title = $('h1').text()
            let images = []
            $('img').each((index, element) => {
                const imgSrc = $(element).attr('src')
                images.push(imgSrc)
            })
            let texts = []
            $('p').each((index, element) => {
                const text = $(element).text()
                texts.push(text)
            })
            infoRap.push({title: title, images: images, texts: texts})
        })
    }
    console.log(infoRap)
}

app.listen(3000, () => {
    console.log('Express está escuchando en el puerto http://localhost:3000')
})