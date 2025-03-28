import { Match } from '../models/match.model'
import { Tournament } from '../models/tournament.model'

export async function updateTournamentStats(tournamentId: string) {
  const tournament = await Tournament.findById(tournamentId)
  if (!tournament) {
    throw new Error('Tournament not found')
  }

  // Get all completed matches for this tournament
  const matches = await Match.find({
    tournament: tournamentId,
    status: 'completed'
  }).populate('homeTeam awayTeam winner')

  // Initialize team stats
  const teamStats = new Map()
  tournament.selectedTeams.forEach(teamId => {
    teamStats.set(teamId.toString(), {
      team: teamId,
      points: 0,
      matchesPlayed: 0,
      matchesWon: 0,
      matchesLost: 0,
      matchesDrawn: 0,
      runsScored: 0,
      wicketsTaken: 0,
      oversFaced: 0,
      oversBowled: 0,
      runsConceded: 0
    })
  })

  // Calculate stats from matches
  matches.forEach(match => {
    const homeTeamId = match.homeTeam._id.toString()
    const awayTeamId = match.awayTeam._id.toString()
    const homeStats = teamStats.get(homeTeamId)
    const awayStats = teamStats.get(awayTeamId)

    // Update matches played
    homeStats.matchesPlayed++
    awayStats.matchesPlayed++

    // Update runs, wickets, and overs
    if (match.homeScore) {
      homeStats.runsScored += match.homeScore.runs || 0
      awayStats.wicketsTaken += match.homeScore.wickets || 0
      awayStats.oversBowled += match.homeScore.overs || 0
      homeStats.oversFaced += match.homeScore.overs || 0
      console.log(`Home team ${homeTeamId} oversFaced updated: ${homeStats.oversFaced} (added ${match.homeScore.overs || 0})`)
      awayStats.runsConceded += match.homeScore.runs || 0
    }
    if (match.awayScore) {
      awayStats.runsScored += match.awayScore.runs || 0
      homeStats.wicketsTaken += match.awayScore.wickets || 0
      homeStats.oversBowled += match.awayScore.overs || 0
      awayStats.oversFaced += match.awayScore.overs || 0
      console.log(`Away team ${awayTeamId} oversFaced updated: ${awayStats.oversFaced} (added ${match.awayScore.overs || 0})`)
      homeStats.runsConceded += match.awayScore.runs || 0
    }

    // Update match results and points
    if (match.winner) {
      const winnerId = match.winner._id.toString()
      const winnerStats = teamStats.get(winnerId)
      const loserStats = teamStats.get(
        winnerId === homeTeamId ? awayTeamId : homeTeamId
      )

      winnerStats.matchesWon++
      winnerStats.points += 2 // 2 points for a win
      loserStats.matchesLost++
    } else {
      // Match drawn
      homeStats.matchesDrawn++
      awayStats.matchesDrawn++
      homeStats.points += 1 // 1 point for a draw
      awayStats.points += 1
    }
  })

  // Update tournament with new stats
  tournament.teamStats = Array.from(teamStats.values())
  
  console.log('Team stats before saving:', tournament.teamStats)
  await tournament.save({ validateBeforeSave: true })
  console.log('Team stats after saving:', tournament.teamStats)

  return tournament.teamStats
}