import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {postsService} from "../../application/post.services";
import {mapToPostOutput} from "../mappers/map-to-post-output.util";
import {errorHandler} from "../../../core/errors/error.handler";

export async function getPostHandler(req: Request, res: Response) {
    try{
        const id = req.params.id as string;
        const post = await postsService.findPostByIdOrFail(id);
        const postOutput = mapToPostOutput(post);
        res.status(HttpStatus.Ok).send(postOutput);
    } catch (e: unknown ) {
        errorHandler(e, res);
    }
}
