export interface Stadium {
  name: string;
  city: string;
  country: string;
  countryFlag: string;
  capacity: string;
  image: string;
}

export const stadiums: Stadium[] = [
  {
    name: 'MetLife Stadium',
    city: 'East Rutherford, NJ',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '82.500',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Metlife_stadium_%28Aerial_view%29.jpg/1280px-Metlife_stadium_%28Aerial_view%29.jpg',
  },
  {
    name: 'SoFi Stadium',
    city: 'Los Angeles, CA',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '70.000',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/SoFi_Stadium_-_August_2020.jpg/1280px-SoFi_Stadium_-_August_2020.jpg',
  },
  {
    name: 'AT&T Stadium',
    city: 'Arlington, TX',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '80.000',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/AT%26T_Stadium_Arlington_Texas.jpg/1280px-AT%26T_Stadium_Arlington_Texas.jpg',
  },
  {
    name: 'Hard Rock Stadium',
    city: 'Miami, FL',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '65.000',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Hard_Rock_Stadium_aerial.jpg/1280px-Hard_Rock_Stadium_aerial.jpg',
  },
  {
    name: 'NRG Stadium',
    city: 'Houston, TX',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '72.000',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Reliantstadium.jpg/1280px-Reliantstadium.jpg',
  },
  {
    name: 'Mercedes-Benz Stadium',
    city: 'Atlanta, GA',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '71.000',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Mercedes-Benz_Stadium%2C_Atlanta%2C_Georgia_-_panoramio.jpg/1280px-Mercedes-Benz_Stadium%2C_Atlanta%2C_Georgia_-_panoramio.jpg',
  },
  {
    name: 'Lincoln Financial Field',
    city: 'Philadelphia, PA',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '69.000',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Lincoln_Financial_Field_%28Aerial_view%29.jpg/1280px-Lincoln_Financial_Field_%28Aerial_view%29.jpg',
  },
  {
    name: 'Lumen Field',
    city: 'Seattle, WA',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '69.000',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/CenturyLink_Field.jpg/1280px-CenturyLink_Field.jpg',
  },
  {
    name: 'Gillette Stadium',
    city: 'Foxborough, MA',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '65.000',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Gillette_Stadium_%28Top_View%29.jpg/1280px-Gillette_Stadium_%28Top_View%29.jpg',
  },
  {
    name: 'Arrowhead Stadium',
    city: 'Kansas City, MO',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '76.000',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Arrowhead_Stadium_2010.jpg/1280px-Arrowhead_Stadium_2010.jpg',
  },
  {
    name: "Levi's Stadium",
    city: 'Santa Clara, CA',
    country: 'EUA',
    countryFlag: '🇺🇸',
    capacity: '68.500',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Levis_stadium.jpg/1280px-Levis_stadium.jpg',
  },
  {
    name: 'Estadio Azteca',
    city: 'Cidade do México',
    country: 'México',
    countryFlag: '🇲🇽',
    capacity: '87.000',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Estadio_Azteca_2.jpg/1280px-Estadio_Azteca_2.jpg',
  },
  {
    name: 'Estadio BBVA',
    city: 'Monterrey',
    country: 'México',
    countryFlag: '🇲🇽',
    capacity: '53.000',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Estadio_BBVA_Bancomer_%2825425042741%29.jpg/1280px-Estadio_BBVA_Bancomer_%2825425042741%29.jpg',
  },
  {
    name: 'Estadio Akron',
    city: 'Guadalajara',
    country: 'México',
    countryFlag: '🇲🇽',
    capacity: '49.000',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Estadio_Omnilife.jpg/1280px-Estadio_Omnilife.jpg',
  },
  {
    name: 'BMO Field',
    city: 'Toronto',
    country: 'Canadá',
    countryFlag: '🇨🇦',
    capacity: '30.000',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/BMO_Field_2016_East.jpg/1280px-BMO_Field_2016_East.jpg',
  },
  {
    name: 'BC Place',
    city: 'Vancouver',
    country: 'Canadá',
    countryFlag: '🇨🇦',
    capacity: '54.500',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/BC_Place_2015.jpg/1280px-BC_Place_2015.jpg',
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
