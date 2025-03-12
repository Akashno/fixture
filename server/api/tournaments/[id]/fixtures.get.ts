import { Match } from '~/server/models/match.model'
import { Tournament } from '~/server/models/tournament.model'

export default defineEventHandler(async (event) => {
  try {
    const tournamentId = event.context.params?.id
    if (!tournamentId) {
      throw createError({
        statusCode: 400,
        message: 'Tournament ID is required'
      })
    }

    const tournament = await Tournament.findById(tournamentId)
    if (!tournament) {
      throw createError({
        statusCode: 404,
        message: 'Tournament not found'
      })
    }

    // Fetch matches and populate team details
    const matches = await Match.find({ tournament: tournamentId })
      .populate('homeTeam')
      .populate('awayTeam')
      .sort({  round: 1 })

    return {
      success: true,
      data:[...matches]
    }
  } catch (error: any) {
    console.error('Error fetching fixtures:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch fixtures'
    })
  }
})