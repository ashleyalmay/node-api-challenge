const express = require('express');
const router = express.Router();
const actiondb = require('../data/helpers/actionModel')

router.get('/', (req, res) => {
    actiondb.get()
    .then(actions => {
        res.status(200).json({actions: actions})
    })
});

router.get('/:id', validateUserId,(req, res) => {
    actiondb.get(req.params.id)
        .then(action =>{
          if(action.length==0){
              res.status(404).json({message: "The user with the specified ID does not exist." })
           }else{
               res.status(200).json({action:action});
           }
       })
       .catch(error => {
           res.status(500).json({ error: "The posts information could not be retrieved." })
       })
});

router.post('/',validateUserId,validatePost, (req, res) => {
    actiondb.insert(req.body)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(error => {
        res.status(500).json({ error: "There was an error while saving the project to the database"})
        })
  });

  router.put('/:id',validateUserId, validateUser, (req, res) => {
    const update = {
        notes:req.body.notes,
        description: req.body.description
    }
    actiondb.update(req.params.id, update)
    .then(count => {
      res.status(200).json(count)
    })
    .catch(err => {
      res.status(500).json({ message: "error could not update user on server" })
    })
  });

  router.delete('/:id', validateUserId, validateUser, (req, res) => {
    actiondb.remove(req.params.id)
    .then(res.status(200).json({message: 'User was deleted!'}))
  });


// custom middle
function validatePost(req, res, next) {
    if(!req.body){
        res.status(400).json({errorMessage: "error getting body!."})
    } else if(!req.body){
        res.status(400).json({errorMessage: "Please provide text/name for the comment."})
    } else {
      next()
    }
  }
  function validateUser(req, res, next) {
    if (Object.keys(req.body).length === 0) {
      res.status(400).json({message: 'missing post data'})
    } else if (!req.body) {
      res.status(400).json({message: 'missing required name field'}).end()
    } else {
      next()
    }
  }
  async function validateUserId(req, res, next){
    const id = req.param.id
    const user = await actiondb.get(id)
    if (!user){
      res.status(400).json({message:"invalid id"})
    }else{
      req.user=user
    }
    next()
  }


module.exports = router