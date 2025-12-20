import {Express} from "express";
import {PostOutput} from "../../../src/posts/routers/output/post-output";
import request from "supertest";
import {BLOGS_PATH} from "../../../src/core/paths/paths";
import {generateBasicAuthToken} from "../generate-admin-auth-token";
import {HttpStatus} from "../../../src/core/types/http-statuses";

export async function getBlogPosts(
    app: Express,
    blogId: string,
    ): Promise<PostOutput>[] {
    const postResponse = await request(app)
        .get(`${BLOGS_PATH}/${blogId}/posts`)
        .set('Authorization', generateBasicAuthToken())
        .expect(HttpStatus.Ok);
    return postResponse.body;
}