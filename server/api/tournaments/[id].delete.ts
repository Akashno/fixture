import { Tournament } from '~/server/models/tournament.model'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    const deletedTournament = await Tournament.findByIdAndDelete(id)
    
    if (!deletedTournament) {
      throw createError({
        statusCode: 404,
        message: 'Tournament not found'
      })
    }

    return {
      success: true,
      data: deletedTournament
    }
  } catch (error: any) {
    console.error('Server error:', error)
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})