import {BlogInputDto} from "../application/dtos/blog.input-dto";
import {ValidationError} from "../../core/utils/validationError";

const URL_PATTERN = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

export const blogInputDtoValidation = (data: BlogInputDto) : ValidationError[] => {
    const errors: ValidationError[] = [];

    if(
        !data.name ||
        typeof data.name !== "string" ||
        data.name.trim().length < 2 ||
        data.name.trim().length > 15
    ) {
        errors.push({field: "name", message: "Invalid name."});
    }
    if(
        !data.description ||
        typeof data.description !=="string" ||
        data.description.trim().length < 2 ||
        data.description.trim().length > 500
    ){
        errors.push({field: "description", message: "Invalid description."});
    }
    if(
        !data.websiteUrl ||
        typeof data.websiteUrl !=="string" ||
        data.websiteUrl.trim().length < 2 ||
        data.websiteUrl.trim().length > 100 ||
        !URL_PATTERN.test(data.websiteUrl)
    ){

    }
    return  errors;
}
