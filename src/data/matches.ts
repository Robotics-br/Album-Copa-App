export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  isFinished?: boolean;
  date: string;
  time: string;
  venue?: string;
  group?: string;
}

export const matches: Match[] = [];

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
