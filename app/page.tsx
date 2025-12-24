"use client"

import { useState, useMemo, useEffect, useCallback, memo } from "react"
import { useRouter } from 'next/navigation'
import Image from "next/image"
import { Search, Heart, ShoppingCart, Star, Plus, Minus, X, Send, Filter, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { TikTokSection } from "@/components/TikTokSection"
// para el commit

// Costo adicional para envoltorio de regalo
const COSTO_ENVOLTORIO_REGALO = 0;

// Definición de la interfaz Perfume para tipado estricto
interface Perfume {
  id: number;
  marca: string;
  nombre: string;
  imagen: string;
  precio: number;
  notas: {
    salida: string[];
    corazon: string[];
    fondo: string[];
  };
  genero: string;
  fragancia_referencia: string;
  descripcion: string;
  rating: number;
  sinDescuento?: boolean;
  quantity?: number; // solo para el carrito
  sellado?: boolean; // true = sellado, false = abierto
  esRegalo?: boolean; // para envoltorio de regalo
}

// Función para agregar cache busting a las imágenes en desarrollo
const addCacheBusting = (url: string) => {
  if (process.env.NODE_ENV === 'development') {
    return `${url}?v=${Date.now()}`
  }
  return url
}

const perfumes: Perfume[] = [
  // Nuevos perfumes agregados
  {
    id: 84,
    marca: "Tubbees",
    nombre: "Cookies & Cream 50ml EDP",
    imagen: "https://i.imgur.com/BvmtiJ5.png",
    precio: 27000,
    notas: {
      salida: ["Mantequilla", "azúcar"],
      corazon: ["Leche", "chocolate con leche"],
      fondo: ["Vainilla", "almizcle blanco"],
    },
    genero: "Unisex",
    fragancia_referencia: "",
    descripcion: "Gourmand cremoso y adictivo, huele a postre recién hecho y momentos felices.",
    rating: 4.8,
    sinDescuento: false,
    sellado: false, // abierto
  },
  {
    id: 85,
    marca: "Tubbees",
    nombre: "Sweet Caramel 50ml EDP",
    imagen: "https://i.imgur.com/vwhDMd8.png",
    precio: 27000,
    notas: {
      salida: [],
      corazon: ["Vainilla", "leche"],
      fondo: ["Vainilla", "haba tonka"],
    },
    genero: "Unisex",
    fragancia_referencia: "",
    descripcion: "Cremosa y envolvente: caramelo derretido con vainilla cálida y leche suave.",
    rating: 4.7,
    sinDescuento: false,
    sellado: false, // abierto
  },

  {
    id: 87,
    marca: "Tubbees",
    nombre: "Bubble Gum 50ml EDP",
    imagen: "https://i.imgur.com/A1Ty93q.png",
    precio: 27000,
    notas: {
      salida: ["Frutas", "clavo de olor"],
      corazon: ["Goma de mascar", "aceite de naranja"],
      fondo: ["Vainilla", "pachulí", "cachemira"],
    },
    genero: "Unisex",
    fragancia_referencia: "",
    descripcion: "Chicloso, juguetón y adictivo con frescura cítrica y fondo avainillado.",
    rating: 4.6,
    sinDescuento: false,
    sellado: false, // abierto
  },
  {
    id: 120,
    marca: "Maison Alhambra",
    nombre: "Panther Pour Homme 30 ml",
    imagen: "https://i.imgur.com/5soLGLi.png",
    precio: 15000,
    notas: {
      salida: ["Limón de Amalfi", "Entusiasmo de limón", "lavanda"],
      corazon: ["Lavanda", "manzana", "humo", "notas terrosas", "pachulí"],
      fondo: ["Vainilla", "lavanda", "vetiver"],
    },
    genero: "Masculino",
    fragancia_referencia: "Phantom de Paco Rabanne",
    descripcion: "Una fragancia masculina de la familia olfativa Aromática. Ideal para hombres que buscan una esencia fresca y sofisticada, con un equilibrio entre notas cítricas, florales y amaderadas.",
    rating: 4.9,
    sinDescuento: false,
    sellado: true,
  },

  {
    id: 121,
    marca: "Maison Alhambra",
    nombre: "Glacier Gold 30 ml",
    imagen: "https://louparfum.com/cdn/shop/files/output_49d3c94c-d65f-4dd0-be19-658ac8ead009.png?v=1753478616",
    precio: 15000,
    notas: {
      salida: ["Bergamota", "limón", "pimienta rosa"],
      corazon: ["Lavanda", "salvia", "notas verdes"],
      fondo: ["Vetiver", "ámbar", "almizcle"],
    },
    genero: "Masculino",
    fragancia_referencia: "Jean Paul Gaultier Le Male Elixir",
    descripcion: "Fragancia masculina sofisticada, fresca y vibrante, inspirada en el espíritu moderno y aventurero del hombre actual. Diseñada para hombres seguros de sí mismos que buscan una fragancia versátil para destacar en cualquier ocasión. Compacto y elegante, su formato de 30 ml es ideal para llevar a todos lados.",
    rating: 4.8, // No se proporcionó rating
    sinDescuento: false,
    sellado: true, // Asumiendo que es nuevo/sellado
  },
  {
    id: 89,
    marca: "Maison Alhambra",
    nombre: "Dark Door Sport 100ml EDP",
    imagen: "https://i.imgur.com/ZGDNzNq.png",
    precio: 37000,
    notas: {
      salida: ["Pomelo", "limón", "resina de elemí", "bergamota"],
      corazon: ["Jengibre", "cedro", "vetiver"],
      fondo: ["Lavanda", "romero", "sándalo"],
    },
    genero: "Hombre",
    fragancia_referencia: "Dior Homme Sport",
    descripcion: "Fresca y energética; perfecta para el día, entrenar o climas cálidos.",
    rating: 4.6,
    sinDescuento: false,
    sellado: true, // abierto
  },

  {
    id: 91,
    marca: "Maison Alhambra",
    nombre: "Léonie Intense 30ml EDP",
    imagen: "https://i.imgur.com/C4ftYm2.png",
    precio: 15000,
    notas: {
      salida: ["Lavanda", "naranja tangerina", "grosellas negras", "petit grain"],
      corazon: ["Lavanda", "jazmín", "flor de azahar"],
      fondo: ["Vainilla de Madagascar", "ámbar", "cedro", "almizcle"],
    },
    genero: "Mujer",
    fragancia_referencia: "Libre Intense – YSL",
    descripcion: "Potente, elegante y sensual, con frescura floral y dulzura cremosa.",
    rating: 4.8,
    sinDescuento: false,
    sellado: true, // abierto
  },

  {
    id: 95,
    marca: "Maison Alhambra",
    nombre: "Glacier Pour Homme 30ml EDP",
    imagen: "https://i.imgur.com/qZAhYu5.png",
    precio: 15000,
    notas: {
      salida: ["Lavanda", "menta", "cardamomo", "bergamota"],
      corazon: ["Canela", "flor de azahar del naranjo", "alcaravea"],
      fondo: ["Vainilla", "haba tonka", "sándalo", "ámbar"],
    },
    genero: "Hombre",
    fragancia_referencia: "Le Male – Jean Paul Gaultier",
    descripcion: "Frescura aromática con fondo dulce envolvente; magnético y moderno.",
    rating: 4.8,
    sinDescuento: false,
    sellado: true, // abierto
  },


  {
    id: 107,
    marca: "Maison Alhambra",
    nombre: "Glacier Bella 30ml EDP",
    imagen: "https://i.imgur.com/iNAD9AI.png",
    precio: 15000,
    notas: {
      salida: ["Pera", "Bergamota"],
      corazon: ["Notas florales", "Cuero"],
      fondo: ["Vainilla", "Vetiver", "Ámbar", "Almizcle"]
    },
    genero: "Mujer",
    fragancia_referencia: "La Belle de Jean Paul Gaultier",
    descripcion: "Aroma femenino moderno con toque fresco y envolvente.",
    rating: 4.6,
    sinDescuento: false,
    sellado: true, // abierto
  },
  {
    id: 108,
    marca: "Maison Alhambra",
    nombre: "CASSIUS EDP 30ml",
    imagen: "https://i.imgur.com/SFVy9jt.png",
    precio: 15000,
    notas: {
      salida: ["Heliotropo", "comino", "bergamota"],
      corazon: ["Almendra", "lavanda", "jazmín"],
      fondo: ["Vainilla", "ámbar", "sándalo"],
    },
    genero: "Hombre",
    fragancia_referencia: "Pegasus de Parfums De Marly",
    descripcion: "Intensa y envolvente, ideal para la noche, salidas especiales o estaciones frías como otoño e invierno. Su combinación de especias, lavanda y vainilla le da un toque seductor y elegante, perfecto para quienes buscan dejar una impresión duradera.",
    rating: 4.8,
    sinDescuento: false,
    sellado: true, // abierto
  },
  {
    id: 109,
    marca: "Lattafa Perfumes",
    nombre: "Angham EDP",
    imagen: "https://i.imgur.com/bB5TfGP.png",
    precio: 64000,
    notas: {
      salida: ["Jengibre", "mandarina", "pimienta rosa"],
      corazon: ["Lavanda", "praliné", "cacao", "jazmín"],
      fondo: ["Vainilla", "ámbar", "almizcle"],
    },
    genero: "Unisex",
    fragancia_referencia: "Burberry Goddess - Burberry",
    descripcion: "Fragancia de la familia olfativa Oriental Vainilla para Hombres y Mujeres. Nueva fragancia lanzada en 2024, combina la frescura cítrica con la dulzura del praliné y cacao, creando una experiencia olfativa única y moderna.",
    rating: 4.9,
    sinDescuento: false,
    sellado: false,
  },
  {
    id: 110,
    marca: "Maison Alhambra",
    nombre: "Delilah Pour Femme 100ml EDP",
    imagen: addCacheBusting("https://i.imgur.com/R8XeiYG.png"),
    precio: 40000,
    notas: {
      salida: ["Lichi", "Ruibarbo", "Bergamota"],
      corazon: ["Rosa turca", "Peonía", "Lirio de los valles"],
      fondo: ["Vainilla", "Almizcle blanco", "Cachemira"]
    },
    genero: "Mujer",
    fragancia_referencia: "Delina de Parfums de Marly",
    descripcion: "Fragancia femenina elegante y versátil en concentración EDP.",
    rating: 4.7,
    sinDescuento: false,
    sellado: true,
  },
  {
    id: 111,
    marca: "Maison Alhambra",
    nombre: "Reyna Pour Femme 100ml EDP",
    imagen: addCacheBusting("https://i.imgur.com/RTOILfy.png"),
    precio: 32000,
    notas: {
      salida: [],
      corazon: [],
      fondo: [],
    },
    genero: "Mujer",
    fragancia_referencia: "",
    descripcion: "Una EDP femenina de 100ml con carácter moderno y delicado.",
    rating: 4.6,
    sinDescuento: false,
    sellado: true,
  },
  {
    id: 17,
    marca: "Perfumeros",
    nombre: "Perfumeros",
    imagen: addCacheBusting("https://i.imgur.com/yMxitsz.png"),
    precio: 3500,
    notas: {
      salida: [""],
      corazon: [""],
      fondo: [""],
    },
    genero: "Unisex",
    fragancia_referencia: "",
    descripcion: "Disfruta de llevar tus perfume favorito a todos lados",
    sinDescuento: true,
    rating: 4.2,
    sellado: true, // abierto
  },
  {
    id: 36,
    marca: "Britney Spears",
    nombre: "Fantasy 100ml EDP",
    imagen: addCacheBusting("https://i.imgur.com/RMxS2Is.png"),
    precio: 50000,
    notas: {
      salida: ["Kiwi", "lichi rojo", "membrillo"],
      corazon: ["Chocolate blanco", "quequito", "orquídea", "jazmín"],
      fondo: ["Almizcle", "raíz de lirio", "notas amaderadas"],
    },
    genero: "Mujer",
    fragancia_referencia: "",
    descripcion: "Una fragancia icónica, dulce y encantadora, que invita a soñar. Ideal para quienes aman los aromas golosos, románticos y juveniles. Perfecta para el día o la noche, citas, salidas con amigas o cuando simplemente querés sentirte única y coqueta. ¡Una fragancia que deja huella, tan inolvidable como vos!",
    rating: 4.8,
    sinDescuento: false,
    sellado: true, // abierto
  },
  {
    id: 37,
    marca: "Maison Alhambra",
    nombre: "Jorge di Profumo Aqua 100ml EDP",
    imagen: addCacheBusting("https://i.imgur.com/U48EYDK.png"),
    precio: 40000,
    notas: {
      salida: ["Bergamota", "limón siciliano", "pimienta negra"],
      corazon: ["Lavanda", "tabaco", "geranio"],
      fondo: ["Sándalo", "vetiver", "almizcle"],
    },
    genero: "Hombre",
    fragancia_referencia: "Acqua di Gio Profumo – Giorgio Armani",
    descripcion: "Un perfume intenso, moderno y sofisticado, pensado para el hombre que deja su marca. Perfecto para el día o la noche, reuniones importantes, cenas elegantes o cualquier momento donde se busque presencia, carácter y estilo. Elegante, varonil y con un toque misterioso… ideal para quienes disfrutan de fragancias con personalidad y profundidad.",
    rating: 4.8,
    sinDescuento: false,
    sellado: true, // abierto
  },
  
  {
    id: 31,
    marca: "Maison Alhambra",
    nombre: "Céleste 100ml EDP",
    imagen: addCacheBusting("https://i.imgur.com/tte0WD0.png"),
    precio: 36400,
    notas: {
      salida: ["Bergamota", "limón"],
      corazon: ["Jazmín", "lirio de los valles", "rosa"],
      fondo: ["Ylang-ylang", "sándalo", "almizcle", "musgo"],
    },
    genero: "Mujer",
    fragancia_referencia: "Divine de JPG",
    descripcion: "Fresca y luminosa, ideal para el día, especialmente en primavera y verano. Perfecta para usar en la oficina, reuniones o salidas al aire libre. Su aroma elegante y limpio la hace muy versátil y fácil de llevar a diario.",
    rating: 4.7,
    sinDescuento: false,
    sellado: true, // abierto
  },


  {
    id: 55,
    marca: "Maison Alhambra",
    nombre: "Mia Dolcezza Verde 100ml EDP",
    imagen: addCacheBusting("https://i.imgur.com/ZH6ukYM.png"),
    precio: 40000,
    notas: {
      salida: ["Grosella negra", "pimienta rosa", "bergamota"],
      corazon: ["Jazmín", "ylang-ylang", "nardo", "flor de azahar"],
      fondo: ["Vainilla", "cachemira", "madera de gaiac", "ámbar"],
    },
    genero: "Mujer",
    fragancia_referencia: "Valentino Donna Born in Roma Green Stravaganza",
    descripcion: "La versión más fresca, vibrante y sofisticada de un clásico femenino. Perfecta para el día a día, reuniones, eventos o cuando querés un aroma elegante pero con frescura. Es versátil, moderna y con muy buena duración. Mia Dolcezza Verde combina la dulzura envolvente del original con un giro verde y especiado que la hace refinada, luminosa y con carácter. Imita a Valentino Donna Born in Roma Green Stravaganza.",
    rating: 4.8,
    sinDescuento: false,
    sellado: false, // abierto
  },
  {
    id: 57,
    marca: "Maison Alhambra",
    nombre: "Narissa Rouge 100ml EDP",
    imagen: addCacheBusting("https://i.imgur.com/EEWFvUp.png"),
    precio: 40000,
    notas: {
      salida: ["Iris", "rosa de Bulgaria"],
      corazon: ["Almizcle", "nardos", "flor de azahar"],
      fondo: ["Haba tonka", "vainilla", "vetiver", "sándalo", "cedro"],
    },
    genero: "Mujer",
    fragancia_referencia: "Narciso Rouge de Narciso Rodriguez",
    descripcion: "Un perfume intenso, sensual y magnético, inspirado en el icónico Narciso Rouge – Narciso Rodriguez. Ideal para noches especiales, citas, eventos elegantes o cuando querés que tu presencia se sienta con fuerza. Una fragancia envolvente, floral y misteriosa que deja huella. Narissa Rouge es poder femenino en forma de perfume: floral, cremoso y con mucha actitud. Inspirada en Narciso Rouge de Narciso Rodriguez.",
    rating: 4.8,
    sinDescuento: false,
    sellado: false, // abierto
  },
  {
    id: 59,
    marca: "Maison Alhambra",
    nombre: "Philos Opus Noir 100ml EDP",
    imagen: addCacheBusting("https://i.imgur.com/v2v8Icy.png"),
    precio: 34800,
    notas: {
      salida: ["Frutas", "rosa turca"],
      corazon: ["Ylang-ylang", "cuero", "nuez moscada", "ámbar"],
      fondo: ["Pachulí", "vainilla", "vetiver", "almizcle", "cedro"],
    },
    genero: "Unisex",
    fragancia_referencia: "Opera de Xerjoff",
    descripcion: "Una fragancia opulenta, artística y poderosa, inspirada en la exclusividad de Opera – Xerjoff. Ideal para ocasiones especiales, noches sofisticadas o cuando querés un perfume que hable por vos. Es intenso, elegante y con sello de lujo árabe, dejando una estela memorable. Philos Opus Noir es para quienes buscan fragancias que destaquen por su carácter único y profundo, sin pagar el precio de una nicho. Lujo, arte y presencia en un solo perfume. Inspirado en Opera de Xerjoff.",
    rating: 4.9,
    sinDescuento: false,
    sellado: false, // abierto
  },
  {
    id: 60,
    marca: "Maison Alhambra",
    nombre: "Philos Shine 100ml EDP",
    imagen: addCacheBusting("https://i.imgur.com/tsvgJGy.png"),
    precio: 50000,
    notas: {
      salida: ["Hojas de higuera", "bergamota"],
      corazon: ["Notas florales", "violeta", "almizcle"],
      fondo: ["Acordes amaderados", "ámbar"],
    },
    genero: "Unisex",
    fragancia_referencia: "Philosykos – Diptyque",
    descripcion: "Inspirado en la elegancia natural de Philosykos – Diptyque, este perfume te envuelve en un aroma verde, cremoso y atemporal. Ideal para quienes buscan una fragancia limpia, elegante y relajada, con vibra mediterránea. Perfecto para uso diario, días de sol o cuando querés un perfume que te haga sentir sofisticada sin esfuerzo. Philos Shine es como llevar un paseo entre higueras en la piel.",
    rating: 4.8,
    sinDescuento: false,
    sellado: false, // abierto
  },
  {
    id: 63,
    marca: "Maison Alhambra",
    nombre: "Opera Rouge 100ml EDP",
    imagen: addCacheBusting("https://i.imgur.com/GmkcNdO.png"),
    precio: 47000,
    notas: {
      salida: ["Pimienta rosa", "pera"],
      corazon: ["Jazmín", "café", "pimienta rosa"],
      fondo: ["Vainilla", "cedro", "pachulí"],
    },
    genero: "Mujer",
    fragancia_referencia: "Black Opium – YSL",
    descripcion: "Una fragancia oscura, vibrante y seductora, inspirada en el icónico Black Opium – Yves Saint Laurent. Perfecta para salidas nocturnas, eventos especiales o momentos donde querés dejar una huella inolvidable. Un perfume con carácter, dulce y con un toque de misterio.",
    rating: 4.8,
    sinDescuento: false,
    sellado: false, // abierto
  },


  {
    id: 71,
    marca: "Maison Alhambra",
    nombre: "Panther Pour Homme 100ml EDP",
    imagen: addCacheBusting("https://i.imgur.com/pu3CaeR.png"),
    precio: 40000,
    notas: {
      salida: ["Cítricos", "bergamota"],
      corazon: ["Especias", "lavanda"],
      fondo: ["Ámbar", "almizcle"],
    },
    genero: "Hombre",
    fragancia_referencia: "Phantom de Paco Rabanne",
    descripcion: "Una fragancia masculina poderosa y elegante, como la fuerza de una pantera.",
    rating: 4.7,
    sinDescuento: false,
    sellado: true, // abierto
  },

  {
    id: 77,
    marca: "Maison Alhambra",
    nombre: "La Voie Rosa 100ml EDP",
    imagen: addCacheBusting("https://i.imgur.com/eNFvc9h.png"),
    precio: 40000,
    notas: {
      salida: ["Rosa", "bergamota", "pera"],
      corazon: ["Jazmín", "peonía", "lirio"],
      fondo: ["Almizcle", "sándalo", "cedro"],
    },
    genero: "Mujer",
    fragancia_referencia: "My Way de Giorgio Armani",
    descripcion: "Una fragancia floral elegante centrada en la rosa, sofisticada y femenina.",
    rating: 4.7,
    sinDescuento: false,
    sellado: true, // abierto
  },
  {
    id: 148,
    marca: "Maison Alhambra",
    nombre: "Bad Homme 30 ml",
    imagen: "https://i.imgur.com/hFnPDUI.png",
    precio: 15000,
    notas: {
      salida: ["Pimienta blanca", "Pimienta negra", "Bergamota"],
      corazon: ["Salvia", "Cedro"],
      fondo: ["Haba tonka", "Cacao", "Amberwood"],
    },
    genero: "Masculino",
    fragancia_referencia: "Bad Boy de Carolina Herrera",
    descripcion: "Una fragancia audaz y especiada que combina notas luminosas de bergamota con la oscuridad adictiva del cacao y la haba tonka. Para el hombre moderno y rebelde.",
    rating: 4.7,
    sinDescuento: false,
    sellado: true,
  },
  {
    id: 147,
    marca: "Maison Alhambra",
    nombre: "Glacier Pour Homme 30 ml",
    imagen: "https://epicimportados.com/1074-home_default/perfume-miniatura-maison-alhambra-glacier-pour-homme-edp-30ml.jpg",
    precio: 15000,
    notas: {
      salida: ["Lavanda", "menta", "cardamomo", "bergamota"],
      corazon: ["Canela", "flor de azahar del naranjo", "alcaravea"],
      fondo: ["Vainilla", "haba tonka", "sándalo", "ámbar"],
    },
    genero: "Masculino",
    fragancia_referencia: "Le Male de Jean Paul Gaultier",
    descripcion: "Un clásico Fougère oriental reinventado. Combina la frescura audaz de la menta y la lavanda con la calidez sensual de la vainilla y la canela, creando una fragancia icónica y reconocible.",
    rating: 4.8,
    sinDescuento: false,
    sellado: true,
  },
  {
    id: 149,
    marca: "Maison Alhambra",
    nombre: "Bad Femme 30 ml",
    imagen: "https://i.imgur.com/xIoHc4O.png",
    precio: 15000,
    notas: {
      salida: ["Almendra", "Café", "Limón", "Bergamota"],
      corazon: ["Nardos", "Jazmín Sambac", "Flor de Azahar"],
      fondo: ["Haba tonka", "Cacao", "Vainilla", "Praliné", "Sándalo"],
    },
    genero: "Femenino",
    fragancia_referencia: "Good Girl de Carolina Herrera",
    descripcion: "Una fragancia sensual y sofisticada que juega con la dualidad femenina. Combina la luminosidad de las flores blancas (jazmín y nardos) con notas oscuras y golosas de cacao y haba tonka.",
    rating: 4.8,
    sinDescuento: false,
    sellado: true,
  },


  {
    id: 83,
    marca: "Calvin Klein",
    nombre: "CK IN2U 100ml EDT",
    imagen: addCacheBusting("https://i.imgur.com/WEIdKAP.png"),
    precio: 58500,
    notas: {
      salida: ["Lima", "hojas de tomate", "bergamota"],
      corazon: ["Cacao", "orquídea", "especias"],
      fondo: ["Cedro", "ámbar", "vainilla"],
    },
    genero: "Unisex",
    fragancia_referencia: "",
    descripcion: "Una fragancia unisex moderna y juvenil, fresca y energética. Perfecta para el día a día, con una mezcla única de notas frescas y cálidas que la hacen versátil para cualquier ocasión.",
    rating: 4.5,
    sinDescuento: false,
    sellado: true, // abierto
  },



]

// Hook personalizado para debounce
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Componente de tarjeta de producto (memoizada para rendimiento)
const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJyBoZWlnaHQ9JzEwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyByeD0nMTInIGZpbGw9JyNlZWQ2ZjgnLz48L3N2Zz4="

type ProductCardProps = {
  perfume: Perfume;
  index: number;
  favorites: Set<number>;
  toggleFavorite: (id: number) => void;
  formatPrice: (price: number) => string;
  addToCart: (perfume: Perfume) => void;
  addingToCart: Set<number>;
  selectedPerfume: Perfume | null;
  setSelectedPerfume: (p: Perfume) => void;
};

const ProductCard = memo(function ProductCard({
  perfume,
  index,
  favorites,
  toggleFavorite,
  formatPrice,
  addToCart,
  addingToCart,
  selectedPerfume,
  setSelectedPerfume,
}: ProductCardProps) {
  return (
    <div
      className="group relative animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500" />

      <Card className="relative overflow-hidden rounded-2xl bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1">
        {/* Image Section */}
        <CardHeader className="p-0 relative overflow-hidden">
          <div className="aspect-square relative bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30">
            {/* Decorative circles */}
            <div className="absolute top-4 right-4 w-24 h-24 bg-purple-200/20 rounded-full blur-2xl" />
            <div className="absolute bottom-4 left-4 w-20 h-20 bg-pink-200/20 rounded-full blur-2xl" />

            <Image
              src={perfume.imagen || "/placeholder.svg"}
              alt={perfume.nombre}
              fill
              className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="lazy"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 25vw, 300px"
            />

            {/* Favorite Button */}
            <button
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200"
              onClick={() => toggleFavorite(perfume.id)}
            >
              <Heart
                className={`h-5 w-5 transition-all duration-300 ${favorites.has(perfume.id)
                  ? "fill-red-500 text-red-500"
                  : "text-gray-400 hover:text-red-400"
                  }`}
              />
            </button>

            {/* Gender Badge */}
            <div className="absolute top-3 left-3">
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm shadow-sm ${perfume.genero === "Mujer"
                ? "bg-pink-500/90 text-white"
                : perfume.genero === "Hombre"
                  ? "bg-blue-500/90 text-white"
                  : "bg-purple-500/90 text-white"
                }`}>
                {perfume.genero}
              </span>
            </div>

            {/* Sellado/Abierto Badge */}
            <div className="absolute bottom-3 left-3">
              {perfume.sellado === false && (
                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-500/90 text-white backdrop-blur-sm shadow-sm">
                  Abierto
                </span>
              )}
              {perfume.sellado === true && (
                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/90 text-white backdrop-blur-sm shadow-sm flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Sellado
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Content Section */}
        <CardContent className="p-5">
          <div className="space-y-3">
            {/* Brand */}
            <span className="inline-block px-2.5 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-600">
              {perfume.marca}
            </span>

            {/* Name */}
            <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[3rem] text-base leading-snug group-hover:text-[#5D2A71] transition-colors duration-300">
              {perfume.nombre}
            </h3>

            {/* Reference */}
            <div className="min-h-[1.25rem]">
              {perfume.fragancia_referencia ? (
                <p className="text-xs text-gray-500 line-clamp-1 flex items-center gap-1">
                  <span className="text-purple-400">✦</span>
                  Inspirado en {perfume.fragancia_referencia}
                </p>
              ) : (
                <p className="text-xs text-gray-400 italic">Fragancia original</p>
              )}
            </div>

            {/* Price & Rating */}
            <div className="flex items-end justify-between pt-2 border-t border-gray-100">
              <div>
                <p className="text-2xl font-bold bg-gradient-to-r from-[#5D2A71] to-purple-600 bg-clip-text text-transparent">
                  {formatPrice(perfume.precio)}
                </p>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-amber-700">{perfume.rating}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl border-2 border-gray-200 hover:border-[#5D2A71] hover:bg-purple-50 font-medium transition-all duration-300"
                    onClick={() => setSelectedPerfume(perfume)}
                  >
                    Ver detalles
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
                  {selectedPerfume && selectedPerfume.id === perfume.id && (
                    <div className="relative">
                      {/* Header con gradiente */}
                      <div className="sticky top-0 z-10 bg-gradient-to-r from-[#5D2A71] to-purple-600 p-6 text-white">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                                {selectedPerfume.marca}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${selectedPerfume.genero === "Mujer"
                                ? "bg-pink-400/30"
                                : selectedPerfume.genero === "Hombre"
                                  ? "bg-blue-400/30"
                                  : "bg-purple-400/30"
                                }`}>
                                {selectedPerfume.genero}
                              </span>
                              {selectedPerfume.sellado ? (
                                <span className="px-2 py-0.5 bg-emerald-400/30 rounded-full text-xs font-medium flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  Sellado
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-amber-400/30 rounded-full text-xs font-medium">
                                  Abierto
                                </span>
                              )}
                            </div>
                            <h2 className="text-2xl font-bold">{selectedPerfume.nombre}</h2>
                          </div>
                        </div>
                      </div>

                      {/* Contenido principal */}
                      <div className="grid md:grid-cols-2 gap-0">
                        {/* Imagen */}
                        <div className="relative bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30 p-8">
                          <div className="absolute top-4 right-4 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl" />
                          <div className="absolute bottom-4 left-4 w-24 h-24 bg-pink-200/30 rounded-full blur-3xl" />
                          <div className="aspect-square relative">
                            <Image
                              src={selectedPerfume.imagen || "/placeholder.svg"}
                              alt={selectedPerfume.nombre}
                              fill
                              className="object-contain hover:scale-105 transition-transform duration-500"
                              placeholder="blur"
                              blurDataURL={BLUR_DATA_URL}
                              sizes="(max-width: 640px) 100vw, 50vw"
                            />
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-6 space-y-5">
                          {/* Precio y rating */}
                          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Precio</p>
                              <p className="text-3xl font-bold bg-gradient-to-r from-[#5D2A71] to-purple-600 bg-clip-text text-transparent">
                                {formatPrice(selectedPerfume.precio)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500 mb-1">Valoración</p>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-5 w-5 ${i < Math.floor(selectedPerfume.rating)
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-gray-200"
                                        }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-lg font-bold text-amber-600">{selectedPerfume.rating}</span>
                              </div>
                            </div>
                          </div>

                          {/* Inspirado en */}
                          {selectedPerfume.fragancia_referencia && (
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <Sparkles className="h-5 w-5 text-[#5D2A71]" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Inspirado en</p>
                                <p className="font-semibold text-[#5D2A71]">{selectedPerfume.fragancia_referencia}</p>
                              </div>
                            </div>
                          )}

                          {/* Descripción */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Descripción</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{selectedPerfume.descripcion}</p>
                          </div>

                          {/* Notas olfativas */}
                          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                              <span className="text-lg">🌸</span>
                              Pirámide olfativa
                            </h4>
                            <div className="space-y-2">
                              {selectedPerfume.notas.salida.length > 0 && (
                                <div className="flex items-start gap-3">
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-lg whitespace-nowrap">Salida</span>
                                  <p className="text-sm text-gray-600">{selectedPerfume.notas.salida.join(", ")}</p>
                                </div>
                              )}
                              {selectedPerfume.notas.corazon.length > 0 && (
                                <div className="flex items-start gap-3">
                                  <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded-lg whitespace-nowrap">Corazón</span>
                                  <p className="text-sm text-gray-600">{selectedPerfume.notas.corazon.join(", ")}</p>
                                </div>
                              )}
                              {selectedPerfume.notas.fondo.length > 0 && (
                                <div className="flex items-start gap-3">
                                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-lg whitespace-nowrap">Fondo</span>
                                  <p className="text-sm text-gray-600">{selectedPerfume.notas.fondo.join(", ")}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Botón agregar */}
                          <Button
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#5D2A71] to-purple-600 hover:from-[#4A2259] hover:to-purple-700 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                            onClick={() => addToCart(selectedPerfume)}
                            disabled={addingToCart.has(selectedPerfume.id)}
                          >
                            {addingToCart.has(selectedPerfume.id) ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                Agregando...
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                Agregar al carrito
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              <Button
                size="sm"
                className="rounded-xl bg-gradient-to-r from-[#5D2A71] to-purple-600 hover:from-[#4A2259] hover:to-purple-700 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all duration-300 px-4"
                onClick={() => addToCart(perfume)}
                disabled={addingToCart.has(perfume.id)}
              >
                {addingToCart.has(perfume.id) ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

// Componente de skeleton loader
function ProductSkeleton() {
  return (
    <Card className="animate-pulse bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="p-0">
        <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-lg"></div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded flex-1"></div>
          <div className="h-8 bg-gray-200 rounded w-8"></div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function EssenzaPerfumes() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGender, setSelectedGender] = useState<string>("Todos")
  const [selectedBrand, setSelectedBrand] = useState<string>("Todas")
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [cart, setCart] = useState<Perfume[]>([])
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [addingToCart, setAddingToCart] = useState<Set<number>>(new Set())
  const [discountCode, setDiscountCode] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [discountApplied, setDiscountApplied] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("marca");
  const [discountError, setDiscountError] = useState<string>("");
  const [itemsToShow, setItemsToShow] = useState<number>(16)
  const [giftWrapping, setGiftWrapping] = useState<boolean>(false)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Simular carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Cargar carrito desde localStorage al montar el componente
  useEffect(() => {
    const savedCart = localStorage.getItem("essenza-cart")
    const savedFavorites = localStorage.getItem("essenza-favorites")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)))
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("essenza-cart", JSON.stringify(cart))
  }, [cart])

  // Guardar favoritos en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("essenza-favorites", JSON.stringify([...favorites]))
  }, [favorites])

  const brands = useMemo(() => ["Todas", ...new Set(perfumes.map((p) => p.marca))], [])
  const genders = useMemo(() => ["Todos", "Mujer", "Hombre", "Unisex"], [])

  const filteredPerfumes = useMemo(() => {
    const filtered = perfumes.filter((perfume) => {
      const matchesSearch =
        perfume.nombre.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        perfume.marca.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        perfume.fragancia_referencia?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      const matchesGender = selectedGender === "Todos" || perfume.genero === selectedGender
      const matchesBrand = selectedBrand === "Todas" || perfume.marca === selectedBrand

      return matchesSearch && matchesGender && matchesBrand
    })

    // Ordenar según el criterio seleccionado
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "marca":
          return a.marca.localeCompare(b.marca)
        case "precio-asc":
          return a.precio - b.precio
        case "precio-desc":
          return b.precio - a.precio
        case "rating":
          return b.rating - a.rating
        case "nombre":
          return a.nombre.localeCompare(b.nombre)
        default:
          return 0
      }
    })
  }, [debouncedSearchTerm, selectedGender, selectedBrand, sortBy])

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }, [])

  const displayedPerfumes = useMemo(() => {
    return filteredPerfumes.slice(0, itemsToShow)
  }, [filteredPerfumes, itemsToShow])

  const canLoadMore = displayedPerfumes.length < filteredPerfumes.length

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(id)) {
        newFavorites.delete(id)
        toast({
          title: "Eliminado de favoritos",
          description: "El producto se eliminó de tus favoritos",
        })
      } else {
        newFavorites.add(id)
        toast({
          title: "Agregado a favoritos ❤️",
          description: "El producto se agregó a tus favoritos",
        })
      }
      return newFavorites
    })
  }, [])

  const addToCart = useCallback(async (perfume: Perfume) => {
    setAddingToCart((prev) => new Set(prev).add(perfume.id))

    // Simular delay para mostrar loading
    await new Promise((resolve) => setTimeout(resolve, 500))

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === perfume.id)
      if (existingItem) {
        const newCart = prevCart.map((item) =>
          item.id === perfume.id ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item,
        )
        toast({
          title: "Cantidad actualizada 🛒",
          description: `${perfume.nombre} - Cantidad: ${(existingItem.quantity ?? 1) + 1}`,
        })
        return newCart
      } else {
        toast({
          title: "Agregado al carrito ✨",
          description: perfume.nombre,
          action: (
            <Button variant="outline" size="sm" onClick={() => setIsCartOpen(true)}>
              Ver carrito
            </Button>
          ),
        })
        return [...prevCart, { ...perfume, quantity: 1 }]
      }
    })

    setAddingToCart((prev) => {
      const newSet = new Set(prev)
      newSet.delete(perfume.id)
      return newSet
    })
  }, [])

  const removeFromCart = useCallback((id: number) => {
    setCart((prevCart) => {
      const item = prevCart.find((item) => item.id === id)
      if (item) {
        toast({
          title: "Producto eliminado",
          description: `${item.nombre} se eliminó del carrito`,
        })
      }
      return prevCart.filter((item) => item.id !== id)
    })
  }, [])

  const updateQuantity = useCallback(
    (id: number, newQuantity: number) => {
      if (newQuantity === 0) {
        removeFromCart(id)
      } else {
        setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
      }
    },
    [removeFromCart],
  )

  const getTotalItems = useCallback(() => {
    return cart.reduce((total, item) => total + (item.quantity ?? 1), 0)
  }, [cart])

  const getTotalPrice = useCallback(() => {
    const subtotal = cart.reduce((total, item) => total + item.precio * (item.quantity ?? 1), 0)
    const giftWrappingCost = giftWrapping ? COSTO_ENVOLTORIO_REGALO : 0
    return subtotal + giftWrappingCost
  }, [cart, giftWrapping])

  const getDiscountAmount = useCallback(() => {
    const subtotal = cart.reduce((total, item) => total + item.precio * (item.quantity ?? 1), 0)
    return (subtotal * discountPercent) / 100;
  }, [cart, discountPercent]);

  const getTotalWithDiscount = useCallback(() => {
    return getTotalPrice() - getDiscountAmount();
  }, [getTotalPrice, getDiscountAmount]);

  const handleApplyDiscount = () => {
    if (discountCode.trim().toUpperCase() === "ESSENZA10") {
      setDiscountPercent(10);
      setDiscountApplied(true);
      setDiscountError("");
      toast({
        title: "¡Descuento aplicado!",
        description: "Se aplicó un 10% de descuento a tu compra.",
      });
    } else {
      setDiscountPercent(0);
      setDiscountApplied(false);
      setDiscountError("Código inválido");
      toast({
        title: "Código inválido",
        description: "El código ingresado no es válido.",
        variant: "destructive",
      });
    }
  };

  const router = useRouter()

  const goToCheckout = useCallback(() => {
    // Cerramos el carrito y navegamos al formulario de checkout
    setIsCartOpen(false)
    router.push('/checkout')
    toast({
      title: 'Abriendo checkout',
      description: 'Te llevamos al formulario para completar el pago con MercadoPago',
    })
  }, [router])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedGender("Todos")
    setSelectedBrand("Todas")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
        {/* Header Skeleton */}
        <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-32 h-12 bg-gray-200 rounded animate-pulse"></div>
                <div>
                  <p className="text-sm text-gray-600">Cargando...</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-16 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg mx-auto max-w-4xl"></div>
              <div className="h-6 bg-gray-200 rounded mx-auto max-w-2xl"></div>
            </div>
          </div>
        </section>

        {/* Products Grid Skeleton */}
        <section className="py-8 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <Toaster />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative w-32 h-12 hover:scale-105 transition-transform duration-300 cursor-pointer">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura_de_pantalla_2025-06-10_210739-removebg-preview-u5U4MnjC9NBIef2Jym8Y8xXxKFGuoa.png"
                  alt="Essenza Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-sm text-gray-600">Perfumes Corrientes</p>
            </div>
            <div className="flex items-center space-x-2">
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative hover:scale-105 transition-all duration-300"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                        {getTotalItems()}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Carrito de Compras ({getTotalItems()})
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 flex flex-col h-[calc(100vh-120px)]">
                    {cart.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center animate-fade-in">
                          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">Tu carrito está vacío</p>
                          <p className="text-sm text-gray-400 mt-2">¡Agrega algunos perfumes increíbles!</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                          {cart.map((item, index) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-all duration-300 animate-slide-in"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <div className="w-16 h-16 relative bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex-shrink-0 overflow-hidden">
                                <Image
                                  src={item.imagen || "/placeholder.svg"}
                                  alt={item.nombre}
                                  fill
                                  className="object-contain p-2 hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm line-clamp-2">{item.nombre}</h4>
                                <p className="text-xs text-gray-500">{item.marca}</p>
                                <p className="font-semibold text-purple-600">{formatPrice(item.precio)}</p>
                              </div>
                              <div className="flex items-center space-x-2 flex-shrink-0">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-purple-100 transition-colors duration-200"
                                  onClick={() => updateQuantity(item.id, (item.quantity ?? 1) - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm font-medium">{item.quantity ?? 1}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-purple-100 transition-colors duration-200"
                                  onClick={() => updateQuantity(item.id, (item.quantity ?? 1) + 1)}
                                  disabled={false}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="border-t pt-4 space-y-4 bg-white flex-shrink-0">
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Código de descuento"
                                value={discountCode}
                                onChange={e => setDiscountCode(e.target.value)}
                                className="max-w-xs"
                                disabled={discountApplied}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleApplyDiscount}
                                disabled={discountApplied}
                              >
                                {discountApplied ? "Aplicado" : "Aplicar"}
                              </Button>
                            </div>
                            {discountError && (
                              <span className="text-xs text-red-500">{discountError}</span>
                            )}
                            {discountApplied && (
                              <span className="text-xs text-green-600">¡Descuento aplicado!</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 p-3 bg-pink-50 rounded-lg border border-pink-200">
                            <input
                              type="checkbox"
                              id="giftWrapping"
                              checked={giftWrapping}
                              onChange={(e) => setGiftWrapping(e.target.checked)}
                              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                            />
                            <label htmlFor="giftWrapping" className="text-sm font-medium text-gray-700 cursor-pointer">
                              ¿Es para regalo? (+{formatPrice(COSTO_ENVOLTORIO_REGALO)})
                            </label>
                          </div>
                          <div className="flex justify-between items-center text-base">
                            <span>Subtotal:</span>
                            <span>{formatPrice(cart.reduce((total, item) => total + item.precio * (item.quantity ?? 1), 0))}</span>
                          </div>
                          {giftWrapping && (
                            <div className="flex justify-between items-center text-base text-pink-700">
                              <span>Envoltorio de regalo:</span>
                              <span>+{formatPrice(COSTO_ENVOLTORIO_REGALO)}</span>
                            </div>
                          )}
                          {discountPercent > 0 && (
                            <div className="flex justify-between items-center text-base text-green-700">
                              <span>Descuento ({discountPercent}%):</span>
                              <span>-{formatPrice(getDiscountAmount())}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total:</span>
                            <span className="text-purple-600 animate-pulse">
                              {discountPercent > 0 ? formatPrice(getTotalWithDiscount()) : formatPrice(getTotalPrice())}
                            </span>
                          </div>
                          <Button
                            onClick={goToCheckout}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            size="lg"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Finalizar compra
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
              <Button
                variant="outline"
                size="icon"
                className="hover:scale-105 transition-all duration-300 relative"
                onClick={() => {
                  if (favorites.size > 0) {
                    toast({
                      title: `Tienes ${favorites.size} favoritos ❤️`,
                      description: "¡No olvides agregarlos al carrito!",
                    })
                  }
                }}
              >
                <Heart className="h-4 w-4" />
                {favorites.size > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {favorites.size}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="container mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-purple-200/50 shadow-lg shadow-purple-500/10 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-700">Corrientes, Argentina</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in">
            <span className="text-gray-900">Tu esencia,</span>
            <br />
            <span className="bg-gradient-to-r from-[#5D2A71] via-purple-500 to-pink-500 bg-clip-text text-transparent">
              nuestra pasión
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto animate-slide-up leading-relaxed">
            Descubrí fragancias únicas que reflejan tu personalidad.
            <span className="text-[#5D2A71] font-medium"> Calidad premium</span> a precios accesibles.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#5D2A71] to-purple-600 hover:from-[#4a2159] hover:to-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-xl shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
              onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explorar Catálogo
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
            <a
              href="https://wa.me/543794222701"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-[#5D2A71] font-medium transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consultar por WhatsApp
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Envíos a todo el país
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              +500 clientes felices
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Fragancias originales
            </div>
          </div>
        </div>
      </section>

      {/* Promo Section - Perfumeros */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5D2A71] via-purple-600 to-pink-500 p-1">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20 animate-pulse" />
            <div className="relative bg-white/95 backdrop-blur-xl rounded-[22px] p-8 md:p-10">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Image Section */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                  <div className="relative w-40 h-40 md:w-48 md:h-48 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 transform group-hover:scale-105 transition-transform duration-500">
                    <Image
                      src={addCacheBusting("https://i.imgur.com/yMxitsz.png")}
                      alt="Perfumeros"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
                    <span className="text-lg">✨</span>
                    <span className="text-sm font-semibold text-[#5D2A71]">OFERTA ESPECIAL</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    Perfumeros Portátiles
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg max-w-xl">
                    Lleva tu fragancia favorita a todos lados. Compactos, elegantes y recargables.
                  </p>

                  {/* Pricing Cards */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-4">
                    <div className="relative group/price px-6 py-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all duration-300">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Unidad</p>
                      <p className="text-2xl font-bold text-gray-800">$3.500</p>
                    </div>
                    <div className="relative px-6 py-4 bg-gradient-to-br from-[#5D2A71] to-purple-600 rounded-xl shadow-lg shadow-purple-500/25 transform hover:scale-105 transition-all duration-300">
                      <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        AHORRÁ 50%
                      </div>
                      <p className="text-xs text-purple-200 uppercase tracking-wider mb-1">Pack x3</p>
                      <p className="text-2xl font-bold text-white">$7.000</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 flex items-center justify-center lg:justify-start gap-2">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Stock disponible • Envío a todo el país
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TikTok Section */}
      <TikTokSection />

      {/* Filters */}
      <section className="py-6 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar perfumes, marcas o referencias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-[#5D2A71]"
              />
            </div>
            <div className="flex gap-4 items-center">
              <Select value={selectedGender} onValueChange={setSelectedGender}>
                <SelectTrigger className="w-32 hover:border-[#5D2A71] transition-colors duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {genders.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-40 hover:border-[#5D2A71] transition-colors duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44 hover:border-[#5D2A71] transition-colors duration-200">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marca">Ordenar: Marca</SelectItem>
                  <SelectItem value="nombre">Ordenar: Nombre</SelectItem>
                  <SelectItem value="precio-asc">Precio: Menor a mayor</SelectItem>
                  <SelectItem value="precio-desc">Precio: Mayor a menor</SelectItem>
                  <SelectItem value="rating">Mejor valorados</SelectItem>
                </SelectContent>
              </Select>
              {(searchTerm || selectedGender !== "Todos" || selectedBrand !== "Todas") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="hover:bg-purple-50 transition-colors duration-200"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>
          {filteredPerfumes.length > 0 && (
            <p className="text-sm text-gray-600 mt-2 animate-fade-in">
              Mostrando {displayedPerfumes.length} de {filteredPerfumes.length} perfume{filteredPerfumes.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section id="productos" className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedPerfumes.map((perfume, index) => (
              <ProductCard
                key={perfume.id}
                perfume={perfume}
                index={index}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                formatPrice={formatPrice}
                addToCart={addToCart}
                addingToCart={addingToCart}
                selectedPerfume={selectedPerfume}
                setSelectedPerfume={(p) => setSelectedPerfume(p)}
              />
            ))}
          </div>

          {canLoadMore && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                onClick={() => setItemsToShow((n) => n + 12)}
                className="hover:bg-purple-50 hover:border-[#5D2A71]"
              >
                Mostrar más
              </Button>
            </div>
          )}

          {filteredPerfumes.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="max-w-md mx-auto">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No se encontraron perfumes</p>
                <p className="text-gray-400 text-sm mb-4">Intenta con otros filtros o términos de búsqueda</p>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="hover:bg-purple-50 transition-colors duration-200"
                >
                  Limpiar filtros
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md py-8 px-4 mt-12">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-32 h-16 relative hover:scale-110 transition-transform duration-300">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura_de_pantalla_2025-06-10_210739-removebg-preview-u5U4MnjC9NBIef2Jym8Y8xXxKFGuoa.png"
                alt="Essenza Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <p className="text-gray-600 mb-4">Perfumes Corrientes - Tu esencia, nuestra pasión</p>
          <div className="flex justify-center space-x-6 text-sm text-gray-600">
            <a href="#" className="hover:text-[#5D2A71] transition-colors duration-300 hover:scale-105 transform">
              Contacto
            </a>
            <a href="#" className="hover:text-[#5D2A71] transition-colors duration-300 hover:scale-105 transform">
              Instagram
            </a>
            <a href="#" className="hover:text-[#5D2A71] transition-colors duration-300 hover:scale-105 transform">
              WhatsApp
            </a>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
