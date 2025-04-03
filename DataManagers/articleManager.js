import {findArticleWithId, pullAllArticlesPreview} from "../index.js";
import { ObjectId } from "mongodb";

async function getAllArticles() {
    const listOfArticles = await pullAllArticlesPreview();
    if (listOfArticles == null || listOfArticles.length == 0) {
        return;
    }
    listOfArticles.forEach(article => {
        article._id = article._id.toString();
    })
    return listOfArticles;
}

async function getArticleById(id) {
    const article_id = new ObjectId(id);
    const article = await findArticleWithId(article_id);
    if (article != -1) {
        article._id = article._id.toString()
    }
    return article;
}

const testList = await getAllArticles()
const iid = testList[0]._id
const testart = await getArticleById(iid)