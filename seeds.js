let mongoose = require('mongoose'),
	Campground = require('./models/campgrounds'),
    User = require('../models/users'),
	Comment = require('./models/comments');


let commentsData = 
	{
		text: 'great place to go and camp in',
		author: 'Booyaa'
	}


function seedDB(){
   //Remove all campgrounds
   Campground.deleteMany({}, (err)=>{
    User.deleteMany({}, (err)=>{});
        // if(err){
        //     console.log(err);
        // }
        // console.log("removed campgrounds!");
        Comment.deleteMany({}, (err)=> {})
        //     if(err){
        //         console.log(err);
        //     }
        //     console.log("removed comments!");
        //      //add a few campgrounds
        //     campgroundsData.forEach((seed)=>{
        //         Campground.create(seed, (err, campground)=>{
        //             if(err){
        //                 console.log(err)
        //             } else {
        //                 console.log("added a campground");
        //                 //create a comment
        //                 Comment.create(commentsData, (err, comment)=>{
        //                     if(err){
        //                         console.log(err);
        //                     } else {
        //                         campground.comments.push(comment);
        //                         campground.save();
        //                         console.log("Created new comment");
        //                     }
        //                 })
        //             }
        //         });
        //     });
        // });
    }); 
    //add a few comments
}

module.exports = seedDB;