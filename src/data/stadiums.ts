export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: string;
  countryFlag: string;
  capacity: string;
  opened?: string;
  image: any;
  descriptionKey: string;
}

export const stadiums: Stadium[] = [
  {
    id: 'metlife',
    name: 'New York New Jersey Stadium (MetLife Stadium)',
    city: 'East Rutherford, NJ',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '82.500',
    opened: '2010',
    image: require('../../assets/images/stadiums/metlifeStadium.jpg'),
    descriptionKey: 'stadiums.data.metlife.desc',
  },
  {
    id: 'sofi',
    name: 'Los Angeles Stadium (SoFi Stadium)',
    city: 'Inglewood, CA',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '70.000',
    opened: '2020',
    image: require('../../assets/images/stadiums/sofiStadium.jpg'),
    descriptionKey: 'stadiums.data.sofi.desc',
  },
  {
    id: 'att',
    name: 'Dallas Stadium (AT&T Stadium)',
    city: 'Arlington, TX',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '94.000',
    opened: '2009',
    image: require('../../assets/images/stadiums/atetStadium.jpg'),
    descriptionKey: 'stadiums.data.att.desc',
  },
  {
    id: 'hard_rock',
    name: 'Miami Stadium (Hard Rock Stadium)',
    city: 'Miami Gardens, FL',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '65.000',
    opened: '1987',
    image: require('../../assets/images/stadiums/hardRockStadium.jpg'),
    descriptionKey: 'stadiums.data.hard_rock.desc',
  },
  {
    id: 'nrg',
    name: 'Houston Stadium (NRG Stadium)',
    city: 'Houston, TX',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '72.000',
    opened: '2002',
    image: require('../../assets/images/stadiums/nrg.png'),
    descriptionKey: 'stadiums.data.nrg.desc',
  },
  {
    id: 'mercedes_benz',
    name: 'Atlanta Stadium (Mercedes-Benz Stadium)',
    city: 'Atlanta, GA',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '75.000',
    opened: '2017',
    image: require('../../assets/images/stadiums/mercedesBenzStadium.jpg'),
    descriptionKey: 'stadiums.data.mercedes_benz.desc',
  },
  {
    id: 'lincoln',
    name: 'Philadelphia Stadium (Lincoln Financial Field)',
    city: 'Philadelphia, PA',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '69.000',
    opened: '2003',
    image: require('../../assets/images/stadiums/lincoln.png'),
    descriptionKey: 'stadiums.data.lincoln.desc',
  },
  {
    id: 'lumen',
    name: 'Seattle Stadium (Lumen Field)',
    city: 'Seattle, WA',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '69.000',
    opened: '2002',
    image: require('../../assets/images/stadiums/lumenField.jpg'),
    descriptionKey: 'stadiums.data.lumen.desc',
  },
  {
    id: 'gillette',
    name: 'Boston Stadium (Gillette Stadium)',
    city: 'Foxborough, MA',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '65.000',
    opened: '2002',
    image: require('../../assets/images/stadiums/gilletteStadium.jpg'),
    descriptionKey: 'stadiums.data.gillette.desc',
  },
  {
    id: 'arrowhead',
    name: 'Kansas City Stadium (Arrowhead Stadium)',
    city: 'Kansas City, MO',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '73.000',
    opened: '1972',
    image: require('../../assets/images/stadiums/arrowhead.png'),
    descriptionKey: 'stadiums.data.arrowhead.desc',
  },
  {
    id: 'levis',
    name: "San Francisco Bay Area Stadium (Levi's Stadium)",
    city: 'Santa Clara, CA',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '71.000',
    opened: '2014',
    image: require('../../assets/images/stadiums/levisStadium.jpg'),
    descriptionKey: 'stadiums.data.levis.desc',
  },
  {
    id: 'azteca',
    name: 'Mexico City Stadium (Estadio Azteca)',
    city: 'Cidade do México',
    country: 'México',
    countryFlag: '🇲🇽',
    capacity: '83.000',
    opened: '1966',
    image: require('../../assets/images/stadiums/azteca.png'),
    descriptionKey: 'stadiums.data.azteca.desc',
  },
  {
    id: 'bbva',
    name: 'Estadio Monterrey (Estadio BBVA)',
    city: 'Guadalupe, NL',
    country: 'México',
    countryFlag: '🇲🇽',
    capacity: '53.500',
    opened: '2015',
    image: require('../../assets/images/stadiums/bbva.png'),
    descriptionKey: 'stadiums.data.bbva.desc',
  },
  {
    id: 'akron',
    name: 'Estadio Guadalajara (Estadio Akron)',
    city: 'Zapopan, JAL',
    country: 'México',
    countryFlag: '🇲🇽',
    capacity: '48.000',
    opened: '2010',
    image: require('../../assets/images/stadiums/estadioAkron.jpg'),
    descriptionKey: 'stadiums.data.akron.desc',
  },
  {
    id: 'toronto',
    name: 'Toronto Stadium (BMO Field)',
    city: 'Toronto',
    country: 'Canadá',
    countryFlag: '🇨🇦',
    capacity: '45.000',
    opened: '2007',
    image: require('../../assets/images/stadiums/toronto.png'),
    descriptionKey: 'stadiums.data.toronto.desc',
  },
  {
    id: 'bc_place',
    name: 'BC Place Vancouver (BC Place)',
    city: 'Vancouver',
    country: 'Canadá',
    countryFlag: '🇨🇦',
    capacity: '54.000',
    opened: '1983',
    image: require('../../assets/images/stadiums/bcPlace.jpg'),
    descriptionKey: 'stadiums.data.bc_place.desc',
  },
];

export function getStadiumsByCountry(): Record<string, Stadium[]> {
  const grouped: Record<string, Stadium[]> = {};
  for (const s of stadiums) {
    const key = `${s.countryFlag} ${s.country}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(s);
  }
  return grouped;
}
