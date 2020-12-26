export class UserDto {
  _id: string;
  email: string;
  avatar: string;
  bio?: string;
  username: string;
  password: string;
}

export class CreateUserDto {
  email: string;
  avatar: string;
  bio?: string;
  username: string;
  password: string;
}
