import { Team } from '~/server/models/team.model'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    const team = new Team(body)
    await team.save()
    
    return {
      success: true,
      data: team
    }
  } catch (error: any) {
    // Handle validation/client errors (400)
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      throw createError({
        statusCode: 400,
        message: error.message
      })
    }
    
    // Handle all other server errors (500)
    console.error('Server error:', error)
    throw createError({
      statusCode: 500,
      message:error.message
    })
  }
})