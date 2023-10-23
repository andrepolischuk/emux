# Modelly

Event-driven data models for a business logic independent of the UI

## Install

```sh
npm install modelly
```

or

```sh
yarn add modelly
```

## Usage

### Base example

```ts
import {Channel} from 'modelly'
import {api} from './api'

class User extends Channel {
  displayName?: string
  email?: string

  async fetch() {
    const {displayName, email} = await api.getCurrentUser()
    this.displayName = displayName
    this.email = email
  }
}

const currentUser = new User()

currentUser.on('update', () => {
  // current user is fetched {displayName: '...', email: '...'}
})

currentUser.fetch()
```

### Nested models

```ts
import {Channel} from 'modelly'

class User extends Channel {
  displayName: string
  email: string

  async fetch() {
    const {displayName, email} = await api.getCurrentUser()
    this.displayName = displayName
    this.email = email
  }
}

class Auth extends Channel {
  currentUser: User

  async login(credentials) {
    await api.createSession(credentials)
    this.currentUser = new User()
    this.currentUser.fetch()
  }
}

const auth = new Auth()

auth.on('update', () => {
  // session is created {currentUser: {}}
  // current user is fetched {currentUser: {displayName: '...', email: '...'}}
})

auth.login({email: '...', password: '...'})
```

### Custom events

```ts
import {Channel} from 'modelly'

interface User {
  displayName: string
  email: string
}

class Auth extends Channel {
  currentUser: User

  async login(credentials) {
    this.currentUser = await api.createSession(credentials)
    this.emit('login')
  }
}

interface Book {
  title: string
}

class Books extends Channel {
  books: Book[]

  fetch = () => {
    this.books = await api.getBooks(credentials)
  }
}

const auth = new Auth()
const books = new Books()

auth.on('login', books.fetch)

auth.on('update', () => {
  // render auth in header
})

books.on('update', () => {
  // render books list
})

auth.login({email: '...', password: '...'})
```

### Extend a channel

Example using dependency injection – API service into a model

```ts
import {Channel} from 'modelly'
import {api, ApiService} from './api'

class InjectedChannel extends Channel {
  api: ApiService

  constructor(api: ApiService) {
    super()

    this.api = api
  }
}

class User extends InjectedChannel {
  displayName?: string
  email?: string

  async fetch() {
    const {displayName, email} = await this.api.getCurrentUser()
    this.displayName = displayName
    this.email = email
  }
}

const currentUser = new User(api)

currentUser.on('update', () => {
  // current user is fetched {displayName: '...', email: '...'}
})

currentUser.fetch()
```

## License

MIT
