import {blogsRepository} from "../repositories/blogs.repository";
import {ObjectId, WithId} from "mongodb";
import {Blog} from "../types/blog";
import {postsRepository} from "../../posts/repositories/posts.repository";
import {BlogAttributes} from "./dto/blog-attributes";
import {BlogQueryInput} from "../routers/input/blog-query.input";
import {Post} from "../../posts/types/post";

export const blogsService = {
    async findMany(
        queryDto: BlogQueryInput,
    ): Promise<{items: WithId<Blog>[]; totalCount: number}> {
        return await blogsRepository.findManyBlogs(queryDto);
    },
    async findBlogByIdOrFail(id: string): Promise<WithId<Blog>> {
        return await blogsRepository.findBlogByIdOrFail(id);
    },
    async create(dto: BlogAttributes): Promise<string> {
        const newBlog: Blog = {
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        };
        return await blogsRepository.createBlog(newBlog);
    },
    async update(id: string, dto: BlogAttributes): Promise<void> {
        const updateResult = await blogsRepository.updateBlog(id, dto);
       return;
    },
    async delete(id: string): Promise<void> {
        const postsWithBlogId = await postsRepository.findPostsByBlogId(id);
        if(postsWithBlogId && postsWithBlogId.length > 0){
            await Promise.all(postsWithBlogId.map( (post: WithId<Post>) => {
                postsRepository.deletePost(post._id.toString())
            }))
        }
        await blogsRepository.deleteBlog(id);
        return;
    }
}
// export type Blog = {
//     name: string;
//     description: string;
//     websiteUrl: string;
//
//     createdAt: string;
//     isMembership: boolean;
// }