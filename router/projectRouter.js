const express = require('express');
const router = express.Router();
const projectdb = require('../data/helpers/projectModel')

   router.get('/', (req, res) => {
    projectdb.get()
  .then(projects =>{
      res.status(200).json({projects: projects})
  })
  .catch(error => {
      res.status(500).json({ error: "The posts information could not be retrieved."  })
  });
})

   router.get('/:id', validateUserId,(req, res) => {
    projectdb.get(req.params.id)
        .then(projects =>{
          if(projects.length==0){
              res.status(404).json({message: "The user with the specified ID does not exist." })
           }else{
               res.status(200).json({projects:projects});
           }
       })
       .catch(error => {
           res.status(500).json({ error: "The posts information could not be retrieved." })
       })
  });

  router.get("/:id/actions",validateUserId, (req, res) => {
    projectdb.getProjectActions(req.params.id)
      .then(actions => {
        if (actions) {
          res.status(200).json(actions);
        } else {
          res.status(404).json({ message: "No actions found" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Error retrieving actions" });
      });
  });


  router.post('/',validateUserId,validatePost, (req, res) => {
    projectdb.insert(req.body)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(error => {
        res.status(500).json({ error: "There was an error while saving the project to the database"})
        })
  });

  router.put('/:id',validateUserId, validateUser, (req, res) => {
    const update = {
        name:req.body.name,
        description: req.body.description
    }
    projectdb.update(req.params.id, update)
    .then(count => {
      res.status(200).json(count)
    })
    .catch(err => {
      res.status(500).json({ message: "error could not update user on server" })
    })
  });


  router.delete('/:id', validateUserId, validateUser, (req, res) => {
    projectdb.remove(req.params.id)
    .then(res.status(200).json({message: 'User was deleted!'}))
  });


// custom middleware
  async function validateUserId(req, res, next){
    const id = req.param.id
    const user = await projectdb.get(id)
    if (!user){
      res.status(400).json({message:"invalid id"})
    }else{
      req.user=user
    }
    next()
  }
  
  function validateUser(req, res, next) {
    if (Object.keys(req.body).length === 0) {
      res.status(400).json({message: 'missing post data'})
    } else if (!req.body.name) {
      res.status(400).json({message: 'missing required name field'}).end()
    } else {
      next()
    }
  }
  
  function validatePost(req, res, next) {
    if(!req.body){
        res.status(400).json({errorMessage: "error getting body!."})
    } else if(!req.body.text){
        res.status(400).json({errorMessage: "Please provide text/name for the comment."})
    } else {
      next()
    }
  }

module.exports = router