import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {createErrorMessages} from "../../../core/utils/error.utils";
import {postsRepository} from "../../repositories/posts.repository";
import {isValidId} from "../../validation/postInputDtoValidation";
import {Post} from "../../domain/post";
import {WithId} from "mongodb";
import {mapToPostViewModelUtil} from "../mappers/map-to-post-view-model.utils";
import {PostViewModel} from "../../types/post-view-model";

export async function getPostHandler(req: Request, res: Response) {
    try{
        const id = req.params.id;
        if(!id || !isValidId(id)){
            res.status(HttpStatus.NotFound).send(createErrorMessages([{field: "id", message: "Invalid id"}]));
            return;
        }
        const post: WithId<Post> | null = await postsRepository.findPostById(id);
        if(!post){
            res.status(HttpStatus.NotFound).send(createErrorMessages([{field: "id", message: "Post not found"}]));
            return;
        }
        const postViewModel: PostViewModel = mapToPostViewModelUtil(post);
        res.status(HttpStatus.Ok).send(postViewModel);
    } catch (e: unknown ) {
        res.status(HttpStatus.InternalServerError);
    }
}
