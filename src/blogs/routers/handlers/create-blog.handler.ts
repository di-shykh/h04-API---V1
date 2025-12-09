
import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {mapToBlogOutput} from "../mappers/map-to-blog-output.util";
import {blogsService} from "../../application/blog.service";
import {errorHandler} from "../../../core/errors/error.handler";
import {BlogCreateInput} from "../input/blog-create.input";


export async function createBlogHandler(
    req: Request<{},{},BlogCreateInput>,
    res: Response
) {
    try{
        const createdBlogId = await blogsService.create(req.body.data.attributes);
        const createdBlog = await blogsService.findBlogByIdOrFail(createdBlogId);
        const blogOutput = mapToBlogOutput(createdBlog);
        res.status(HttpStatus.Created).send(blogOutput);

    } catch(err: unknown){
        errorHandler(err, res);
    }
}
