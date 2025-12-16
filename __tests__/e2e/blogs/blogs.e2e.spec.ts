import request from "supertest";
import {setupApp} from "../../../src/setup-app";
import express from "express";
import {BlogInputDto} from "../../../src/blogs/application/dtos/blog.input-dto";
import {HttpStatus} from "../../../src/core/types/http-statuses";
import {generateBasicAuthToken} from "../../utils/generate-admin-auth-token";
import {BLOGS_PATH} from "../../../src/core/paths/paths";
import {clearDb} from "../../utils/clear-db";
import {runDB, stopDb} from "../../../src/db/mongo.bd";
import {SETTINGS} from "../../../src/core/settings/settings";
import {getBlogDto} from "../../utils/blogs/get-blog-dto";
import {createBlog} from "../../utils/blogs/create-blog";
import {getBlogById} from "../../utils/blogs/get-blog-by-id";
import {updateBlog} from "../../utils/blogs/update-blog";
import {after} from "node:test";


describe("Blogs API", () => {
    const app = express();
    setupApp(app);
    const adminToken: string = generateBasicAuthToken();
    beforeAll(async () => {
        await runDB(SETTINGS.MONGO_URL_TEST)
        await clearDb(app);
    });
    afterAll(async () => {
        stopDb();
    })
    it('should create blog; POST /hometask_04/api/blogs', async () => {

       await createBlog(app, {
            ...getBlogDto(),
            name: "Blog name New",
            description: "Blog description New",
            websiteUrl: "https://www.blogsNew.com/"
        });
    });
    it('should return blogs list: GET /hometask_04/api/blogs', async () => {
        await createBlog(app,{...getBlogDto(), name: "Blog name New2", description: "Blog description New2"} );
        await createBlog(app, {...getBlogDto(), name: "Blog name New3", description: "Blog description New3"});

        const blogListResponse = await request(app)
            .get(BLOGS_PATH)
            .set('Authorization', adminToken)
            .expect(HttpStatus.Ok);

        expect(blogListResponse.body).toBeInstanceOf(Array);
        expect(blogListResponse.body.length).toBeGreaterThanOrEqual(2);
        // console.log(blogListResponse);
    });

    it('should return blog by id; GET /hometask_04/api/blogs/:id',async () => {
        const createRespose = await createBlog(app);
        const blog = await getBlogById(app, createRespose.id);

        expect(blog).toEqual({
            ...createRespose,
            id: expect.any(String),
            createdAt: expect.any(String),
        });
    });
    it('should update blog; PUT /hometask_04/api/blogs/:id',async () => {
        const createRespose = await createBlog(app, {...getBlogDto(),name: "Another Blog", description: "Another Blog description"})

        const blogUpdateData: BlogInputDto = {
            name: "Updated name",
            description: "Updated description",
            websiteUrl: "https://www.updateblogs.com/",
        };
        await updateBlog(app, createRespose.id, blogUpdateData);

        const blogResponse = await getBlogById(app, createRespose.id);
        expect(blogResponse).toEqual({
            ...blogUpdateData,
            id: createRespose.id,
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean),
        });
    });
    it('DELETE /hometask_03/api/blogs/:id and check after NOT FOUND',async () => {
          const createdBlog = await createBlog(app);

          await request(app)
            .delete(`${BLOGS_PATH}/${createdBlog.id}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.NoContent);

          await request(app)
            .get(`${BLOGS_PATH}/${createdBlog.id}`)
            .set('Authorization', adminToken);
            expect(HttpStatus.NotFound);
    });
})
