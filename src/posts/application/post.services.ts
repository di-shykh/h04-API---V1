import {blogsRepository} from "../../blogs/repositories/blogs.repository";
import {postsRepository} from "../repositories/posts.repository";
import {ObjectId, WithId} from "mongodb";
import {Blog} from "../../blogs/types/blog";
import {Post} from "../domain/post";
import {PostAttributes} from "./dtos/post-attributs";
import {PostQueryInput} from "../routers/input/post-query.input";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";

export const postsService = {
    async findManyPosts(queryDto: PostQueryInput): Promise<{items: WithId<Post>[], totalCount: number}> {
        return await postsRepository.findManyPosts(queryDto);
    },
    async findPostByIdOrFail(postId: string): Promise<WithId<Post>> {
        return await postsRepository.findPostByIdOrFail(postId);
    },
    async findPostsByBlogId(blogId: string, queryDto?: PostQueryInput): Promise<{items: WithId<Post>[], totalCount: number}> {
        return await postsRepository.findPostsByBlogId(blogId, queryDto);
    },
    async createPost(dto: PostAttributes): Promise<string> {
        const blog = await blogsRepository.findBlogByIdOrFail(dto.blogId);
        if(!blog){
            throw new RepositoryNotFoundError("Blog does not exist");
        }
        const newPost = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: dto.blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        }
        return await postsRepository.createPost(newPost);
    },
    async updatePost(id: string, dto: PostAttributes): Promise<void> {
        await postsRepository.updatePost(id, dto);
    },
    async deletePost(id: string): Promise<void> {
        await postsRepository.deletePost(id);
    }
}
// export type Post = {
//     title: string;
//     shortDescription: string;
//     content: string;
//     blogId: string;
//     blogName: string;
//
//     createdAt: string;
// }
