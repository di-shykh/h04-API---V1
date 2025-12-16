import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {PostCreateInput} from "../../../posts/routers/input/post-create.input";
import {postsService} from "../../../posts/application/post.services";
import {mapToPostOutput} from "../../../posts/routers/mappers/map-to-post-output.util";
import {errorHandler} from "../../../core/errors/error.handler";
import {blogsService} from "../../application/blog.service";

export async function createBlogPostHandler(req: Request<{id: string}, PostCreateInput>, res: Response) {
    try{
        const blogId = req.params.id;
        const blog = await blogsService.findBlogByIdOrFail(blogId);
        const postData = req.body;
        const createdPostId = await postsService.createPost({
            title: postData.title,
            shortDescription: postData.shortDescription,
            content: postData.content,
            blogId});
        const createdPost = await postsService.findPostByIdOrFail(createdPostId);
        const postOutput = mapToPostOutput(createdPost);
        res.status(HttpStatus.Created).send(postOutput);
    }
    catch (e: unknown) {
        errorHandler(e,res);
    }
}