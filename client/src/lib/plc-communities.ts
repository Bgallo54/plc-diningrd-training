export interface PLCCommunity {
  name: string;
  city: string;
  state: string;
}

export const plcCommunities: PLCCommunity[] = [
  // Florida
  { name: "Celebration Villa of Deer Creek", city: "Deerfield Beach", state: "FL" },
  { name: "Celebration Villa of Jensen Beach", city: "Jensen Beach", state: "FL" },
  { name: "Celebration Villa of Tavares", city: "Tavares", state: "FL" },
  { name: "Celebration Villa of West Palm Beach", city: "West Palm Beach", state: "FL" },
  { name: "Celebration Villa of Winter Haven AL", city: "Winter Haven", state: "FL" },
  { name: "Celebration Villa of Winter Haven MC", city: "Winter Haven", state: "FL" },
  { name: "Cherry Laurel – Sky Active Living", city: "Tallahassee", state: "FL" },
  { name: "DeSoto Beach Club – Sky Active Living", city: "Sarasota", state: "FL" },
  { name: "Las Palmas – Sky Active Living", city: "St. Petersburg", state: "FL" },
  { name: "Marion Woods – Sky Active Living", city: "Ocala", state: "FL" },
  { name: "Regency Residence – Sky Active Living", city: "Port Richey", state: "FL" },
  { name: "Sterling Court – Sky Active Living", city: "Deltona", state: "FL" },
  { name: "The Crossings at Riverview", city: "Riverview", state: "FL" },
  { name: "University Pines – Sky Active Living", city: "Pensacola", state: "FL" },
  { name: "Venetian Gardens – Sky Active Living", city: "Venice", state: "FL" },
  // Indiana
  { name: "Brentwood at Elkhart AL", city: "Elkhart", state: "IN" },
  { name: "Brentwood at Elkhart IL", city: "Elkhart", state: "IN" },
  { name: "Brentwood at Hobart", city: "Hobart", state: "IN" },
  { name: "Brentwood at LaPorte", city: "LaPorte", state: "IN" },
  { name: "Celebration Villa of Richmond", city: "Richmond", state: "IN" },
  { name: "Glasswater Creek of Whitestown", city: "Whitestown", state: "IN" },
  { name: "Lake Meadows Senior Living", city: "Mooresville", state: "IN" },
  { name: "Tanglewood Trace", city: "Mishawaka", state: "IN" },
  { name: "Valparaiso Senior Village", city: "Valparaiso", state: "IN" },
  { name: "Vita of Marion", city: "Marion", state: "IN" },
  { name: "Vivera Senior Living", city: "Jeffersonville", state: "IN" },
  // Kansas
  { name: "Celebration Villa of Hearthstone East", city: "Topeka", state: "KS" },
  { name: "Celebration Villa of Hearthstone West", city: "Topeka", state: "KS" },
  // Kentucky
  { name: "Celebration Villa of Fort Wright", city: "Fort Wright", state: "KY" },
  { name: "Celebration Villa of Summit Hills", city: "Crestview Hills", state: "KY" },
  // Louisiana
  { name: "Oak Park Village at Slidell", city: "Slidell", state: "LA" },
  // Maryland
  { name: "Independence Court of Hyattsville", city: "Hyattsville", state: "MD" },
  // Michigan
  { name: "Aspen Ridge", city: "Gaylord", state: "MI" },
  { name: "Brentwood at Niles", city: "Niles", state: "MI" },
  { name: "Tawas Village", city: "East Tawas", state: "MI" },
  { name: "The Cortland Holland", city: "Holland", state: "MI" },
  { name: "The Cortland Northview", city: "Grand Rapids", state: "MI" },
  { name: "The Cortland Riverside Gardens", city: "Grand Rapids", state: "MI" },
  { name: "The Cortland Wyoming", city: "Wyoming", state: "MI" },
  // New York
  { name: "Celebration Villa of Newburgh", city: "Newburgh", state: "NY" },
  { name: "Heritage Assisted Living of Union City", city: "Union City", state: "NY" },
  { name: "Heritage Assisted Living of Yorktown", city: "Yorktown", state: "NY" },
  { name: "The Cortland Howell", city: "Howell", state: "NY" },
  { name: "The Gables of Brighton", city: "Rochester", state: "NY" },
  // Ohio
  { name: "Celebration Villa of Highland Crossing", city: "Cincinnati", state: "OH" },
  // Oklahoma
  { name: "John H. Johnson Senior Living", city: "Oklahoma City", state: "OK" },
  // Pennsylvania
  { name: "Celebration Villa of Altoona", city: "Altoona", state: "PA" },
  { name: "Celebration Villa of Berwick", city: "Berwick", state: "PA" },
  { name: "Celebration Villa of Chippewa", city: "Beaver Falls", state: "PA" },
  { name: "Celebration Villa of Dillsburg", city: "Dillsburg", state: "PA" },
  { name: "Celebration Villa of Exeter", city: "Reading", state: "PA" },
  { name: "Celebration Villa of Lakemont Farms", city: "Bridgeville", state: "PA" },
  { name: "Celebration Villa of Lebanon", city: "Lebanon", state: "PA" },
  { name: "Celebration Villa of Loyalsock", city: "Montoursville", state: "PA" },
  { name: "Celebration Villa of Mid Valley", city: "Olyphant", state: "PA" },
  { name: "Celebration Villa of Nittany Valley", city: "Centre Hall", state: "PA" },
  { name: "Celebration Villa of Reedsville", city: "Reedsville", state: "PA" },
  { name: "Celebration Villa of Shippensburg", city: "Shippensburg", state: "PA" },
  { name: "Celebration Villa of South Hills", city: "Pittsburgh", state: "PA" },
  { name: "Celebration Villa of York", city: "York", state: "PA" },
  { name: "Eagleview Landing", city: "Exton", state: "PA" },
  { name: "Independence Court of Erie", city: "Erie", state: "PA" },
  { name: "Independence Court of Quakertown", city: "Quakertown", state: "PA" },
  { name: "The Bridges at Warwick", city: "Jamison", state: "PA" },
  // South Carolina
  { name: "Carolina Gardens at Rock Hill", city: "Rock Hill", state: "SC" },
  { name: "Carolina Gardens at Garden City", city: "Garden City", state: "SC" },
  // Texas
  { name: "Poet's Walk San Antonio", city: "San Antonio", state: "TX" },
  // Virginia
  { name: "Poet's Walk Leesburg", city: "Leesburg", state: "VA" },
  { name: "Poet's Walk Warrenton", city: "Warrenton", state: "VA" },
  // West Virginia
  { name: "Celebration Villa of Martinsburg", city: "Martinsburg", state: "WV" },
  { name: "Celebration Villa of Teays Valley", city: "Hurricane", state: "WV" },
];

export function getCommunityLabel(c: PLCCommunity): string {
  return `${c.name} — ${c.city}, ${c.state}`;
}

export function getCommunityOptions(): { value: string; label: string }[] {
  return plcCommunities.map(c => ({
    value: c.name,
    label: getCommunityLabel(c),
  }));
}
