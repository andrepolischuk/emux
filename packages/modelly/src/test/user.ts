import {Channel} from '../channel'

export class User extends Channel {
  static mock = {
    displayName: 'Edsger',
    email: 'edsger@mail.com'
  }

  fetching: boolean
  displayName: string
  email: string

  fetch(): Promise<void> {
    this.fetching = true

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.displayName = User.mock.displayName
        this.email = User.mock.email
        this.fetching = false
        resolve()
      }, 100)
    })
  }
}
