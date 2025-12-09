import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {errorHandler} from "../../../core/errors/error.handler";
import {blogsService} from "../../application/blog.service";

export async function deleteBlogHandler(
    req: Request<{id:string}>,
    res: Response
): Promise<void> {
    try {
        const id = req.params.id;
        await blogsService.delete(id);
        res.sendStatus(HttpStatus.NoContent)
    } catch (e: unknown) {
        errorHandler(e, res);
    }
}