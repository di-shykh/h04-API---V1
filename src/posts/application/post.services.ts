import {blogsRepository} from "../../blogs/repositories/blogs.repository";
import {postsRepository} from "../repositories/posts.repository";
import {ObjectId, WithId} from "mongodb";
import {Blog} from "../../blogs/types/blog";
import {Post} from "../domain/post";
import {PostAttributes} from "./dtos/post-attributs";
import {PostQueryInput} from "../routers/input/post-query.input";

export const postServices = {
    async findManyPosts(): Promise<Post[]> {

    }
}
