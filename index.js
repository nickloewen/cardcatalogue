const express = require('express')
const fs = require('fs')
const jsonata = require('jsonata')
const uniq = require('array-uniq')

const app = express()

require('dotenv').config();

app.set('view engine', 'pug')
app.use(express.static('.'))

function sortArray (array, key, reverse) {
  return array.sort(function (a, b) {
    reverse = (typeof reverse !== 'undefined') ? reverse : false

    var valueA = a[key].toUpperCase() // ignore upper and lowercase
    var valueB = b[key].toUpperCase() // ignore upper and lowercase

    if (reverse) {
      if (valueA > valueB) { return -1 }
      if (valueA < valueB) { return 1 }
    } else {
      if (valueA < valueB) { return -1 }
      if (valueA > valueB) { return 1 }
    }

    // values must be equal
    return 0
  })
}

app.get('/', function (req, res) {
  fs.readFile('database.json', 'utf8', function readDB (err, data) {
    if (err) throw err
    var jsonData = JSON.parse(data)

    // check what paramaters the user has specified
    var sort = req.query.sort || 'titleAZ'
    var contributor = req.query.contributor || 'Anyone'

    // get list of contributors
    var contributorsQuery = jsonata('contributor')
    var contributors = contributorsQuery.evaluate(jsonData)
    if (!Array.isArray(contributors)) {
        contributors = [contributors]
    }
    var contributors = uniq(contributors)

console.log(contributors)

    // show only data for the requested contributor

    if (contributor !== 'Anyone') {
      var sortByContributorQuery = jsonata("$[contributor='" + contributor + "']")
      jsonData = sortByContributorQuery.evaluate(jsonData)
    }

	  console.log(jsonData)

    // sort the data

    if (Array.isArray(jsonData)) { // in case there's only one item
      if (sort === 'titleAZ') {
        jsonData = sortArray(jsonData, 'title')
      } else if (sort === 'titleZA') {
        jsonData = sortArray(jsonData, 'title', true)
      } else if (sort === 'authorAZ') {
        jsonData = sortArray(jsonData, 'author')
      } else if (sort === 'authorZA') {
        jsonData = sortArray(jsonData, 'author', true)
      }
    } else {
      jsonData = [jsonData]
    }

	  console.log(jsonData)

    res.render('index', {books: jsonData, contributors: contributors, sortFilter: sort, contributorFilter: contributor})
  })
})

function errorHandler(err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
}

app.use(errorHandler)

app.listen(3000, function () {
  console.log('Listening on port 3000')
})
