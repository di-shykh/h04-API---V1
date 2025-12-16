import {param, body} from "express-validator";
import {blogsRepository} from "../../../blogs/repositories/blogs.repository";
import {RepositoryNotFoundError} from "../../errors/repository-not-found.error";

export const idValidator = param("id")
    .exists().withMessage('id is required')
    .isString().withMessage('id must be a string')
    .isLength({ min: 1 }).withMessage('id must be not empty')
    .isMongoId().withMessage('Incorrect format of ObjectId')

export const dataIdMatchValidation = body("dataId")
    .exists().withMessage('Id in body is required')
    .custom((value, { req }) => {
        if (value !== req?.params?.id) {
            throw new Error('Id in URL and body must match');
        }
        return true;
    })
export const blogWithIdExistsValidation = param("id")
    .exists().withMessage('Id is required')
    .custom(async (id: string, { req }): Promise<boolean> => {
        if(id) {
            try{
                const blog = await blogsRepository.findBlogByIdOrFail(id);
                if(!blog) {
                    console.log("error blogWithIdExistsValidation in if");
                    throw new RepositoryNotFoundError(`Blog with id ${id} not found`);
                }
                return true;
            }
            catch (error) {
                console.log("error blogWithIdExistsValidation",error);
                req.sendStatus(404);
                throw error;
            }

        }
        return false;
    })