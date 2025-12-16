import request from 'supertest';
import {Express} from 'express';
import {HttpStatus} from '../../../src/core/types/http-statuses';
import {BLOGS_PATH} from '../../../src/core/paths/paths';
import {generateBasicAuthToken} from '../generate-admin-auth-token';
import {BlogAttributes} from "../../../src/blogs/application/dtos/blog-attributes";
import {BlogUpdateInput} from "../../../src/blogs/routers/input/blog-update.input";
import {getBlogDto} from "./get-blog-dto";

export async function updateBlog(
    app: Express,
    blogId: string,
    blogDto?: BlogAttributes,
): Promise<void> {
    const testBlogData: BlogUpdateInput = {
        id: blogId,
        ...getBlogDto(),
        ...blogDto,
    };

    const updatedBlogResponse = await request(app)
        .put(`${BLOGS_PATH}/${blogId}`)
        .set('Authorization', generateBasicAuthToken())
        .send(testBlogData)
        .expect(HttpStatus.NoContent);

    return updatedBlogResponse.body;
}
