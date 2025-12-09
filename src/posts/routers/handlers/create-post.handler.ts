import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {createErrorMessages} from "../../../core/utils/error.utils";
import {Blog} from "../../../blogs/types/blog";
import {Post} from "../../domain/post";
import {PostInputDto} from "../../application/dtos/post.input-dto";
import {postInputDtoValidation} from "../../validation/postInputDtoValidation";
import {blogsRepository} from "../../../blogs/repositories/blogs.repository";
import {postsRepository} from "../../repositories/posts.repository";
import {WithId} from "mongodb";
import {mapToPostViewModelUtil} from "../mappers/map-to-post-view-model.utils";
import {PostViewModel} from "../../types/post-view-model";

export async function createPostHandler(req: Request<{},{},PostInputDto>, res: Response) {
   try{
       const errors = postInputDtoValidation(req.body);
       if (errors.length > 0) {
           res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
           return;
       }

       const blog: WithId<Blog> | null = await blogsRepository.findBlogById(req.body.blogId);
       if (!blog) {
           res.status(HttpStatus.BadRequest).send(createErrorMessages([{field: "blogId", message: "Blog not found"}]));
           return;
       }

       const newPost: Post = {
           title: req.body.title,
           shortDescription: req.body.shortDescription,
           content: req.body.content,
           blogId: req.body.blogId,
           blogName: blog.name,
           createdAt: new Date().toISOString(),
       };
       const createdPost: WithId<Post> = await postsRepository.createPost(newPost);
       const postViewModel: PostViewModel = mapToPostViewModelUtil(createdPost);
       res.status(HttpStatus.Created).send(postViewModel)
   } catch (e: unknown) {
       res.status(HttpStatus.InternalServerError);
   }

}

