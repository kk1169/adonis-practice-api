/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import AuthController from 'App/Controllers/Http/AuthController'
import CategoriesController from 'App/Controllers/Http/CategoriesController'

Route.group(() => {
  Route.get('/', async () => {
    return { hello: 'world' }
  })

  Route.post('/register', new AuthController().register)
  Route.post('/login', new AuthController().login)

  Route.group(() => {
    Route.post('/logout', new AuthController().logout)

    // begin:: category
    Route.get('/category', new CategoriesController().index)
    Route.post('/category/upload', new CategoriesController().upload)
    Route.get('/category/:id', new CategoriesController().show)
    Route.post('/category', new CategoriesController().store)
    Route.put('/category/:id', new CategoriesController().update)
    Route.delete('/category/:id', new CategoriesController().destroy)

    // auth end
  }).middleware('auth:api')

  // end:: category
}).prefix('/api')
