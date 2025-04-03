import dummy_data from './articles.mjs';
import { posts_db, users_db } from "./db/conn.mjs";
import { ObjectId } from "mongodb";



let collection = posts_db.collection("articles");

//finding all existing dummy articles
const options = {projection:{_id: 1},}
let results = await collection.find({}, options).limit(10).toArray();

results.forEach(result => {
    const query = {_id: result._id};

    collection.deleteOne(query).then(findRes => {
        console.log(findRes)
    });
    
})

dummy_data.articles.forEach(article => {
    console.log(article.article);
    let result = collection.insertOne(article.article);
    console.log(result);
})
