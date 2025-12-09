import request from 'supertest';
import { Express } from 'express';
import { PostInputDto } from '../../../src/posts/application/dtos/post.input-dto';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { getPostDto } from './get-post-dto';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import {createBlog} from "../blogs/create-blog";

export async function updatePost(
    app: Express,
    postId: string,
    postDto?: PostInputDto,
): Promise<void> {
    const blog = await createBlog(app);
    const defaultPostData: PostInputDto = getPostDto(blog.id);

    const testPostData = { ...defaultPostData, ...postDto };

    const updatedBlogResponse = await request(app)
        .put(`${POSTS_PATH}/${postId}`)
        .set('Authorization', generateBasicAuthToken())
        .send(testPostData)
        .expect(HttpStatus.NoContent);

    return updatedBlogResponse.body;
}
