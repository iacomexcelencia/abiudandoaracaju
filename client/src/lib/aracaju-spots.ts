import { type InsertTouristSpot } from "@shared/schema";
import { aracajuOfficialSpots } from "./aracaju-official-spots";

// Pontos turísticos adicionais (não incluídos nos dados oficiais)
const additionalSpots: InsertTouristSpot[] = [
  {
    name_pt: "Passarela do Caranguejo",
    description_pt: "Famosa passarela com estátua icônica de caranguejo de 2,3 metros de altura. Local popular para fotografia com alto movimento nos fins de semana e bom acesso para estacionamento.",
    name_en: "Crab Walkway",
    description_en: "Famous walkway with iconic 2.3-meter tall crab statue. Popular photography location with high weekend traffic and good parking access.",
    name_es: "Pasarela del Cangrejo",
    description_es: "Famosa pasarela con estatua icónica de cangrejo de 2,3 metros de altura. Lugar popular para fotografía con mucho movimiento los fines de semana y buen acceso de estacionamiento.",
    category: "cultura",
    latitude: "-10.9456",
    longitude: "-37.0756",
    address: "Passarela do Caranguejo, Atalaia, Aracaju - SE",
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200"
    ],
    features: {
      openingHours: "24 horas",
      freeEntry: true,
      photoSpot: true,
      parking: true,
      weekendEvents: true
    }
  },
  {
    name_pt: "Praia de Atalaia",
    description_pt: "Principal atração turística da cidade, praia mais bem avaliada com entrada gratuita e extensas facilidades. Oferece oportunidades naturais para posicionamento de QR codes ao longo da costa.",
    name_en: "Atalaia Beach",
    description_en: "Main tourist attraction of the city, top-rated beach with free entry and extensive facilities. Offers natural opportunities for QR code placement along the coast.",
    name_es: "Playa de Atalaia",
    description_es: "Principal atracción turística de la ciudad, playa mejor valorada con entrada gratuita y amplias facilidades. Ofrece oportunidades naturales para colocación de códigos QR a lo largo de la costa.",
    category: "praia",
    latitude: "-10.9483",
    longitude: "-37.0725",
    address: "Praia de Atalaia, Aracaju - SE",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200"
    ],
    features: {
      openingHours: "24 horas",
      freeEntry: true,
      beachFacilities: true,
      restaurants: true,
      watersports: true
    }
  }
];

// Combinar todos os pontos turísticos (adiciais + oficiais)
export const aracajuSpots: InsertTouristSpot[] = [
  ...additionalSpots,
  ...aracajuOfficialSpots
];
