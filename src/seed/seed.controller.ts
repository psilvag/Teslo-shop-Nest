import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorators';
import { SeedService } from './seed.service';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @ApiResponse({status:200,description:'Seed executed successfully. Data created on DataBase'})
  @ApiResponse({status:400,description:'Bad request'})
  @Get()
  //@Auth(ValidRoles.admin)
  executeSeed() {
    return this.seedService.runSeed();
  }

 
  
}
