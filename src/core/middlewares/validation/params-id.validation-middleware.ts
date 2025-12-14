import {param, body} from "express-validator";
import {blogsRepository} from "../../../blogs/repositories/blogs.repository";

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
            const blog = await blogsRepository.findBlogByIdOrFail(id);
            if(!blog) {
                throw new Error(`Blog with id ${id} not found`);
            }
            return true;
        }
        return false;
    })