import {body} from "express-validator";

const URL_PATTERN = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

const nameValidation = body("name")
    .exists().withMessage("name is required")
    .isString().withMessage("name should  be string")
    .trim()
    .isLength({min: 2, max: 15}).withMessage("name must be at least 2 characters and max 15");
const descriptionValidation = body("description")
    .exists().withMessage("description is required")
    .isString().withMessage("description should  be string")
    .trim()
    .isLength({min: 2, max: 500}).withMessage("description must be at least 2 characters and max 500");

const websiteUrlValidation = body("websiteUrl")
    .exists().withMessage("websiteUrl is required")
    .isString().withMessage("websiteUrl should  be string")
    .trim()
    .isLength({min: 2, max: 100}).withMessage("websiteUrl must be at least 5 characters and max 100")
    .custom((value: string): boolean => {
        if(!URL_PATTERN.test(value)){
            throw new Error(`URL must be a valid HTTPS URL`);
        }
        return true;
    });
const createdAtValidation = body('createdAt')
    .exists().withMessage("createdAt is required")
    .isString().withMessage("createdAt should be string")
    .isISO8601({
        strict: true,        // Строгая проверка
        strictSeparator: true // Требует 'T' как разделитель
    }).withMessage("createdAt should be DateTime in ISOString")
const isMembershipValidation = body("isMembership")
    .exists().withMessage("isMembership required")
    .isBoolean().withMessage("isMembership should be boolean");

export const blogCreateInputValidation = [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
];
export const blogUpdateInputValidation = [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
];