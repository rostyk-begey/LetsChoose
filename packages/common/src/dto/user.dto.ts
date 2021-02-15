export abstract class UserDto {
  _id: string;
  email: string;
  avatar: string;
  bio?: string;
  username: string;
  password: string;
}

export abstract class CreateUserDto {
  email: string;
  avatar: string;
  bio?: string;
  username: string;
  password: string;
}
