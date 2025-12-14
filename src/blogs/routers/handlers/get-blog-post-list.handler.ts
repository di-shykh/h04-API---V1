import {Request, Response} from "express";
import {errorHandler} from "../../../core/errors/error.handler";
import {PostQueryInput} from "../../../posts/routers/input/post-query.input";
import {postsService} from "../../../posts/application/post.services";
import {mapToPostListPaginatedOutput} from "../../../posts/routers/mappers/map-to-post-list-paginated-output";
import {HttpStatus} from "../../../core/types/http-statuses";

export async function getBlogPostListHandler(
    req: Request<{id: string}>,
    res: Response,
    ) {
    try {
        const blogId = req.params.id;
        const queryInput = req.query as unknown as unknown as PostQueryInput;

        const { items, totalCount } = await postsService.findPostsByBlogId(blogId, queryInput);
        const postListOutput = mapToPostListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        });
        res.status(HttpStatus.Ok).send(postListOutput);
    }
    catch (e: unknown) {
        errorHandler(e,res);
    }
}