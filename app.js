const express = require('express');
const bodyParser=require('body-parser');
const ejs = require('ejs');
var _ = require('lodash');
const mongoose=require('mongoose');

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/blogDb');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const homeStartingContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rhoncus finibus lorem, in cursus massa aliquam in. Donec eu mauris at libero rutrum scelerisque eu sit amet lectus. In ipsum dui, rutrum accumsan mollis nec, sollicitudin a mi. Sed sollicitudin velit ut dui mollis, vel aliquet lacus blandit. Aliquam vel nisl lacinia, convallis mauris ac, ullamcorper libero. Integer vitae urna non ex rhoncus tempus. Proin ut erat velit. Donec varius metus ac urna porta, sit amet interdum orci commodo"
const aboutStartingContent = "Nunc interdum iaculis lorem in lobortis. Fusce in nulla tristique, aliquam tortor sit amet, posuere ligula. Sed varius mauris vel mauris sollicitudin lobortis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas eu velit aliquet lorem placerat pretium sed nec nibh. Sed viverra suscipit nulla quis dictum. Donec semper est arcu, egestas pretium tellus ultrices id. Proin nec porta eros. Donec vel felis suscipit, ullamcorper orci cursus, volutpat purus. "
const contactStartingContent = "Maecenas sed nibh condimentum, rutrum sem ac, vestibulum sem. Mauris venenatis dictum felis. Maecenas sit amet leo eu nibh pretium dictum in id leo. Proin eget lacus placerat, molestie lacus congue, placerat quam. Proin hendrerit massa turpis, in vehicula nisi commodo in. Suspendisse potenti. Nullam sed posuere massa."

const postSchema={
    title:String,
    content:String
}

const Post=mongoose.model("Post",postSchema);

app.get("/", (req, res) => {

    async function listAll(){
        let posts=await Post.find();
        res.render('home',{startingContent:homeStartingContent,posts:posts});
    }

    listAll();
    
})

app.get("/about", (req, res) => {
    res.render('about',{startingContent:aboutStartingContent});
})

app.get("/contact", (req, res) => {
    res.render('contact',{startingContent:contactStartingContent});
})

app.get("/compose",(req,res)=>{
    res.render('compose');
})

app.get("/posts/:topic",(req,res)=>{

    const postId=req.params.topic;

    async function get(){
        let temp=await Post.findById(postId);
        res.render('post',{postTitle:temp.title,postContent:temp.content});
    }
    get();

    // posts.forEach((post)=>{
    //     if(_.lowerCase(post.title) === _.lowerCase(req.params.topic))
    //     {
    //         res.render('post',{postTitle:post.title,postContent:post.content});
    //     }
        
    // })
})

app.post("/compose",(req,res)=>{

    const post= new Post({
        title:req.body.postTitle,
        content:req.body.postBody
    });

    post.save();
    
    res.redirect("/");
})

app.listen(3000, () => {
    console.log("Server started...");
})