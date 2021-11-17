import { getRepository, Repository } from 'typeorm'

import { AppError } from '../../../../errors/AppError'
import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos'
import { User } from '../../entities/User'
import { IUsersRepository } from '../IUsersRepository'

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>

  constructor() {
    this.repository = getRepository(User)
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOne({
      relations: ['games'],
      where: { id: user_id },
    })

    if (!user) throw new AppError('User not found', 404)

    return user
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const users = await this.repository.query(
      'SELECT * FROM users ORDER BY first_name ASC;'
    )

    return users
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const user = await this.repository.query(
      'SELECT * FROM users WHERE lower(first_name) = $1 AND lower(last_name) = $2',
      [first_name.toLocaleLowerCase(), last_name.toLocaleLowerCase()]
    )

    return user
  }
}
