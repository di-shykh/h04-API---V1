import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import {BlogInputDto} from "../../../src/blogs/application/dtos/blog.input-dto";
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { getBlogDto } from '../../utils/blogs/get-blog-dto';
import { clearDb } from '../../utils/clear-db';
import { createBlog } from '../../utils/blogs/create-blog';
import { getBlogById } from '../../utils/blogs/get-blog-by-id';
import { runDB, stopDb } from '../../../src/db/mongo.bd';
import {SETTINGS} from "../../../src/core/settings/settings";
import {createBlogPost} from "../../utils/blogs/create-blog-post";

describe ('Blog API body validation check',() => {
    const app = express();
    setupApp(app);
    const adminToken: string = generateBasicAuthToken();
    const correctTestBlogData: BlogInputDto = getBlogDto();

    beforeAll(async () => {
        await runDB(SETTINGS.MONGO_URL_TEST)
        await clearDb(app);
    })
    afterAll(async () => {
        await stopDb();
    })
    it('should not create blog when incorrect body passed; POST /api/blogs', async () => {
        await request(app)
            .post(BLOGS_PATH)
            .send(correctTestBlogData)
            .expect(HttpStatus.Unauthorized);

        const invalidDataSet1 = await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', adminToken)
            .send({
                ...correctTestBlogData,
                name: "    ",
                description: "     ",
                websiteUrl: "randomString",
            })
            .expect(HttpStatus.BadRequest);
        expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);

        const invalidDataSet2 = await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', adminToken)
            .send({
                ...correctTestBlogData,
                name: "",
                description: "",
                websiteUrl: "",
            })
            .expect(HttpStatus.BadRequest);
        expect(invalidDataSet2.body.errorsMessages).toHaveLength(3);

        const invalidDataSet3 = await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', adminToken)
            .send({
                ...correctTestBlogData,
                name: "A",
                description: "A",
                websiteUrl: "https://.com/",
            })
            .expect(HttpStatus.BadRequest);
        expect(invalidDataSet3.body.errorsMessages).toHaveLength(3);

        //check that nothing were created
        const blogResponse = await request(app)
            .get(BLOGS_PATH)
            .set('Authorization', adminToken);
        expect(blogResponse.body.items).toHaveLength(0);
    });
    it('should not update blog when incorrect data passed; PUT /api/blogs', async () => {
        const createdBlog = await createBlog(app);

        const invalidDataSet1 = await request(app)
            .put(`${BLOGS_PATH}/${createdBlog.id}`)
            .set('Authorization', adminToken)
            .send({
                ...correctTestBlogData,
                name: "    ",
                description: "     ",
                websiteUrl: "randomString",
            })
            .expect(HttpStatus.BadRequest);
        expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);

        const invalidDataSet2 = await request(app)
            .put(`${BLOGS_PATH}/${createdBlog.id}`)
            .set('Authorization', adminToken)
            .send({
                ...correctTestBlogData,
                name: "",
                description: "",
                websiteUrl: "",
            })
            .expect(HttpStatus.BadRequest);
        expect(invalidDataSet2.body.errorsMessages).toHaveLength(3);

        const invalidDataSet3 = await request(app)
            .put(`${BLOGS_PATH}/${createdBlog.id}`)
            .set('Authorization', adminToken)
            .send({
                ...correctTestBlogData,
                name: "A",
                description: "A",
                websiteUrl: "https://.com/",
            })
            .expect(HttpStatus.BadRequest);
        expect(invalidDataSet3.body.errorsMessages).toHaveLength(3);

        const blogResponse = await request(app)
            .get(`${BLOGS_PATH}/${createdBlog.id}`)
            .set('Authorization', adminToken)
        expect(blogResponse.body).toEqual({
            ...createdBlog
        });
    });
    it('should not create post for blog with wrong blogId', async () => {
        const wrongBlogId: string = 'randomString';
        try{
            await createBlogPost(app, wrongBlogId, {
                title: 'Blog_Post Title3',
                shortDescription: 'description blog_post3',
                content: 'constent blog_post3',
                blogId: wrongBlogId,
            });
            fail('Post should not be created for wrong blogId');
        } catch (error) {
            expect(error).toBeDefined();
        }


        //check that nothing were created
        const postResponse = await request(app)
            .get(`${BLOGS_PATH}/${wrongBlogId}/posts`)
            .set('Authorization', adminToken);
        if(postResponse.status === HttpStatus.NotFound) {
            expect(postResponse.status).toBe(HttpStatus.NotFound);
        } else if (postResponse.status === HttpStatus.BadRequest) {
            expect(postResponse.status).toBe(HttpStatus.BadRequest);
        }
    })
})