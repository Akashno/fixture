import { Tournament } from '~/server/models/tournament.model'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate required fields
    if (!body.name || !body.selectedTeams || !Array.isArray(body.selectedTeams) || body.selectedTeams.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'Name and selected teams are required'
      })
    }

    // Create new tournament
    const tournament = await Tournament.create({
      name: body.name,
      selectedTeams: body.selectedTeams
    })

    // Populate teams data
    const populatedTournament = await tournament.populate('selectedTeams')

    return {
      statusCode: 201,
      data: populatedTournament
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create tournament'
    })
  }
})