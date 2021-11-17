import { getRepository, Repository } from 'typeorm'

import { User } from '../../../users/entities/User'
import { Game } from '../../entities/Game'
import { IGamesRepository } from '../IGamesRepository'

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>

  constructor() {
    this.repository = getRepository(Game)
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder()
      .select('*')
      .where('lower(title) like :title', { title: `%${param.toLowerCase()}%` })
      .execute()

    return games
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const count = await this.repository.query('SELECT COUNT(*) FROM games;')

    return count
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const users = await this.repository
      .createQueryBuilder('g')
      .select('u.*')
      .innerJoin('users_games_games', 'ugg', 'ugg.gamesId = g.id')
      .innerJoin('users', 'u', 'u.id = ugg.usersId')
      .where('g.id = :id', { id })
      .execute()

    return users
  }
}
