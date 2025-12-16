import {validationResult, ValidationError, FieldValidationError} from "express-validator";
import {Request, Response, NextFunction} from "express";
import {HttpStatus} from "../../types/http-statuses";

export type APIErrorResult = {
    errorsMessages: FieldError[];
}
export type FieldError = {
    message: string;
    field: string;
}
// Форматируем ошибку из express-validator в нужный формат
const formatValidationError = (error: ValidationError): FieldError => {
    const expressError = error as unknown as FieldValidationError;
    return {
        message: expressError.msg,
        field: expressError.path||'',
    }
}
// Создаем ответ в нужном формате
export const createErrorMessages = (errors: FieldError[]): APIErrorResult => {
    return {
        errorsMessages: errors
    };
};
export const inputValidationResultMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
)=> {
    const errors = validationResult(req)
        .formatWith(formatValidationError)
        .array({onlyFirstError: true});
    if (errors.length > 0) {
        res.status(HttpStatus.BadRequest).json(createErrorMessages(errors));
        return;
    }
    next();
}