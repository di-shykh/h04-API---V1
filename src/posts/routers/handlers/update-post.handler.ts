import {Request, Response} from "express";
import {PostInputDto} from "../../application/dtos/post.input-dto";
import {HttpStatus} from "../../../core/types/http-statuses";
import {createErrorMessages} from "../../../core/utils/error.utils";
import {postInputDtoValidation} from "../../validation/postInputDtoValidation";
import {blogsRepository} from "../../../blogs/repositories/blogs.repository";
import {postsRepository} from "../../repositories/posts.repository";
import {isValidId} from "../../validation/postInputDtoValidation";
import {Post} from "../../domain/post";
import {Blog} from "../../../blogs/types/blog";
import {WithId} from "mongodb";

export async function updatePostHandler(req: Request<{id: string}, {}, PostInputDto>, res: Response) {
    try{
        const id = req.params.id;
        if(!id || !isValidId(id)){
            res.status(HttpStatus.BadRequest).send(createErrorMessages([{field: "id", message: "Invalid id"}]));
            return;
        }
        const errors = postInputDtoValidation(req.body);
        if (errors.length > 0) {
            res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
            return;
        }
        const post: WithId<Post> | null = await postsRepository.findPostById(id);
        if(!post){
            res.status(HttpStatus.NotFound).send(createErrorMessages([{ field: 'id', message: 'Post not found' }]));
            return;
        }
        const blog: WithId<Blog> | null = await blogsRepository.findBlogById(req.body.blogId);
        if (!blog) {
            res.status(HttpStatus.BadRequest).send(createErrorMessages([{
                field: "blogId",
                message: "Blog not found"
            }]));
            return;
        }
        const updatedPost: Post = {
            ...post,
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
            blogName: blog.name,
        }
        await postsRepository.updatePost(id, updatedPost);
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        res.status(HttpStatus.InternalServerError);
    }

}
