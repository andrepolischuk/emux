import {Channel} from '../channel'

export class InjectedChannel extends Channel {
  api: any

  constructor(api: any) {
    super()

    this.api = api
  }
}

export class InjectedUser extends InjectedChannel {
  fetching: boolean
  displayName: string
  email: string

  async fetch(): Promise<void> {
    this.fetching = true

    const {displayName, email} = await this.api.getCurrentUser()

    this.fetching = false
    this.displayName = displayName
    this.email = email
  }
}
