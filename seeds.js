let mongoose = require('mongoose'),
	Campground = require('./models/campgrounds'),
	Comment = require('./models/comments');

let campgroundsData = [
	{
	name: "Saif-ul-Maluk Lake", 
	image: "https://www.zameen.com/blog/wp-content/uploads/2020/02/Camping-Sites-in-Pakistan-C-26-02-1024x640.jpg", 
	description: 'a very enchanting place for camping'
	},
	{
	name: "Rana meadows", 
	image: "https://www.thenews.com.pk/assets/uploads/tns/2017-05-21/563311_4478336_tns.jpg", 
	description: 'a very enchanting place for camping'
	},
	{
	name: "Ratti Gali Lake", 
	image: "https://production9240.blob.core.windows.net/photos/97ba24e1-838c-48f5-8c37-ad5ce3ee766f", 
	description: 'a very enchanting place for camping'
	},
	{
	name: "Beyal Camp", 
	image: "https://www.zameen.com/blog/wp-content/uploads/2020/02/Camping-Sites-in-Pakistan-D-26-02-1024x640.jpg", 
	description: 'a very enchanting place for camping'
	},
	{
	name: "Fairy Meadows", 
	image: "https://i.redd.it/zf1wetxih7l31.jpg", 
	description: 'a very enchanting place for camping'
	},
];

let commentsData = 
	{
		text: 'great place to go and camp in',
		author: 'Booyaa'
	}


function seedDB(){
   //Remove all campgrounds
   Campground.deleteMany({}, (err)=>{
        // if(err){
        //     console.log(err);
        // }
        // console.log("removed campgrounds!");
        // Comment.deleteMany({}, (err)=> {
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