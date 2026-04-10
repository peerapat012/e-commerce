import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export const validateDto = async (dtoClass: any, body: any) => {
    const dto = plainToInstance(dtoClass, body);
    const errors = await validate(dto);

    if (errors.length > 0) {
        return errors;
    }

    return null;
};