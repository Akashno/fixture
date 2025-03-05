import { Team } from '~/server/models/team.model'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    const deletedTeam = await Team.findByIdAndDelete(id)
    
    if (!deletedTeam) {
      throw createError({
        statusCode: 404,
        message: 'Team not found'
      })
    }

    return {
      success: true,
      data: deletedTeam
    }
  } catch (error: any) {
    console.error('Server error:', error)
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})