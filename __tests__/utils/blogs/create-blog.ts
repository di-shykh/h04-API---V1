import request from "supertest";
import {BlogInputDto} from "../../../src/blogs/application/dtos/blog.input-dto";
import {Express} from "express";
import {HttpStatus} from "../../../src/core/types/http-statuses";
import {generateBasicAuthToken} from "../generate-admin-auth-token";
import {BLOGS_PATH} from "../../../src/core/paths/paths";
import {getBlogDto} from "./get-blog-dto";
import {BlogViewModel} from "../../../src/blogs/types/blog-view-model";

export async function createBlog(app: Express, blogDto?: BlogInputDto): Promise<BlogViewModel> {
    const defaultBlogData: BlogInputDto = getBlogDto();
    const testBlogData = {...defaultBlogData, ...blogDto};
    const createBlogResponse = await request(app)
        .post(BLOGS_PATH)
        .set('Authorization', generateBasicAuthToken())
        .send(testBlogData)
        .expect(HttpStatus.Created);

    return createBlogResponse.body;
}