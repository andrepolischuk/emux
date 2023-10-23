import {Channel} from '../channel'
import {User} from './user'

export class Auth extends Channel {
  fetching: boolean
  currentUser: User

  login(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.fetching = true
      setTimeout(() => {
        this.fetching = false
        this.currentUser = new User()
        resolve()
      }, 100)
    })
  }
}
