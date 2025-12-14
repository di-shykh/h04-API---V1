import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { BlogViewModel } from '../../../src/blogs/types/blog-view-model';
import {Blog} from "../../../src/blogs/types/blog";
import {BlogOutput} from "../../../src/blogs/routers/output/blog.output";

export async function getBlogById(
    app: Express,
    blogId: string,
): Promise<BlogOutput> {
    const blogResponse = await request(app)
        .get(`${BLOGS_PATH}/${blogId}`)
        .set('Authorization', generateBasicAuthToken())
        .expect(HttpStatus.Ok);

    return blogResponse.body;
}