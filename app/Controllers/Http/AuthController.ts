import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
  // Login
  public async login({ request, response, auth }: HttpContextContract) {
    const { email, password } = request.body()

    const loginSchema = schema.create({
      email: schema.string({ trim: true }, [rules.email()]),
      password: schema.string({ trim: true }, [rules.minLength(6)]),
    })

    const loginSchemaMessages = {
      required: 'The {{ field }} is required.',
    }

    await request.validate({
      schema: loginSchema,
      messages: loginSchemaMessages,
    })

    try {
      const token = await auth.use('api').attempt(email, password)
      const data = {
        data: token,
        status: true,
      }
      return response.status(200).json(data)
    } catch (error) {
      const data = {
        error: 'Invalid credentials',
        status: false,
      }
      return response.unauthorized(data)
    }
  }

  // Register
  public async register({ request, response }: HttpContextContract) {
    const { name, email, password } = request.body()

    const userSchema = schema.create({
      name: schema.string({ trim: true }, [rules.minLength(4)]),
      email: schema.string({ trim: true }, [rules.email()]),
      password: schema.string({ trim: true }, [rules.minLength(6)]),
    })

    const userSchemaMessages = {
      required: 'The {{ field }} is required.',
    }

    await request.validate({
      schema: userSchema,
      messages: userSchemaMessages,
    })

    const user = new User()
    user.name = name
    user.email = email
    user.password = password
    user.save()

    const data = {
      data: user,
      status: true,
      message: 'User created successfully.',
    }

    return response.status(201).json(data)
  }

  // Logout
  public async logout({ auth }: HttpContextContract) {
    await auth.use('api').revoke()
    return {
      revoked: true,
    }
  }
}
