import {IsEmail, IsNotEmpty, MinLength} from "class-validator"

class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsNotEmpty()
    name!: string;

    @IsNotEmpty()
    @MinLength(8)
    password!: string;
}

export default CreateUserDto