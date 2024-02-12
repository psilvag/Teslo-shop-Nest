import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class CreateUserDto{
  
  @ApiProperty({
    example:'Names and Last names',
  }) 
  @IsString()
  @MinLength(1)
  fullName:string  
  
  @ApiProperty({
    example:'example@example.com',
  }) 
  @IsString()
  @IsEmail()
  email:string
  
  @ApiProperty({
    example:'********userpASSWORD******',
  })   
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,{
    message:'The password must have an Uppercase, lowecase letters and numbers' 
  })
  password:string   
}