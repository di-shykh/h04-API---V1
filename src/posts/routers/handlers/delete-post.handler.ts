import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {postsService} from "../../application/post.services";
import {errorHandler} from "../../../core/errors/error.handler";

export async function deletePostHandler(req: Request<{id: string}>, res: Response) {
    try {
        const id = req.params.id;
        await postsService.deletePost(id);
        res.sendStatus(HttpStatus.NoContent);
    }catch (e: unknown) {
        errorHandler(e, res);
    }
}