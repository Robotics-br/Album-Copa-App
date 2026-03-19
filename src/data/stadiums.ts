export type StadiumLicense = 'CC0' | 'CC BY 2.0' | 'CC BY 3.0' | 'CC BY-SA 4.0';

export const licenseUrls: Record<StadiumLicense, string> = {
  CC0: 'https://creativecommons.org/public-domain/cc0/',
  'CC BY 2.0': 'https://creativecommons.org/licenses/by/2.0/deed.pt-br',
  'CC BY 3.0': 'https://creativecommons.org/licenses/by/3.0/deed.pt-br',
  'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/deed.pt-br',
};

export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: string;
  countryFlag: string;
  countryKey: string;
  capacity: string;
  opened?: string;
  image: any;
  author?: string;
  license?: StadiumLicense;
  descriptionKey: string;
}

export const stadiums: Stadium[] = [
  {
    id: 'metlife',
    name: 'New York New Jersey Stadium (MetLife Stadium)',
    city: 'East Rutherford, NJ',
    country: 'Estados Unidos',
    countryFlag: '🇺🇸',
    countryKey: 'eua',
    capacity: '82.500',
    opened: '2010',
    image: require('../../assets/images/stadiums/metlifeStadium.jpg'),
    descriptionKey: 'stadiums.data.metlife.desc',
    author: 'Anthony Quintano',
    license: 'CC BY 2.0',
  },
  {
    id: 'sofi',
    name: 'Los Angeles Stadium (SoFi Stadium)',
    city: 'Inglewood, CA',
    country: 'Estados Unidos',
    countryFlag: '🇺🇸',
    countryKey: 'eua',
    capacity: '70.000',
    opened: '2020',
    image: require('../../assets/images/stadiums/sofiStadium.jpg'),
    descriptionKey: 'stadiums.data.sofi.desc',
    author: 'Troutfarm27',
    license: 'CC BY-SA 4.0',
  },
  {
    id: 'att',
    name: 'Dallas Stadium (AT&T Stadium)',
    city: 'Arlington, TX',
    country: 'Estados Unidos',
    countryFlag: '🇺🇸',
    countryKey: 'eua',
    capacity: '94.000',
    opened: '2009',
    image: require('../../assets/images/stadiums/atetStadium.jpg'),
    descriptionKey: 'stadiums.data.att.desc',
    author: 'Michael Barera',
    license: 'CC BY-SA 4.0',
  },
  {
    id: 'hard_rock',
    name: 'Miami Stadium (Hard Rock Stadium)',
    city: 'Miami Gardens, FL',
    country: 'Estados Unidos',
    countryFlag: '🇺🇸',
    countryKey: 'eua',
    capacity: '65.000',
    opened: '1987',
    image: require('../../assets/images/stadiums/hardRockStadium.jpg'),
    descriptionKey: 'stadiums.data.hard_rock.desc',
    author: 'VJPannozzo',
    license: 'CC BY-SA 4.0',
  },
  {
    id: 'nrg',
    name: 'Houston Stadium (NRG Stadium)',
    city: 'Houston, TX',
    country: 'Estados Unidos',
    countryFlag: '🇺🇸',
    countryKey: 'eua',
    capacity: '72.000',
    opened: '2002',
    image: require('../../assets/images/stadiums/nrg.jpg'),
    descriptionKey: 'stadiums.data.nrg.desc',
    author: 'Carlos.dkfi',
    license: 'CC0',
  },
  {
    id: 'mercedes_benz',
    name: 'Atlanta Stadium (Mercedes-Benz Stadium)',
    city: 'Atlanta, GA',
    country: 'Estados Unidos',
    countryFlag: '🇺🇸',
    countryKey: 'eua',
    capacity: '75.000',
    opened: '2017',
    image: require('../../assets/images/stadiums/mercedesBenzStadium.jpg'),
    descriptionKey: 'stadiums.data.mercedes_benz.desc',
    author: 'Atlanta Falcons',
    license: 'CC BY 3.0',
  },
  {
    id: 'lincoln',
    name: 'Philadelphia Stadium (Lincoln Financial Field)',
    city: 'Philadelphia, PA',
    country: 'Estados Unidos',
    countryFlag: '🇺🇸',
    countryKey: 'eua',
    capacity: '69.000',
    opened: '2003',
    image: require('../../assets/images/stadiums/lincoln.jpg'),
    descriptionKey: 'stadiums.data.lincoln.desc',
    author: 'Sp. Union-Rail',
    license: 'CC BY 3.0',
  },
  {
    id: 'lumen',
    name: 'Seattle Stadium (Lumen Field)',
    city: 'Seattle, WA',
    country: 'Estados Unidos',
    countryFlag: '🇺🇸',
    countryKey: 'eua',
    capacity: '69.000',
    opened: '2002',
    image: require('../../assets/images/stadiums/lumenField.jpg'),
    descriptionKey: 'stadiums.data.lumen.desc',
    author: 'Jeff Wilcox',
    license: 'CC BY 2.0',
  },
  {
    id: 'gillette',
    name: 'Boston Stadium (Gillette Stadium)',
    city: 'Foxborough, MA',
    country: 'Estados Unidos',
    countryFlag: '🇺🇸',
    countryKey: 'eua',
    capacity: '65.000',
    opened: '2002',
    image: require('../../assets/images/stadiums/gilletteStadium.jpg'),
    descriptionKey: 'stadiums.data.gillette.desc',
    author: 'Lilavijil',
    license: 'CC BY-SA 4.0',
  },
  {
    id: 'arrowhead',
    name: 'Kansas City Stadium (Arrowhead Stadium)',
    city: 'Kansas City, MO',
    country: 'Estados Unidos',
    countryFlag: '🇺🇸',
    countryKey: 'eua',
    capacity: '73.000',
    opened: '1972',
    image: require('../../assets/images/stadiums/arrowhead.jpg'),
    descriptionKey: 'stadiums.data.arrowhead.desc',
    author: 'Conman33',
    license: 'CC BY-SA 4.0',
  },
  {
    id: 'levis',
    name: "San Francisco Bay Area Stadium (Levi's Stadium)",
    city: 'Santa Clara, CA',
    country: 'EUA',
    countryFlag: '🇺🇸',
    countryKey: 'eua',
    capacity: '71.000',
    opened: '2014',
    image: require('../../assets/images/stadiums/levisStadium.jpg'),
    descriptionKey: 'stadiums.data.levis.desc',
    author: 'Arnie Papp',
    license: 'CC BY 2.0',
  },
  {
    id: 'azteca',
    name: 'Mexico City Stadium (Estadio Azteca)',
    city: 'Cidade do México',
    country: 'México',
    countryFlag: '🇲🇽',
    countryKey: 'mex',
    capacity: '83.000',
    opened: '1966',
    image: require('../../assets/images/stadiums/azteca.jpg'),
    descriptionKey: 'stadiums.data.azteca.desc',
    author: 'ProtoplasmaKid',
    license: 'CC BY-SA 4.0',
  },
  {
    id: 'bbva',
    name: 'Estadio Monterrey (Estadio BBVA)',
    city: 'Guadalupe, NL',
    country: 'México',
    countryFlag: '🇲🇽',
    countryKey: 'mex',
    capacity: '53.500',
    opened: '2015',
    image: require('../../assets/images/stadiums/bbva.jpg'),
    descriptionKey: 'stadiums.data.bbva.desc',
    author: 'Presidencia de la República Mexicana',
    license: 'CC BY 2.0',
  },
  {
    id: 'akron',
    name: 'Estadio Guadalajara (Estadio Akron)',
    city: 'Zapopan, JAL',
    country: 'México',
    countryFlag: '🇲🇽',
    countryKey: 'mex',
    capacity: '48.000',
    opened: '2010',
    image: require('../../assets/images/stadiums/estadioAkron.jpg'),
    descriptionKey: 'stadiums.data.akron.desc',
    author: 'Alejan98',
    license: 'CC0',
  },
  {
    id: 'toronto',
    name: 'Toronto Stadium (BMO Field)',
    city: 'Toronto',
    country: 'Canadá',
    countryFlag: '🇨🇦',
    countryKey: 'can',
    capacity: '45.000',
    opened: '2007',
    image: require('../../assets/images/stadiums/toronto.jpg'),
    descriptionKey: 'stadiums.data.toronto.desc',
    author: 'Nathan Forget',
    license: 'CC BY 2.0',
  },
  {
    id: 'bc_place',
    name: 'BC Place Vancouver (BC Place)',
    city: 'Vancouver',
    country: 'Canadá',
    countryFlag: '🇨🇦',
    countryKey: 'can',
    capacity: '54.000',
    opened: '1983',
    image: require('../../assets/images/stadiums/bcPlace.jpg'),
    descriptionKey: 'stadiums.data.bc_place.desc',
    author: 'GoToVan',
    license: 'CC BY 2.0',
  },
];

export function getStadiumsByCountry(): Record<
  string,
  { flag: string; countryKey: string; name: string; list: Stadium[] }
> {
  const grouped: Record<
    string,
    { flag: string; countryKey: string; name: string; list: Stadium[] }
  > = {};
  for (const s of stadiums) {
    const key = s.countryKey;
    if (!grouped[key]) {
      grouped[key] = {
        flag: s.countryFlag,
        countryKey: s.countryKey,
        name: s.country,
        list: [],
      };
    }
    grouped[key].list.push(s);
  }
  return grouped;
}
