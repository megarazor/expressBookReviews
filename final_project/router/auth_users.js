const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
    
        req.session.authorization = {
            accessToken,username
        }
        
        req.session.username= username;
        req.session.password= password;

        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // console.log(req.session.username);
    const isbn= req.params.isbn;
    const username= req.session.username;
    const reviewText= req.query.reviewtext;
    if (!username) {
        res.status(400).json({message: "Failed to obtain username of the current session. Request now is aborted."});
    }
    if (isbn in books) {
        let userReviewFound= false;
        Object.keys(books[isbn]['reviews']).forEach(function(reviewerUsername) {
            if (reviewerUsername === username){
                userReviewFound= true;
            }
        });
        if (userReviewFound) {
            books[isbn]['reviews'][username]= reviewText;
            return res.status(200).send("Review successfully updated");
        }
        else{
            books[isbn]['reviews'][username]= reviewText;
            return res.status(200).send("Review successfully added");
        }
    }
    else{
        res.status(400).json({message: `No book with ISBN ${isbn} in the database.`});
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn= req.params.isbn;
    const username= req.session.username;

    if (!username) {
        res.status(400).json({message: "Failed to obtain username of the current session. Request now is aborted."});
    }
    if (isbn in books) {
        let userReviewFound= false;
        Object.keys(books[isbn]['reviews']).forEach(function(reviewerUsername) {
            if (reviewerUsername === username){
                userReviewFound= true;
            }
        });
        if (userReviewFound) {
            delete books[isbn]['reviews'][username];
            return res.status(200).send("Review successfully deleted");
        }
        else{
            return res.status(400).send("User has no review on the requested book.");
        }
    }
    else{
        res.status(400).json({message: `No book with ISBN ${isbn} in the database.`});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
