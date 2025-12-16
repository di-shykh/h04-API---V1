import request from 'supertest';
import {Express} from 'express';
import {PostInputDto} from '../../../src/posts/application/dtos/post.input-dto';
import {HttpStatus} from '../../../src/core/types/http-statuses';
import {getPostDto} from './get-post-dto';
import {POSTS_PATH} from '../../../src/core/paths/paths';
import {generateBasicAuthToken} from '../generate-admin-auth-token';
import {createBlog} from "../blogs/create-blog";
import {PostAttributes} from "../../../src/posts/application/dtos/post-attributs";
import {PostUpdateInput} from "../../../src/posts/routers/input/post-update.input";
import {ResourceType} from "../../../src/core/types/resource-type";

export async function updatePost(
    app: Express,
    postId: string,
    postDto?: PostAttributes,
): Promise<void> {
    const blog = await createBlog(app);
    const defaultPostData: PostInputDto = getPostDto(blog.data.id);

    const testPostData: PostUpdateInput = {
        data: {
            type:  ResourceType.Posts,
            id: postId,
            attributes: {
                ...defaultPostData,
                ...postDto
            },
        },
    };

    const updatedBlogResponse = await request(app)
        .put(`${POSTS_PATH}/${postId}`)
        .set('Authorization', generateBasicAuthToken())
        .send(testPostData)
        .expect(HttpStatus.NoContent);

    return updatedBlogResponse.body;
}
