import { Team } from '~/server/models/team.model'

export default defineEventHandler(async (event) => {
  try {
    const teams = await Team.find().lean()
    
    return teams
  } catch (error: any) {
    console.error('Server error:', error)
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})