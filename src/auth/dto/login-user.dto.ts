import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class LoginUserDto{
  
  @ApiProperty({
    example:'example@example.com',
    uniqueItems:true
    
  }) 
  @IsString()
  @IsEmail()
  email:string

  @ApiProperty({
    example:'****passwordUser****',
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