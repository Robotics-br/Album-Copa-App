import type { Team, Sticker } from '../types';

export const teams: Team[] = [
  { id: 'bra', name: 'Brasil', flag: '🇧🇷', code: 'BRA' },
  { id: 'arg', name: 'Argentina', flag: '🇦🇷', code: 'ARG' },
  { id: 'fra', name: 'França', flag: '🇫🇷', code: 'FRA' },
  { id: 'ale', name: 'Alemanha', flag: '🇩🇪', code: 'ALE' },
  { id: 'ing', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', code: 'ING' },
  { id: 'esp', name: 'Espanha', flag: '🇪🇸', code: 'ESP' },
  { id: 'por', name: 'Portugal', flag: '🇵🇹', code: 'POR' },
  { id: 'eua', name: 'EUA', flag: '🇺🇸', code: 'EUA' },
  { id: 'mex', name: 'México', flag: '🇲🇽', code: 'MEX' },
  { id: 'can', name: 'Canadá', flag: '🇨🇦', code: 'CAN' },
];

type PlayerDef = [string, 'GOL' | 'DEF' | 'MEI' | 'ATA'];

const squads: Record<string, PlayerDef[]> = {
  bra: [
    ['Alisson', 'GOL'], ['Ederson', 'GOL'],
    ['Marquinhos', 'DEF'], ['Militão', 'DEF'], ['Bremer', 'DEF'],
    ['Casemiro', 'MEI'], ['Bruno Guimarães', 'MEI'], ['Paquetá', 'MEI'],
    ['Rodrygo', 'ATA'], ['Vinícius Jr.', 'ATA'], ['Endrick', 'ATA'],
  ],
  arg: [
    ['E. Martínez', 'GOL'], ['Rulli', 'GOL'],
    ['Otamendi', 'DEF'], ['Romero', 'DEF'], ['Molina', 'DEF'],
    ['De Paul', 'MEI'], ['Mac Allister', 'MEI'], ['Lo Celso', 'MEI'],
    ['Messi', 'ATA'], ['Álvarez', 'ATA'], ['Lautaro', 'ATA'],
  ],
  fra: [
    ['Maignan', 'GOL'], ['Samba', 'GOL'],
    ['Upamecano', 'DEF'], ['Saliba', 'DEF'], ['T. Hernández', 'DEF'],
    ['Tchouaméni', 'MEI'], ['Camavinga', 'MEI'], ['Griezmann', 'MEI'],
    ['Mbappé', 'ATA'], ['Dembélé', 'ATA'], ['Thuram', 'ATA'],
  ],
  ale: [
    ['Neuer', 'GOL'], ['Ter Stegen', 'GOL'],
    ['Rüdiger', 'DEF'], ['Schlotterbeck', 'DEF'], ['Kimmich', 'DEF'],
    ['Musiala', 'MEI'], ['Wirtz', 'MEI'], ['Gündoğan', 'MEI'],
    ['Havertz', 'ATA'], ['Sané', 'ATA'], ['Füllkrug', 'ATA'],
  ],
  ing: [
    ['Pickford', 'GOL'], ['Ramsdale', 'GOL'],
    ['Stones', 'DEF'], ['Guehi', 'DEF'], ['Walker', 'DEF'],
    ['Rice', 'MEI'], ['Bellingham', 'MEI'], ['Foden', 'MEI'],
    ['Saka', 'ATA'], ['Palmer', 'ATA'], ['Kane', 'ATA'],
  ],
  esp: [
    ['Unai Simón', 'GOL'], ['Raya', 'GOL'],
    ['Carvajal', 'DEF'], ['Laporte', 'DEF'], ['Cucurella', 'DEF'],
    ['Pedri', 'MEI'], ['Rodri', 'MEI'], ['Gavi', 'MEI'],
    ['Olmo', 'ATA'], ['Yamal', 'ATA'], ['Morata', 'ATA'],
  ],
  por: [
    ['Diogo Costa', 'GOL'], ['Rui Patrício', 'GOL'],
    ['Rúben Dias', 'DEF'], ['Pepe', 'DEF'], ['Cancelo', 'DEF'],
    ['B. Silva', 'MEI'], ['Bruno Fernandes', 'MEI'], ['Vitinha', 'MEI'],
    ['Rafael Leão', 'ATA'], ['Ronaldo', 'ATA'], ['Félix', 'ATA'],
  ],
  eua: [
    ['Turner', 'GOL'], ['Horvath', 'GOL'],
    ['Robinson', 'DEF'], ['Ream', 'DEF'], ['Dest', 'DEF'],
    ['Adams', 'MEI'], ['McKennie', 'MEI'], ['Musah', 'MEI'],
    ['Pulisic', 'ATA'], ['Weah', 'ATA'], ['Reyna', 'ATA'],
  ],
  mex: [
    ['Ochoa', 'GOL'], ['Cota', 'GOL'],
    ['Montes', 'DEF'], ['Vásquez', 'DEF'], ['Arteaga', 'DEF'],
    ['Álvarez', 'MEI'], ['Romo', 'MEI'], ['Chávez', 'MEI'],
    ['Lozano', 'ATA'], ['Jiménez', 'ATA'], ['Sánchez', 'ATA'],
  ],
  can: [
    ['Borjan', 'GOL'], ['Crépeau', 'GOL'],
    ['Johnston', 'DEF'], ['Miller', 'DEF'], ['Cornelius', 'DEF'],
    ['Eustáquio', 'MEI'], ['Koné', 'MEI'], ['Buchanan', 'MEI'],
    ['David', 'ATA'], ['Larin', 'ATA'], ['Davies', 'ATA'],
  ],
};

function buildStickers(): Sticker[] {
  const result: Sticker[] = [];
  let id = 1;

  for (const team of teams) {
    result.push({
      id: id++,
      code: `${team.code}00`,
      name: `Escudo ${team.name}`,
      teamId: team.id,
      type: 'badge',
    });

    result.push({
      id: id++,
      code: `${team.code}01`,
      name: `Seleção ${team.name}`,
      teamId: team.id,
      type: 'team_photo',
    });

    const squad = squads[team.id] ?? [];
    for (const [playerName, position] of squad) {
      result.push({
        id: id++,
        code: `${team.code}${String(id).padStart(3, '0')}`,
        name: playerName,
        teamId: team.id,
        type: 'player',
        position,
      });
    }
  }

  let seqId = 1;
  for (const s of result) {
    s.id = seqId;
    s.code = `${teams.find((t) => t.id === s.teamId)!.code}${String(seqId).padStart(3, '0')}`;
    seqId++;
  }

  return result;
}

export const stickers: Sticker[] = buildStickers();
export const totalStickers = stickers.length;

export function getStickersByTeam(teamId: string): Sticker[] {
  return stickers.filter((s) => s.teamId === teamId);
}

export function getTeamById(teamId: string): Team | undefined {
  return teams.find((t) => t.id === teamId);
}

export function getStickerById(id: number): Sticker | undefined {
  return stickers.find((s) => s.id === id);
}
