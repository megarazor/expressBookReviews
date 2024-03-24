const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    else{
        return res.status(400).json({message: "Please provide both username and password."});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            obtainedBooks= JSON.stringify(books, null, 4);
            resolve(obtainedBooks)
        },6000)})
        
    myPromise.then((obtainedBooks) => {
        res.send(obtainedBooks);
      })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn= req.params.isbn;
    let myPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            let obtainedBook= null;
            if (isbn in books) {
                obtainedBook= JSON.stringify(books[isbn], null, 4);
            }
            resolve(obtainedBook)
        },6000)})
        
    myPromise.then((obtainedBook) => {
        if (obtainedBook){
            res.status(200).send(obtainedBook);
        }
        else {
            res.status(400).json({message: `No book with ISBN ${isbn} in the database.`});
        }  
    })
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author= req.params.author;
    let myPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            let authorBooks= [];
            Object.keys(books).forEach(function(isbn) {
                if (books[isbn]["author"] === author) {
                    authorBooks.push(books[isbn]);
                }
            });
            resolve(JSON.stringify(authorBooks, null, 4));
        },6000)});
        
    myPromise.then((authorBooks) => {
        res.status(200).send(authorBooks);
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title= req.params.title;
    let myPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            let titleBooks= [];
            Object.keys(books).forEach(function(isbn) {
                if (books[isbn]["title"] === title) {
                    titleBooks.push(books[isbn]);
                }
            });
            resolve(JSON.stringify(titleBooks, null, 4));
        },6000)});
        
    myPromise.then((titleBooks) => {
        res.status(200).send(titleBooks);
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn= req.params.isbn;
    let myPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            let reviews= null;
            if (isbn in books) {
                reviews= JSON.stringify(books[isbn]['reviews'], null, 4);
            }
            resolve(reviews)
        },6000)})
        
    myPromise.then((reviews) => {
        if (reviews){
            res.status(200).send(reviews);
        }
        else {
            res.status(400).json({message: `Failed to obtain reviews because there is no book with ISBN ${isbn} in the database.`});
        }  
    })
});

module.exports.general = public_users;
