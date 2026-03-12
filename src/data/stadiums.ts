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
    name: 'MetLife Stadium',
    city: 'East Rutherford, NJ',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '82.500',
    image: require('../../assets/images/stadiums/metlifeStadium.jpg'),
    descriptionKey: 'stadiums.data.metlife.desc',
  },
  {
    id: 'sofi',
    name: 'SoFi Stadium',
    city: 'Los Angeles, CA',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '70.000',
    image: require('../../assets/images/stadiums/sofiStadium.jpg'),
    descriptionKey: 'stadiums.data.sofi.desc',
  },
  {
    id: 'att',
    name: 'AT&T Stadium',
    city: 'Arlington, TX',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '80.000',
    image: require('../../assets/images/stadiums/atetStadium.jpg'),
    descriptionKey: 'stadiums.data.att.desc',
  },
  {
    id: 'hard_rock',
    name: 'Hard Rock Stadium',
    city: 'Miami, FL',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '65.000',
    image: require('../../assets/images/stadiums/hardRockStadium.jpg'),
    descriptionKey: 'stadiums.data.hard_rock.desc',
  },
  {
    id: 'nrg',
    name: 'NRG Stadium',
    city: 'Houston, TX',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '72.000',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Reliantstadium.jpg/1280px-Reliantstadium.jpg',
    descriptionKey: 'stadiums.data.nrg.desc',
  },
  {
    id: 'mercedes_benz',
    name: 'Mercedes-Benz Stadium',
    city: 'Atlanta, GA',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '71.000',
    image: require('../../assets/images/stadiums/mercedesBenzStadium.jpg'),
    descriptionKey: 'stadiums.data.mercedes_benz.desc',
  },
  {
    id: 'lincoln',
    name: 'Lincoln Financial Field',
    city: 'Philadelphia, PA',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '69.000',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Lincoln_Financial_Field_%28Aerial_view%29.jpg/1280px-Lincoln_Financial_Field_%28Aerial_view%29.jpg',
    descriptionKey: 'stadiums.data.lincoln.desc',
  },
  {
    id: 'lumen',
    name: 'Lumen Field',
    city: 'Seattle, WA',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '69.000',
    image: require('../../assets/images/stadiums/lumenField.jpg'),
    descriptionKey: 'stadiums.data.lumen.desc',
  },
  {
    id: 'gillette',
    name: 'Gillette Stadium',
    city: 'Foxborough, MA',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '65.000',
    image: require('../../assets/images/stadiums/gilletteStadium.jpg'),
    descriptionKey: 'stadiums.data.gillette.desc',
  },
  {
    id: 'arrowhead',
    name: 'Arrowhead Stadium',
    city: 'Kansas City, MO',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '76.000',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Arrowhead_Stadium_2010.jpg/1280px-Arrowhead_Stadium_2010.jpg',
    descriptionKey: 'stadiums.data.arrowhead.desc',
  },
  {
    id: 'levis',
    name: "Levi's Stadium",
    city: 'Santa Clara, CA',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '68.500',
    image: require('../../assets/images/stadiums/levisStadium.jpg'),
    descriptionKey: 'stadiums.data.levis.desc',
  },
  {
    id: 'azteca',
    name: 'Estadio Azteca',
    city: 'Cidade do México',
    country: 'México',
    countryFlag: '🇲🇽',
    capacity: '87.000',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Estadio_Azteca_2.jpg/1280px-Estadio_Azteca_2.jpg',
    descriptionKey: 'stadiums.data.azteca.desc',
  },
  {
    id: 'bbva',
    name: 'Estadio BBVA',
    city: 'Monterrey',
    country: 'México',
    countryFlag: '🇲🇽',
    capacity: '53.000',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Estadio_BBVA_Bancomer_%2825425042741%29.jpg/1280px-Estadio_BBVA_Bancomer_%2825425042741%29.jpg',
    descriptionKey: 'stadiums.data.bbva.desc',
  },
  {
    id: 'akron',
    name: 'Estadio Akron',
    city: 'Guadalajara',
    country: 'México',
    countryFlag: '🇲🇽',
    capacity: '49.000',
    image: require('../../assets/images/stadiums/estadioAkron.jpg'),
    descriptionKey: 'stadiums.data.akron.desc',
  },
  {
    id: 'toronto',
    name: 'Toronto Stadium',
    city: 'Toronto',
    country: 'Canadá',
    countryFlag: '🇨🇦',
    capacity: '45.000',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/BMO_Field_2016_East.jpg/1280px-BMO_Field_2016_East.jpg',
    descriptionKey: 'stadiums.data.toronto.desc',
  },
  {
    id: 'bc_place',
    name: 'BC Place Vancouver',
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
