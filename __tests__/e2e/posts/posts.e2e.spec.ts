import request from "supertest";
import {setupApp} from "../../../src/setup-app";
import express from "express";
import {PostInputDto} from "../../../src/posts/application/dtos/post.input-dto";
import {BlogInputDto} from "../../../src/blogs/application/dtos/blog.input-dto";
import {HttpStatus} from "../../../src/core/types/http-statuses";
import {generateBasicAuthToken} from "../../utils/generate-admin-auth-token";
import {POSTS_PATH, BLOGS_PATH} from "../../../src/core/paths/paths";
import {clearDb} from "../../utils/clear-db";
import {runDB,stopDb} from "../../../src/db/mongo.bd";
import {createPost} from "../../utils/posts/create-post";
import {createBlog} from "../../utils/blogs/create-blog";
import {getPostById} from "../../utils/posts/get-post-by-id";
import {SETTINGS} from "../../../src/core/settings/settings";
import {getPostDto} from "../../utils/posts/get-post-dto";
import {updatePost} from "../../utils/posts/update-post";

describe("Posts API", () => {
    const app = express();
    setupApp(app);
    const adminToken: string = generateBasicAuthToken();

    beforeAll(async () => {
        await runDB(SETTINGS.MONGO_URL_TEST);
        await clearDb(app);
    });
    afterAll(async () => {
        await stopDb();
    })
    it('should create blog; POST /hometask_03/api/posts', async () => {
        const blog = await createBlog(app);

        const newPost: PostInputDto = {
            ...getPostDto(blog.id),
            title: "New post title",
            shortDescription: "Post description New",
            content: "new post content",
            blogId: blog.id,
        }

        await createPost(app, newPost);
    });
    it('should return posts list: GET /hometask_03/api/posts', async () => {
        await createPost(app);
        await createPost(app);

        const postListResponse = await request(app)
            .get(POSTS_PATH)
            .set('Authorization', adminToken)
            .expect(HttpStatus.Ok);

        expect(postListResponse.body.items).toBeInstanceOf(Array);
        expect(postListResponse.body.items.length).toBeGreaterThanOrEqual(2);
    });
    it('should return post by id; GET /hometask_03/api/posts/:id',async () => {
        const createdPost = await createPost(app);

        const getPost = await getPostById(app, createdPost.id);

        expect(getPost).toEqual({
            ...createdPost,
            id: expect.any(String),
            createdAt: expect.any(String),
        });
    });
    it('should update post; PUT /hometask_03/api/posts/:id',async () => {
        const post = await createPost(app);

        const postUpdateData: PostInputDto = {
            title: "Another post title",
            shortDescription: "Post description another",
            content: "another post content",
            blogId: post.blogId,
        };

        await updatePost(app, post.id, postUpdateData)

        const postResponse = await getPostById(app, post.id);

        const blogName = postResponse.blogName;
        expect(postResponse).toEqual({
            ...postUpdateData,
            id: postResponse.id,
            blogName: blogName,
            createdAt: postResponse.createdAt,
        });
    });
    it('DELETE /hometask_03/api/posts/:id and check after NOT FOUND',async () => {
          const createdPost = await createPost(app);

          await request(app)
            .delete(`${POSTS_PATH}/${createdPost.id}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.NoContent);

          const postResponse = await request(app)
            .get(`${POSTS_PATH}/${createdPost.id}`)
            .set('Authorization', adminToken);
        expect(postResponse.status).toBe(HttpStatus.NotFound);
    });
})
