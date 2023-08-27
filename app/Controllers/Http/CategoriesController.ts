import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'

export default class CategoriesController {
  public async index({ response }: HttpContextContract) {
    const category = await Category.all()

    const data = {
      data: category,
      status: true,
    }

    return response.status(201).json(data)
  }

  public async store({ request, response }: HttpContextContract) {
    const { title } = request.body()

    const categorySchema = schema.create({
      title: schema.string({ trim: true }, [rules.minLength(4)]),
    })

    const categorySchemaMessages = {
      required: 'The {{ field }} is required.',
    }

    try {
      const payload = await request.validate({
        schema: categorySchema,
        messages: categorySchemaMessages,
      })

      const category = new Category()
      category.title = title
      category.save()

      const data = {
        data: category,
        status: true,
        message: 'Category created successfull.',
      }

      return response.status(201).json(data)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async show({}: HttpContextContract) {}

  public async update({ request, response }: HttpContextContract) {
    const { title } = request.body()

    const category = await Category.findOrFail(request.param('id'))
    category.title = title
    category.save()

    const data = {
      data: category,
      status: true,
      message: 'Category updated successfull.',
    }

    return response.status(200).json(data)
  }

  public async upload({ request }: HttpContextContract) {
    const coverImage = request.file('cover_image')

    if (coverImage) {
      await coverImage.move(Application.tmpPath('uploads'))
    }
  }

  public async destroy({}: HttpContextContract) {}
}
