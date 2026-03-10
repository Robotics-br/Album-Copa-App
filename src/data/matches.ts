export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  time: string;
  venue?: string;
  group?: string;
}

export const matches: Match[] = [
  { id: '1', homeTeamId: 'eua', awayTeamId: 'can', date: '2026-06-11', time: '19:00', venue: 'SoFi Stadium', group: 'A' },
  { id: '2', homeTeamId: 'mex', awayTeamId: 'ale', date: '2026-06-11', time: '22:00', venue: 'Estadio Azteca', group: 'B' },
  { id: '3', homeTeamId: 'arg', awayTeamId: 'ing', date: '2026-06-12', time: '16:00', venue: 'MetLife Stadium', group: 'C' },
  { id: '4', homeTeamId: 'bra', awayTeamId: 'por', date: '2026-06-12', time: '19:00', venue: 'SoFi Stadium', group: 'D' },
  { id: '5', homeTeamId: 'fra', awayTeamId: 'esp', date: '2026-06-12', time: '22:00', venue: 'Mercedes-Benz Stadium', group: 'E' },
  { id: '6', homeTeamId: 'eua', awayTeamId: 'mex', date: '2026-06-13', time: '19:00', venue: 'AT&T Stadium', group: 'A' },
  { id: '7', homeTeamId: 'can', awayTeamId: 'ale', date: '2026-06-14', time: '16:00', venue: 'BC Place', group: 'B' },
  { id: '8', homeTeamId: 'arg', awayTeamId: 'bra', date: '2026-06-14', time: '19:00', venue: 'MetLife Stadium', group: 'C' },
  { id: '9', homeTeamId: 'ing', awayTeamId: 'por', date: '2026-06-14', time: '22:00', venue: 'Lincoln Financial Field', group: 'D' },
  { id: '10', homeTeamId: 'fra', awayTeamId: 'ale', date: '2026-06-15', time: '16:00', venue: 'Hard Rock Stadium', group: 'E' },
  { id: '11', homeTeamId: 'esp', awayTeamId: 'bra', date: '2026-06-15', time: '19:00', venue: 'NRG Stadium', group: 'E' },
  { id: '12', homeTeamId: 'mex', awayTeamId: 'can', date: '2026-06-16', time: '19:00', venue: 'Estadio BBVA', group: 'A' },
  { id: '13', homeTeamId: 'eua', awayTeamId: 'ing', date: '2026-06-16', time: '22:00', venue: 'SoFi Stadium', group: 'C' },
  { id: '14', homeTeamId: 'arg', awayTeamId: 'por', date: '2026-06-17', time: '16:00', venue: 'Gillette Stadium', group: 'D' },
  { id: '15', homeTeamId: 'bra', awayTeamId: 'fra', date: '2026-06-17', time: '19:00', venue: "Levi's Stadium", group: 'E' },
  { id: '16', homeTeamId: 'ale', awayTeamId: 'esp', date: '2026-06-18', time: '16:00', venue: 'Arrowhead Stadium', group: 'B' },
  { id: '17', homeTeamId: 'can', awayTeamId: 'eua', date: '2026-06-18', time: '19:00', venue: 'Lumen Field', group: 'A' },
  { id: '18', homeTeamId: 'ing', awayTeamId: 'arg', date: '2026-06-19', time: '19:00', venue: 'MetLife Stadium', group: 'C' },
  { id: '19', homeTeamId: 'por', awayTeamId: 'bra', date: '2026-06-19', time: '22:00', venue: 'AT&T Stadium', group: 'D' },
  { id: '20', homeTeamId: 'mex', awayTeamId: 'eua', date: '2026-06-20', time: '22:00', venue: 'Estadio Azteca', group: 'A' },
  { id: '21', homeTeamId: 'ale', awayTeamId: 'fra', date: '2026-06-21', time: '16:00', venue: 'Mercedes-Benz Stadium', group: 'B' },
  { id: '22', homeTeamId: 'esp', awayTeamId: 'arg', date: '2026-06-22', time: '19:00', venue: 'Hard Rock Stadium', group: 'C' },
  { id: '23', homeTeamId: 'bra', awayTeamId: 'arg', date: '2026-06-25', time: '16:00', venue: 'MetLife Stadium', group: 'Oitavas' },
  { id: '24', homeTeamId: 'fra', awayTeamId: 'ing', date: '2026-06-26', time: '19:00', venue: 'SoFi Stadium', group: 'Oitavas' },
  { id: '25', homeTeamId: 'ale', awayTeamId: 'por', date: '2026-06-27', time: '16:00', venue: 'NRG Stadium', group: 'Oitavas' },
  { id: '26', homeTeamId: 'eua', awayTeamId: 'esp', date: '2026-06-28', time: '19:00', venue: 'AT&T Stadium', group: 'Oitavas' },
  { id: '27', homeTeamId: 'bra', awayTeamId: 'fra', date: '2026-07-02', time: '19:00', venue: 'SoFi Stadium', group: 'Quartas' },
  { id: '28', homeTeamId: 'arg', awayTeamId: 'ale', date: '2026-07-03', time: '19:00', venue: 'MetLife Stadium', group: 'Quartas' },
  { id: '29', homeTeamId: 'bra', awayTeamId: 'arg', date: '2026-07-14', time: '15:00', venue: 'MetLife Stadium', group: 'Final' },
];

export function getUniqueDates(matchesList: Match[]): string[] {
  const set = new Set(matchesList.map((m) => m.date));
  return Array.from(set).sort();
}

export function getMatchesByTeam(matchesList: Match[], teamId: string): Match[] {
  return matchesList.filter((m) => m.homeTeamId === teamId || m.awayTeamId === teamId);
}

export function getMatchesByDate(matchesList: Match[], date: string): Match[] {
  return matchesList.filter((m) => m.date === date);
}
