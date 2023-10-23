# Modelly

Event-driven data models

## Install

```sh
npm install modelly
```

or

```sh
yarn add modelly
```

## Usage

```ts
import {Channel} from 'modelly'
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

currentUser.listen(() => {
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
