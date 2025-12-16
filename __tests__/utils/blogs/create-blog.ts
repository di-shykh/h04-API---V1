import request from "supertest";
import {Express} from "express";
import {HttpStatus} from "../../../src/core/types/http-statuses";
import {generateBasicAuthToken} from "../generate-admin-auth-token";
import {BLOGS_PATH} from "../../../src/core/paths/paths";
import {BlogAttributes} from "../../../src/blogs/application/dtos/blog-attributes";
import {BlogOutput} from "../../../src/blogs/routers/output/blog.output";
import {BlogCreateInput} from "../../../src/blogs/routers/input/blog-create.input";
import {getBlogDto} from "./get-blog-dto";

export async function createBlog(app: Express, blogDto?: BlogAttributes): Promise<BlogOutput> {

    const testBlogData: BlogCreateInput = {
        ...getBlogDto(),
        ...blogDto
    };
    const createBlogResponse = await request(app)
        .post(BLOGS_PATH)
        .set('Authorization', generateBasicAuthToken())
        .send(testBlogData)
        .expect(HttpStatus.Created);

    return createBlogResponse.body;
}