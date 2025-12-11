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
import {PostCreateInput} from "../input/post-create.input";
import {postsService} from "../../application/post.services";

export async function createPostHandler(req: Request<{},{},PostCreateInput>, res: Response) {
   try{
      const createdPost = await postsService.createPost(req.body.data.attributes);
      const insertedPost = await postsService.findPostByIdOrFail(createdPost);
      const
   } catch (e: unknown) {
       res.status(HttpStatus.InternalServerError);
   }

}

