var express = require('express');
var router = express.Router();
var connection  = require('../lib/db');
const { check, validationResult } = require('express-validator');

// Get home page
router.get('/', function(req, res, next){
    connection.query('SELECT * FROM food', function(err,rows){
        if(err){
            req.flash('error', err);
            res.render(
                'food',
                {
                    page_title:"Food Menu",
                    data:''
                }
            );
        }else{
            res.render(
                'food',
                {
                    page_title:"Food Menu",
                    data:rows
                }
             );
        }
    });
});

//Show Add User form
router.get('/add', function(req, res, next){
    res.render(
        'food/add',
        {
            page_title: 'Add new food',
            name: '',
            price:''
        }
    );
});

//add user post action
router.post('/add', function(req, res, next){
    //get post(form) fields
   check('name').not().isEmpty();
   check('price').not().isEmpty();

    var errors = validationResult(req);

    if(!errors){
        var food = {
            name: req.sanitize('name').escape().trim(),
            price: req.sanitize('price').escape().trim()
        }
     connection.query('INSERT INTO food', food, function(err, result){
         if(err){
             req.flash('error', err);

             //render views for add
             res.render(
                 'food/add',
                 {
                     title: 'Add new Food',
                     name: food.name,
                     price: food.price
                 }
              );

         }else{
             req.flash('success', 'Food added successully');
             res.redirect('/food');
         }
     })
    }else{
        //display errors to user
        var error_msg = ''
        errors.array().forEach(function(error){
            error_msg += error.msg + '<br>'
            console.log(error_msg);
        })
        req.flash('error', error_msg);

        //render view add
        res.render(
            'food/add',
            {
                title: 'Add new food',
                name: req.body.name,
                price: req.body.email
            }
         );
    }
});

module.exports = router;