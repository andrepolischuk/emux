# Modelly

Event-driven data models for a business logic independent of the UI

- Framework agnostic: manage a data outside of UI, you don’t need to touch the UI to run change-dependent logic, for example with React hooks
- Decentralized: split a business logic before components, modules or chunks
- Boilerplate-free: describe the data and flow of working with them

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
import {Channel, Events} from 'modelly'
import * as api from './api'

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

currentUser.on(Events.UPDATE, () => {
  // currentUser is fetched
  // {displayName: '...', email: '...'}
})

currentUser.fetch()
```

## Contributing

### Dev environment

#### Start

To start development you need install `yarn` and deps:

```sh
yarn install
```

#### Testing

We have a test suite consisting of a bunch of unit tests to verify utils keep working as expected. Test suit is run in CI on every commit.

To run tests:

```sh
yarn test
```

To run tests in watch mode:

```sh
yarn test:watch
```

#### Code quality

To run linting the codebase:

```sh
yarn lint
```

To check typings:

```sh
yarn typecheck
```

To check bundle size:

```sh
yarn sizecheck
```

### Publish

To bump version of changed packages and generate changelog run:

```sh
yarn release
```

## License

MIT
