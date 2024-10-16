import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from '../services/users.service';
import { CreateUserDto } from '../dto/user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1' },
          name: { type: 'string', example: 'Afonso Gouveia' },
          cpf: { type: 'string', example: '333.333.333-12' },
          phoneNumber: { type: 'string', example: '+55 19 99898-1616' },
          dateOfBirth: { type: 'string', example: '1990-01-01T00:00:00.000Z' },
          accountType: { type: 'string', example: 'savings' },
        },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findAll() {
    return this.userService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid input data.' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing user by ID' })
  @ApiParam({ name: 'id', description: 'ID of the user to update' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid input data.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'ID of the user to delete' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id') userId: string) {
    return this.userService.deleteUser(userId);
  }

  @Get('account')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Retrieve the account information of the logged-in user',
  })
  @ApiResponse({
    status: 200,
    description: 'Account information retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '1' },
        accountNumber: { type: 'string', example: '123456789' },
        agencyNumber: { type: 'string', example: '0001' },
        balance: { type: 'string', example: '$1,000.00' },
        type: { type: 'string', example: 'savings' },
        User: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Afonso Gouveia' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Account not found for this user' })
  async getByUser(@Req() request) {
    const userId = request.user.userId;
    return this.userService.getAccountByUserId(userId);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Retrieve the account information of the logged-in user',
  })
  @ApiResponse({
    status: 200,
    description: 'Account information retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '1' },
        accountNumber: { type: 'string', example: '123456789' },
        agencyNumber: { type: 'string', example: '0001' },
        balance: { type: 'string', example: '$1,000.00' },
        type: { type: 'string', example: 'savings' },
        User: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Afonso Gouveia' },
            cpf: { type: 'string', example: '333.333.333-12' },
            phoneNumber: { type: 'string', example: '+55 19 99898-1616' },
            dateOfBirth: {
              type: 'string',
              example: '1990-01-01T00:00:00.000Z',
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Account not found for this user' })
  async getAccount(@Req() request) {
    const userId = request.user.userId;
    return this.userService.getByUser(userId);
  }
}
