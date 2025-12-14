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
import {postsService} from "../../application/post.services";
import {PostQueryInput} from "../input/post-query.input";
import {PostUpdateInput} from "../input/post-update.input";
import {errorHandler} from "../../../core/errors/error.handler";

export async function updatePostHandler(req: Request<{id: string}, {}, PostUpdateInput>, res: Response) {
    try{
        const id = req.params.id;
        const updatedPost = await postsService.updatePost(id, req.body.data.attributes);
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        errorHandler(e, res);
    }

}
