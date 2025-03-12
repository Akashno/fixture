import { Tournament } from '~/server/models/tournament.model'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    const tournament = await Tournament.findById(id).populate('selectedTeams')
    
    if (!tournament) {
      throw createError({
        statusCode: 404,
        message: 'Tournament not found'
      })
    }

    return tournament
  } catch (error: any) {
    console.error('Error fetching tournament:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch tournament'
    })
  }
})