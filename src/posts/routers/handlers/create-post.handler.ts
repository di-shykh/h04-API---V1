import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {PostCreateInput} from "../input/post-create.input";
import {postsService} from "../../application/post.services";
import {mapToPostOutput} from "../mappers/map-to-post-output.util";
import {errorHandler} from "../../../core/errors/error.handler";

export async function createPostHandler(req: Request<{},{},PostCreateInput>, res: Response) {
   try{
      const createdPost = await postsService.createPost(req.body.data.attributes);
      const insertedPost = await postsService.findPostByIdOrFail(createdPost);
      const postOutput = mapToPostOutput(insertedPost);
      res.status(HttpStatus.Created).send(postOutput);
   } catch (e: unknown) {
       errorHandler(e, res);
   }

}

