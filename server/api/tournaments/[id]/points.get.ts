import { Tournament } from '~/server/models/tournament.model'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    const tournament = await Tournament.findById(id)
      .populate('selectedTeams')
      .populate('teamStats.team')
    
    if (!tournament) {
      throw createError({
        statusCode: 404,
        message: 'Tournament not found'
      })
    }

    // Calculate run rates and sort teams by points and NRR
    const sortedStats = tournament.teamStats.map(stat => {
      const teamRunRate = stat.oversFaced > 0 ? stat.runsScored / stat.oversFaced : 0
      const oppositionRunRate = stat.oversBowled > 0 ? stat.runsConceded / stat.oversBowled : 0
      const netRunRate = teamRunRate - oppositionRunRate

      return {
        ...stat.toObject(),
        teamRunRate: Number(teamRunRate.toFixed(2)),
        oppositionRunRate: Number(oppositionRunRate.toFixed(2)),
        netRunRate: Number(netRunRate.toFixed(2))
      }
    }).sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points
      }
      // If points are equal, sort by net run rate
      return b.netRunRate - a.netRunRate
    })

    return {
      success: true,
      data: sortedStats
    }
  } catch (error: any) {
    console.error('Error fetching points table:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch points table'
    })
  }
})