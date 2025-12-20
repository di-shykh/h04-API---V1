import {PostAttributes} from "../../../src/posts/application/dtos/post-attributs";
import {PostOutput} from "../../../src/posts/routers/output/post-output";
import {Express} from "express";
import {getBlogById} from "./get-blog-by-id";
import {PostCreateInput} from "../../../src/posts/routers/input/post-create.input";
import {BlogOutput} from "../../../src/blogs/routers/output/blog.output";
import {BLOGS_PATH, POSTS_PATH} from "../../../src/core/paths/paths";
import request from "supertest";
import {generateBasicAuthToken} from "../generate-admin-auth-token";
import {HttpStatus} from "../../../src/core/types/http-statuses";

export async function createBlogPost(
    app: Express,
    blogId: string,
    postDto: PostAttributes): Promise<PostOutput> {
    const blog: BlogOutput = await getBlogById(app, blogId);
    const testPostData: PostCreateInput = {
        title: postDto.title,
        shortDescription: postDto.shortDescription,
        content: postDto.content,
        blogId: blogId,
        blogName: blog.name,
        createdAt: new Date().toISOString(),
    };
    const response = await request(app)
        .post(`${BLOGS_PATH}/${blogId}/posts`)
        .set('Authorization', generateBasicAuthToken())
        .send(testPostData)
        .expect(HttpStatus.Created);
    const createdPost: PostOutput = response.body;
    return createdPost;
}
