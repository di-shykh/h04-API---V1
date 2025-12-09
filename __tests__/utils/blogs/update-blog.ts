import request from 'supertest';
import { Express } from 'express';
import { BlogInputDto } from '../../../src/blogs/application/dtos/blog.input-dto';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { getBlogDto } from './get-blog-dto';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';

export async function updateBlog(
    app: Express,
    blogId: string,
    blogDto?: BlogInputDto,
): Promise<void> {
    const defaultBlogData: BlogInputDto = getBlogDto();

    const testBlogData = { ...defaultBlogData, ...blogDto };

    const updatedBlogResponse = await request(app)
        .put(`${BLOGS_PATH}/${blogId}`)
        .set('Authorization', generateBasicAuthToken())
        .send(testBlogData)
        .expect(HttpStatus.NoContent);

    return updatedBlogResponse.body;
}
