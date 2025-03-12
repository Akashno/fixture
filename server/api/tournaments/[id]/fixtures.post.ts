import { Match } from '~/server/models/match.model'
import { Tournament } from '~/server/models/tournament.model'

export default defineEventHandler(async (event) => {
  try {
    const tournamentId = event.context.params?.id
    if (!tournamentId) {
      throw new Error('Tournament ID is required')
    }

    const tournament = await Tournament.findById(tournamentId).populate('selectedTeams')
    if (!tournament) {
      throw new Error('Tournament not found')
    }
// Delete existing matches for this tournament
    await Match.deleteMany({ tournament: tournamentId })

    const teams = tournament.selectedTeams
    const matchesOne = []
    const matchesTwo = []

    // Create single round-robin schedule
    const totalTeams = teams.length
    const rounds = totalTeams - 1
    const teamIndices = Array.from({ length: totalTeams }, (_, i) => i)

    for (let round = 0; round < rounds; round++) {
      // Rotate teams except the first one
      teamIndices.splice(1, 0, teamIndices.pop())

      // Create matches for this round
      for (let match = 0; match < totalTeams / 2; match++) {
        const homeTeamIndex = teamIndices[match]
        const awayTeamIndex = teamIndices[totalTeams - 1 - match]

        const match1 = new Match({
          tournament: tournamentId,
          homeTeam: teams[homeTeamIndex]._id,
          awayTeam: teams[awayTeamIndex]._id,
          status: 'scheduled',
          round: round + 1
        })

        const match2 = new Match({
          tournament: tournamentId,
          homeTeam: teams[awayTeamIndex]._id,
          awayTeam: teams[homeTeamIndex]._id,
          status: 'scheduled',
          round: rounds + round + 1 
        })


        matchesOne.push(match1)
        matchesTwo.push(match2)
      }
    }

    // Save all matches
    // Sort matches by round number
    const sortedMatches = [...matchesOne, ...matchesTwo].sort((a, b) => a.round - b.round);
    const savedMatches = await Match.insertMany(sortedMatches);
    sortedMatches.forEach(match=>{
      console.log(match.round)
    })

    // Update tournament with match references
    tournament.matches = savedMatches.map(match => match._id)
    await tournament.save()

    return {
      success: true,
      matches: savedMatches
    }
  } catch (error) {
    console.error('Error generating fixtures:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to generate fixtures'
    })
  }
})