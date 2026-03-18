import axios from 'axios';
import type { Match } from '../data/matches';

interface OpenLigaResult {
  resultID: number;
  resultName: string;
  pointsTeam1: number;
  pointsTeam2: number;
  resultOrderID: number;
  resultTypeID: number;
  resultDescription: string;
}

interface OpenLigaMatch {
  matchID: number;
  matchDateTime: string;
  matchDateTimeUTC: string;
  matchIsFinished: boolean;
  team1: {
    shortName: string;
    teamName: string;
  };
  team2: {
    shortName: string;
    teamName: string;
  };
  group: {
    groupName: string;
  };
  matchResults: OpenLigaResult[];
}

const API_TEAM_MAPPING: Record<string, string> = {
  MEX: 'mex',
  RSA: 'afs',
  KOR: 'cds',
  CZE: 'cze',
  CAN: 'can',
  ITA: 'ita',
  QAT: 'qat',
  CHE: 'sui',
  BRA: 'bra',
  MAR: 'mar',
  HTI: 'hai',
  SCT: 'esc',
  USA: 'eua',
  PAR: 'par',
  AUS: 'aus',
  TUR: 'tur',
  DEU: 'ale',
  CIV: 'cmf',
  ECU: 'ecu',
  NLD: 'hol',
  JPN: 'jap',
  UKR: 'ucr',
  TUN: 'tun',
  BEL: 'bel',
  EGY: 'egi',
  IRN: 'ira',
  NZL: 'nzl',
  ESP: 'esp',
  CPV: 'cpv',
  SAU: 'ars',
  URY: 'uru',
  FRA: 'fra',
  SEN: 'sen',
  BOL: 'bol',
  NOR: 'nor',
  ARG: 'arg',
  DZA: 'alg',
  AUT: 'aut',
  JOR: 'jor',
  PRT: 'por',
  COD: 'rdc',
  UZB: 'uzb',
  COL: 'col',
  ENG: 'ing',
  HRV: 'cro',
  GHA: 'gha',
  PAN: 'pan',
  CUW: 'cuw',
  // Playoff / Placeholder teams
  'UEFA-A': 'uefa_a',
  'UEFA-B': 'uefa_b',
  'UEFA-C': 'uefa_c',
  'UEFA-D': 'uefa_d',
  'FIFA-1': 'fifa_1',
  'FIFA-2': 'fifa_2',
};

export async function fetchWorldCupMatches(): Promise<Match[]> {
  try {
    const response = await axios.get<OpenLigaMatch[]>(
      'https://www.openligadb.de/api/getmatchdata/wm26/2026'
    );
    const data = response.data;

    return data.map((m) => {
      const utcDate = new Date(m.matchDateTimeUTC);
      const date = utcDate.toISOString().split('T')[0];
      const time =
        utcDate.getUTCHours().toString().padStart(2, '0') +
        ':' +
        utcDate.getUTCMinutes().toString().padStart(2, '0');

      // Tenta encontrar o resultado final (TypeID 2)
      const finalResult = m.matchResults.find((r) => r.resultTypeID === 2);

      return {
        id: m.matchID.toString(),
        homeTeamId: API_TEAM_MAPPING[m.team1.shortName] || m.team1.shortName.toLowerCase(),
        awayTeamId: API_TEAM_MAPPING[m.team2.shortName] || m.team2.shortName.toLowerCase(),
        homeScore: finalResult?.pointsTeam1,
        awayScore: finalResult?.pointsTeam2,
        isFinished: m.matchIsFinished,
        date,
        time,
        group: m.group.groupName,
      };
    });
  } catch (error) {
    throw error;
  }
}
