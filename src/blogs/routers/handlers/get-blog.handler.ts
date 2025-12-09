import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {mapToBlogOutput} from "../mappers/map-to-blog-output.util";
import {blogsService} from "../../application/blog.service";
import {errorHandler} from "../../../core/errors/error.handler";
import {isValidId} from "../../../posts/validation/postInputDtoValidation";
import {createErrorMessages} from "../../../core/utils/error.utils";

export async function getBlogHandler(req: Request, res: Response) {
    try {
        const id = req.params.id as string;

        const blog = await blogsService.findBlogByIdOrFail(id);
        const blogOutput = mapToBlogOutput(blog);
        res.status(HttpStatus.Ok).send(blogOutput);
    } catch (e: unknown) {
       errorHandler(e, res);
    }
}
