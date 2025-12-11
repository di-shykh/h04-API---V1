import {blogsRepository} from "../../blogs/repositories/blogs.repository";
import {postsRepository} from "../repositories/posts.repository";
import {ObjectId, WithId} from "mongodb";
import {Blog} from "../../blogs/types/blog";
import {Post} from "../domain/post";
import {PostAttributes} from "./dtos/post-attributs";
import {PostQueryInput} from "../routers/input/post-query.input";

export const postServices = {
    async findManyPosts(queryDto: PostQueryInput): Promise<{items: WithId<Post>[], totalCount: number}> {
        return await postsRepository.findManyPosts(queryDto);
    },
    async findPostByIdOrFail(postId: string): Promise<WithId<Post>> {
        return await postsRepository.findPostByIdOrFail(postId);
    },
    async findPostsByBlogId(blogId: string, queryDto: PostQueryInput): Promise<{items: WithId<Post>[], totalCount: number}> {
        return await postsRepository.findPostsByBlogId(blogId, queryDto);
    },
    async createPost(post: WithId<Post>): Promise<WithId<Post>> {

    }
}
