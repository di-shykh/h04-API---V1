import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {createErrorMessages} from "../../../core/utils/error.utils";
import {postsRepository} from "../../repositories/posts.repository";
import {isValidId} from "../../validation/postInputDtoValidation";
import {Post} from "../../domain/post";
import {WithId} from "mongodb";

export async function deletePostHandler(req: Request, res: Response) {
    try {
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
        await postsRepository.deletePost(id);
        res.sendStatus(HttpStatus.NoContent);
    }catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }

}