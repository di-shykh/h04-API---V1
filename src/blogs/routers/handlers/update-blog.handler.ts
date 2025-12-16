import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {blogsService} from "../../application/blog.service";
import {BlogUpdateInput} from "../input/blog-update.input";
import {errorHandler} from "../../../core/errors/error.handler";

export async function updateBlogHandler(
    req: Request<{id: string}, {}, BlogUpdateInput>,
    res: Response
) {
    try {
        const id = req.params.id;
        await blogsService.update(id, req.body);
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        errorHandler(e, res);
    }
}