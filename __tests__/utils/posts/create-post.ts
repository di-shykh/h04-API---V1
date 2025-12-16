import request from "supertest";
import {PostInputDto} from "../../../src/posts/application/dtos/post.input-dto";
import {Express} from "express";
import {HttpStatus} from "../../../src/core/types/http-statuses";
import {generateBasicAuthToken} from "../generate-admin-auth-token";
import {POSTS_PATH} from "../../../src/core/paths/paths";
import {getPostDto} from "./get-post-dto";
import {createBlog} from "../blogs/create-blog";
import {PostAttributes} from "../../../src/posts/application/dtos/post-attributs";
import {PostOutput} from "../../../src/posts/routers/output/post-output";

export async function createPost(app: Express, postDto?: PostAttributes): Promise<PostOutput> {
    const blog = await createBlog(app);
    const defaultPostData: PostInputDto = getPostDto(blog.id);
    const testPostData = {
        ...defaultPostData,
        ...postDto
    };

    const createPostResponse = await request(app)
        .post(POSTS_PATH)
        .set('Authorization', generateBasicAuthToken())
        .send(testPostData)
        .expect(HttpStatus.Created);
    return createPostResponse.body;
}