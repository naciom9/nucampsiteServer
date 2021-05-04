const express = require('express'); 
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');
const { populate } = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Favorite.find({user: req.user._id})
    .populate('favorite.user')
    .populate('favorite.campsites')
    .then(favorites => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(favorites)
    })
    .catch(err => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then(favorite => {
        if (favorite) {
          for(let i = 0; i < req.body.length; i++) {
            if(!favorite.campsites.includes(req.body[i])) {
              favorite.campsites.push(req.body[i])
            }
          }
          favorite.save()
          .then(fav => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(fav)
          })
        } else {
          Favorite.create({ user: req.user._id })
            .then(favorite => {
              for(let i = 0; i < req.body.length; i++) {
                      if(!favorite.campsites.includes(req.body[i])) {
                        favorite.campsites.push(req.body[i])
                      }
                    }
              favorite.save().then(fav => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(fav)
              })
            })
            .catch(err => next(err))
        }
    })
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /favorites')  
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({user: req.user._id})
    .then(favorite => {
        console.log('found user', req.user._id)
        if (favorite) {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(favorite)
        } else {
            res.setHeader('Content-Type', 'text/plain')
            res.end('You do not have any favorite to delete')
        }
    })
    .catch(err => next(err))
})



favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    res.statusCode = 403
    res.end('GET operation not supported on /favorites/:campsiteId')
})
.post(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if (favorite) {
            if(!favorite.campsites.includes(req.params.campsiteId)) {
                favorite.campsites.push(req.params.campsiteId)
                favorite.save()
                .then(fav => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(fav)
                })
            } else {
                res.statusCode = 200
                res.setHeader('Content-Type', 'text/plain')
                res.end("That campsite is already in the list of favorites!")
            }
        } else {
            Favorite.create({user: req.user._id})
            .then(favorite => {
                if (!favorite.campsites.includes(req.params.campsiteId)) {
                    favorite.campsites.push(req.params.campsiteId)
                }
                favorite.save()
                .then(fav => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.json(fav)
                })
            })
            .catch(err => next(err))
        }
    })
})
.put(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /favorites/:campsiteId')
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if (favorite) {
            const index = favorite.campsites.indexOf(req.params.campsiteId)
            if (index >= 0) {
                favorite.campsites.splice(index, 1)
            }
            favorite.save()
            .then(fav => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(fav)
            })
        } else {
            res.statusCode
            res.setHeader('Content-Type', 'text/plain')
            res.end('You do not have any favorite to delete')
        }
    })
})

module.exports = favoriteRouter;