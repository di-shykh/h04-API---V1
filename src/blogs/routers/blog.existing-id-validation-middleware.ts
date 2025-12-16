import {validationResult, ValidationError, FieldValidationError} from "express-validator";
import {Request, Response, NextFunction} from "express";
import {HttpStatus} from "../../core/types/http-statuses";
import {blogsRepository} from "../repositories/blogs.repository";
import {RepositoryNotFoundError} from "../../core/errors/repository-not-found.error";
import {errorHandler} from "../../core/errors/error.handler";
import {ObjectId} from "mongodb";

function isValidObjectId(id: string): boolean {
    try{
        const objectId= new ObjectId(id);
        return objectId.toString() === id;
    }
    catch(err){
        return false;
    }
}

export const blogExistingIdValidationMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = req.params.id as string;
    try{
        if(id) {
            if(isValidObjectId(id)) {
                const blog = await blogsRepository.findBlogByIdOrFail(id);
                if(!blog) {
                    console.log("error blogWithIdExistsValidation in if");
                    throw new RepositoryNotFoundError(`Blog with id ${id} not found`);
                }
            }
        }
        next();
    }
    catch (error) {
        errorHandler(error,res);
    }
}