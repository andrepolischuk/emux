import {Channel} from './channel'
import {Events} from './events'
import {Auth} from './test/auth'
import {User} from './test/user'
import {onceAnimationFrame} from './test/utils'

test('create a model', () => {
  class CurrentUser extends Channel {
    displayName = User.mock.displayName
    email = User.mock.email
  }

  const user = new CurrentUser()

  expect(user).toEqual(User.mock)
})

test('update a model', async () => {
  const user = new User()
  const userFn = jest.fn()

  user.on(Events.UPDATE, userFn)

  user.displayName = User.mock.displayName
  user.email = User.mock.email

  await onceAnimationFrame()

  expect(user).toEqual(User.mock)
  expect(userFn).toHaveBeenCalledTimes(1)
})

test('update a model one-time', async () => {
  const user = new User()
  const userFn = jest.fn()

  user.once(Events.UPDATE, userFn)

  user.displayName = User.mock.displayName
  user.email = User.mock.email

  await onceAnimationFrame()

  expect(user).toEqual(User.mock)
  expect(userFn).toHaveBeenCalledTimes(1)

  delete user.displayName
  delete user.email

  await onceAnimationFrame()

  expect(user).toEqual({})
  expect(userFn).toHaveBeenCalledTimes(1)
})

test('async update a model', async () => {
  const user = new User()
  const userFn = jest.fn()

  user.on(Events.UPDATE, userFn)

  const promise = user.fetch()

  await onceAnimationFrame()

  expect(user).toEqual({fetching: true})
  expect(userFn).toHaveBeenCalledTimes(1)

  await promise
  await onceAnimationFrame()

  expect(user).toEqual({fetching: false, ...User.mock})
  expect(userFn).toHaveBeenCalledTimes(2)
})

test('create a nested model', () => {
  class CurrentUser extends User {
    displayName = User.mock.displayName
    email = User.mock.email
  }

  const auth = new Auth()

  auth.currentUser = new CurrentUser()

  expect(auth).toEqual({currentUser: User.mock})
})

test('update a nested model', async () => {
  const auth = new Auth()
  const authFn = jest.fn()
  const user = new User()
  const userFn = jest.fn()

  auth.on(Events.UPDATE, authFn)
  user.on(Events.UPDATE, userFn)

  auth.currentUser = user

  await onceAnimationFrame()

  expect(auth).toEqual({currentUser: {}})
  expect(authFn).toHaveBeenCalledTimes(1)
  expect(userFn).toHaveBeenCalledTimes(0)

  user.displayName = User.mock.displayName
  user.email = User.mock.email

  await onceAnimationFrame()

  expect(auth).toEqual({currentUser: User.mock})
  expect(authFn).toHaveBeenCalledTimes(2)
  expect(userFn).toHaveBeenCalledTimes(1)
})

test('async update a nested model', async () => {
  const auth = new Auth()
  const authFn = jest.fn()
  const userFn = jest.fn()

  auth.on(Events.UPDATE, authFn)

  const loginPromise = auth.login()

  await onceAnimationFrame()

  expect(auth).toEqual({fetching: true})
  expect(authFn).toHaveBeenCalledTimes(1)
  expect(userFn).toHaveBeenCalledTimes(0)

  await loginPromise
  await onceAnimationFrame()

  expect(auth).toEqual({fetching: false, currentUser: {}})
  expect(authFn).toHaveBeenCalledTimes(2)
  expect(userFn).toHaveBeenCalledTimes(0)

  auth.currentUser.on(Events.UPDATE, userFn)

  const fetchPromise = auth.currentUser.fetch()

  await onceAnimationFrame()

  expect(auth).toEqual({fetching: false, currentUser: {fetching: true}})
  expect(authFn).toHaveBeenCalledTimes(3)
  expect(userFn).toHaveBeenCalledTimes(1)

  await fetchPromise
  await onceAnimationFrame()

  expect(auth).toEqual({
    fetching: false,
    currentUser: {fetching: false, ...User.mock}
  })
  expect(authFn).toHaveBeenCalledTimes(4)
  expect(userFn).toHaveBeenCalledTimes(2)
})

test('trigger a custom event', async () => {
  const user = new User()
  const userFn = jest.fn()

  user.once('hello', userFn)
  user.emit('hello', 'world')

  expect(userFn).toHaveBeenCalledTimes(1)
  expect(userFn).toHaveBeenCalledWith('world')
})
