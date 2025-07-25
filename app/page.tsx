"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
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
// para el commit

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
}

const perfumes: Perfume[] = [
  {
    id: 1,
    marca: "Lattafa",
    nombre: "Badee Al Oud Sublime 100ml EDP",
    imagen: "https://i.imgur.com/6onMEB2.png",
    precio: 51000,
    notas: {
      salida: ["Manzana", "Lichi", "Rosa"],
      corazon: ["ciruela", "jazmín"],
      fondo: ["vainila", "musgo", "pachulí"],
    },
    genero: "Mujer",
    fragancia_referencia: "Eden Juicy Apple",
    descripcion:
      "Es una fragancia de la familia olfativa Amaderada Aromática para Hombres y Mujeres. Esta fragrancia es nueva. Badee Al Oud Sublime se lanzó en 2023.",
    rating: 4.8,
  },
  {
    id: 10,
    marca: "Lattafa",
    nombre: "Haya",
    imagen: "https://i.imgur.com/lT4X1j2.png",
    precio: 51000,
    notas: {
      salida: ["champaña", "fresa", "naranja", "rosa"],
      corazon: ["gardenia", "orquídea de vainilla", "jazmin"],
      fondo: ["sándalo", "ámbar", "castaña"],
    },
    genero: "Mujer",
    fragancia_referencia: "Prada Paradox",
    descripcion:
      "Es una fragancia de la familia olfativa para Mujeres. Esta fragrancia es nueva. Haya se lanzó en 2022.",
    rating: 4.7,
  },

  {
    id: 17,
    marca: "Perfumeros",
    nombre: "Perfumeros",
    imagen: "https://i.imgur.com/yMxitsz.png",
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
  },
    {
    id: 42,
    marca: "Maison Alhambra",
    nombre: "Vogue Party 100ml EDP",
    imagen: "https://i.imgur.com/o0c6Czi.png", 
    precio: 34200, 
    notas: {
      salida: ["Almendra", "cereza"],
      corazon: ["Agua de rosas", "azucena", "almizcle ambreta"],
      fondo: ["Haba tonka", "vainilla", "musgo de roble", "vetiver"],
    },
    genero: "Mujer",
    fragancia_referencia: "Carolina Herrera Very Good Girl Glam",
    descripcion:
      "Una fragancia atrevida, sofisticada y adictiva… como una noche de gala que no querés que termine. Perfecta para salidas nocturnas, fiestas o cualquier momento en el que quieras dejar una impresión elegante y misteriosa. Es una fragancia que abraza la piel y despierta los sentidos. Dulce, floral, con un fondo cálido y envolvente… Vogue Party es tu mejor accesorio de noche. Dupe de Carolina Herrera Very Good Girl Glam.",
    rating: 4.8,
    sinDescuento: false,
  },
  {
    id: 25,
    marca: "Maison Alhambra",
    nombre: "Avant 100ml EDP",
    imagen: "https://i.imgur.com/w6gIGwg.png",
    precio: 27000,
    notas: {
      salida: ["Notas verdes", "Bergamota", "Limón"],
      corazon: ["Pimienta negra", "Jazmín", "Lavanda"],
      fondo: ["Vetiver", "Pachulí", "Almizcle"],
    },
    genero: "Hombre",
    fragancia_referencia: "Creed Aventus",
    descripcion:
      "Versátil. Ideal para el día, salidas o eventos. Aroma masculino, elegante y seguro. Deja huella sin exagerar.",
    sinDescuento: true,
    rating: 4.9,
  },
  {
    id: 24,
    marca: "Maison Alhambra",
    nombre: "Jean Lowe Fraiche 100ml EDP",
    imagen: "https://i.imgur.com/xa8yGJW.png",
    precio: 26000,
    notas: {
      salida: ["Pétalos de rosa", "Caramelo"],
      corazon: ["Jazmín", "Cacao", "Madera de agar (oud)"],
      fondo: ["Cuero", "Ámbar", "Vainilla"],
    },
    genero: "Hombre",
    fragancia_referencia: "Nouveau Monde de Louis Vuitton",
    descripcion:
      "Exótica, sofisticada y envolvente. Jean Lowe Fraiche captura el espíritu aventurero combinando dulzura, especias y sensualidad profunda.",
    sinDescuento: true,
    rating: 4.8,
  },
  {
    id: 35,
    marca: "Lattafa Perfumes",
    nombre: "Mayar 100ml EDP",
    imagen: "https://i.imgur.com/QOyJ3Fy.png",
    precio: 39000,
    notas: {
      salida: ["Lichi", "frambuesa", "hojas de violeta"],
      corazon: ["Rosa blanca", "peonía", "jazmín"],
      fondo: ["Almizcle", "vainilla"],
    },
    genero: "Mujer",
    fragancia_referencia: "Angel Nova de Mugler",
    descripcion: "Dulce y femenina, ideal para el día y ocasiones casuales en primavera y verano. Perfecta para salidas diarias, encuentros informales o eventos donde se busque un aroma fresco y romántico.",
    rating: 4.7,
    sinDescuento: false,
  },
  {
    id: 36,
    marca: "Britney Spears",
    nombre: "Fantasy 100ml EDP",
    imagen: "https://i.imgur.com/RMxS2Is.png",
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
  },
  {
    id: 37,
    marca: "Maison Alhambra",
    nombre: "Jorge di Profumo 100ml EDP",
    imagen: "https://i.imgur.com/U48EYDK.png",
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
  },
  {
    id: 43,
    marca: "Victorioso",
    nombre: "Fearless 100ml EDP",
    imagen: "https://i.imgur.com/EnagqZ9.png",
    precio: 36400,
    notas: {
      salida: ["piña", "manzana"],
      corazon: ["lavanda"],
      fondo: ["vainilla", "ámbar"],
    },
    genero: "Hombre",
    fragancia_referencia: "Liquid Brun de French Avenue",
    descripcion: "Cotidiano, moderno y audaz. Inspirado en Liquid Brun de French Avenue.",
    rating: 4.7,
    sinDescuento: false,
  },
  {
    id: 45,
    marca: "Maison Alhambra",
    nombre: "Salvo 100ml EDP",
    imagen: "https://i.imgur.com/M1SsSjv.png", 
    precio: 32000, 
    notas: {
      salida: ["Bergamota"],
      corazon: ["Lavanda", "pimienta de Sichuan", "anís estrellado", "nuez moscada"],
      fondo: ["Ambroxan", "vainilla"],
    },
    genero: "Hombre",
    fragancia_referencia: "Sauvage de Dior",
    descripcion: "Intensa, magnética y adictiva. Una fragancia masculina con presencia arrolladora. Perfecta para todo momento: de día, de noche, para la oficina o una salida especial. Es una fragancia versátil, vibrante y seductora, ideal para el hombre que quiere dejar huella sin esfuerzo. Frescura cítrica, corazón especiado y un fondo cálido que envuelve la piel… Dupe de Sauvage de Dior.",
    rating: 4.8,
    sinDescuento: false,
  },
  {
    id: 46,
    marca: "Maison Alhambra",
    nombre: "Jean Lowe Inmortal 30ml EDP",
    imagen: "https://i.imgur.com/qJVdGgU.png",
    precio: 15000,
    notas: {
      salida: ["Pétalos de rosa", "Caramelo"],
      corazon: ["Jazmín", "Cacao", "Madera de agar (oud)"],
      fondo: ["Cuero", "Ámbar", "Vainilla"],
    },
    genero: "Hombre",
    fragancia_referencia: "Nouveau Monde de Louis Vuitton",
    descripcion:
      "Exótica, sofisticada y envolvente. Jean Lowe Fraiche captura el espíritu aventurero combinando dulzura, especias y sensualidad profunda.",
    sinDescuento: true,
    rating: 4.8,
  },
  {
    id: 31,
    marca: "Maison Alhambra",
    nombre: "Céleste 100ml EDP",
    imagen: "https://i.imgur.com/tte0WD0.png",
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
  },

  {
    id: 47,
    marca: "Maison Alhambra",
    nombre: "Dark Door Sport 100ml EDP",
    imagen: "https://i.imgur.com/GsOmOMD.png",
    precio: 32000,
    notas: {
      salida: ["Pomelo", "Limón", "Resina de elemí", "Bergamota"],
      corazon: ["Jengibre", "Cedro", "Vetiver"],
      fondo: ["Lavanda", "Romero", "Sándalo"],
    },
    genero: "Hombre",
    fragancia_referencia: "Dior Homme Sport",
    descripcion:
      "Perfecto para el día, entrenar o climas cálidos. Energética, fresca y moderna. Transmite vitalidad con elegancia.",
    sinDescuento: true,
    rating: 4.7,
  },
  {
    id: 48,
    marca: "Glacier",
    nombre: "Glacier Bella 100ml EDP",
    imagen: "https://i.imgur.com/fr6qoDI.png",
    precio: 30000,
    notas: {
      salida: ["Pera", "bergamota"],
      corazon: ["Acordes florales", "cuero suave"],
      fondo: ["Vainilla", "vetiver", "ámbar", "almizcle"],
    },
    genero: "Mujer",
    fragancia_referencia: "Le Belle – Jean Paul Gaultier",
    descripcion: "Una fragancia cautivadora, sensual y adictiva… inspirada en la elegancia y la feminidad intensa de Le Belle – Jean Paul Gaultier. Ideal para salidas nocturnas, citas especiales o cuando querés destacar con un aroma seductor y envolvente. Perfecta para otoño e invierno, aunque su dulzura puede acompañarte todo el año. Para mujeres que saben lo que quieren y no temen dejar huella.",
    rating: 4.8,
    sinDescuento: false,
  },

  {
    id: 51,
    marca: "Afnan",
    nombre: "9PM 100ml EDP",
    imagen: "https://i.imgur.com/oFaHcbs.png", 
    precio: 61500, 
    notas: {
      salida: ["Manzana", "canela", "lavanda silvestre", "bergamota"],
      corazon: ["Flor de azahar", "lirio de los valles"],
      fondo: ["Vainilla", "haba tonka", "ámbar", "pachulí"],
    },
    genero: "Hombre",
    fragancia_referencia: "Ultra Male de Jean Paul Gaultier",
    descripcion: "Un perfume dulce, seductor y con carácter, ideal para destacar cuando el sol se esconde. Ideal para salidas nocturnas, citas o eventos donde querés dejar una impresión duradera. Su combinación de notas dulces y especiadas lo convierte en un perfume envolvente, intenso y adictivo. ¿Amás Ultra Male de Jean Paul Gaultier? Este es su dupe perfecto, con excelente duración y proyección. 9PM: Porque algunas fragancias están hechas para brillar después del atardecer.",
    rating: 4.8,
    sinDescuento: false,
  },
  {
    id: 52,
    marca: "Maison Alhambra",
    nombre: "Alive Now 30ml EDP",
    imagen: "https://i.imgur.com/HayfLR8.png", 
    precio: 15000, 
    notas: {
      salida: ["Ciruela", "manzana", "canela"],
      corazon: ["Jazmín", "vainilla"],
      fondo: ["Cedro", "sándalo", "almizcle"],
    },
    genero: "Mujer",
    fragancia_referencia: "Angel Nova de Mugler",
    descripcion: "Versátil y moderna, ideal para el uso diario o para una salida especial. Funciona muy bien en otoño e invierno gracias a sus notas cálidas y envolventes. Su mezcla frutal y dulce con un fondo amaderado le da un carácter elegante y seductor, perfecto para mujeres seguras y auténticas. Imitación del Angel Nova de Mugler.",
    rating: 4.8,
    sinDescuento: false,
  },
  {
    id: 53,
    marca: "Prune Moi",
    nombre: "Pruñe Moi 60ml EDP",
    imagen: "https://i.imgur.com/QYfUfRt.png",
    precio: 25000, 
    notas: {
      salida: ["Cassis"],
      corazon: ["Jazmín", "rosas"],
      fondo: ["Vainilla", "patchouli"],
    },
    genero: "Mujer",
    fragancia_referencia: "",
    descripcion: "Ideal para ocasiones especiales, salidas nocturnas o eventos donde quieras dejar una impresión elegante y sensual. Su combinación cálida y floral la hace perfecta para otoño e invierno, con buena duración y proyección gracias al patchouli y la vainilla.",
    rating: 4.7,
    sinDescuento: false,
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
  const [discountError, setDiscountError] = useState<string>("");

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

  const brands = ["Todas", ...new Set(perfumes.map((p) => p.marca))]
  const genders = ["Todos", "Mujer", "Hombre", "Unisex"]

  const filteredPerfumes = useMemo(() => {
    return perfumes.filter((perfume) => {
      const matchesSearch =
        perfume.nombre.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        perfume.marca.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        perfume.fragancia_referencia?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      const matchesGender = selectedGender === "Todos" || perfume.genero === selectedGender
      const matchesBrand = selectedBrand === "Todas" || perfume.marca === selectedBrand

      return matchesSearch && matchesGender && matchesBrand
    })
  }, [debouncedSearchTerm, selectedGender, selectedBrand])

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }, [])

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
    return cart.reduce((total, item) => total + item.precio * (item.quantity ?? 1), 0)
  }, [cart])

  const getDiscountAmount = useCallback(() => {
    return (getTotalPrice() * discountPercent) / 100;
  }, [getTotalPrice, discountPercent]);

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

  const generateWhatsAppMessage = useCallback(() => {
    let message = "🌸 ¡Hola! Me interesa comprar los siguientes perfumes de ESSENZA:\n\n"

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.nombre}\n`
      message += `   Marca: ${item.marca}\n`
      message += `   Cantidad: ${item.quantity ?? 1}\n`
      message += `   Precio unitario: ${formatPrice(item.precio)}\n`
      message += `   Subtotal: ${formatPrice(item.precio * (item.quantity ?? 1))}\n\n`
    })

    if (discountPercent > 0) {
      message += `Descuento aplicado: -${discountPercent}% (${formatPrice(getDiscountAmount())})\n`
      message += `*TOTAL CON DESCUENTO: ${formatPrice(getTotalWithDiscount())}*\n\n`
    } else {
      message += `*TOTAL: ${formatPrice(getTotalPrice())}*\n\n`
    }
    message += "¿Podrías confirmarme la disponibilidad y el método de pago? ¡Gracias! "

    return encodeURIComponent(message)
  }, [cart, formatPrice, getTotalPrice, discountPercent, getDiscountAmount, getTotalWithDiscount])

  const sendToWhatsApp = useCallback(() => {
    const phoneNumber = "5493794800282"
    const message = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    window.open(whatsappUrl, "_blank")
    setIsCartOpen(false)
    toast({
      title: "Redirigiendo a WhatsApp 📱",
      description: "Te estamos llevando a WhatsApp para finalizar tu compra",
    })
  }, [generateWhatsAppMessage])

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
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
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
                          <div className="flex justify-between items-center text-base">
                            <span>Subtotal:</span>
                            <span>{formatPrice(getTotalPrice())}</span>
                          </div>
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
                            onClick={sendToWhatsApp}
                            className="w-full bg-green-600 hover:bg-green-700 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            size="lg"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Finalizar compra por WhatsApp
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
      <section className="py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 animate-pulse"></div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-[#5D2A71] animate-fade-in">
            Bienvenid@ al lado más adictivo del perfume
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto animate-slide-up">
            Descubre nuestra colección exclusiva de fragancias que despiertan tus sentidos
          </p>
          <div className="flex justify-center space-x-2 animate-bounce">
            <Sparkles className="h-6 w-6 text-[#5D2A71]" />
            <Sparkles className="h-4 w-4 text-[#5D2A71]" />
            <Sparkles className="h-6 w-6 text-[#5D2A71]" />
          </div>
        </div>
      </section>

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
              Mostrando {filteredPerfumes.length} perfume{filteredPerfumes.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPerfumes.map((perfume, index) => (
              <Card
                key={perfume.id}
                className="group hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="p-0 relative overflow-hidden">
                  <div className="aspect-square relative bg-gradient-to-br from-purple-100 to-pink-100 group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-500">
                    <Image
                      src={perfume.imagen || "/placeholder.svg"}
                      alt={perfume.nombre}
                      fill
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white hover:scale-110 transition-all duration-300"
                      onClick={() => toggleFavorite(perfume.id)}
                    >
                      <Heart
                        className={`h-4 w-4 transition-all duration-300 ${
                          favorites.has(perfume.id)
                            ? "fill-red-500 text-red-500 scale-125"
                            : "text-gray-600 hover:text-red-500"
                        }`}
                      />
                    </Button>
                    <Badge
                      variant="secondary"
                      className={`absolute top-2 left-2 transition-all duration-300 hover:scale-105 ${
                        perfume.genero === "Mujer"
                          ? "bg-pink-100 text-pink-800 hover:bg-pink-200"
                          : perfume.genero === "Hombre"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                      }`}
                    >
                      {perfume.genero}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs hover:bg-purple-50 transition-colors duration-200">
                      {perfume.marca}
                    </Badge>
                    <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem] group-hover:text-[#5D2A71] transition-colors duration-300">
                      {perfume.nombre}
                    </h3>
                    {perfume.fragancia_referencia && (
                      <p className="text-xs text-gray-600 line-clamp-1">Inspirado en {perfume.fragancia_referencia}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#5D2A71] group-hover:scale-105 transition-transform duration-300">
                        {formatPrice(perfume.precio)}
                      </span>
                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(perfume.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">{perfume.rating}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 hover:bg-purple-50 hover:border-[#5D2A71] transition-all duration-300"
                            onClick={() => setSelectedPerfume(perfume)}
                          >
                            Ver detalles
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          {selectedPerfume && (
                            <>
                              <DialogHeader>
                                <DialogTitle className="text-xl text-[#5D2A71]">{selectedPerfume.nombre}</DialogTitle>
                              </DialogHeader>
                              <div className="grid md:grid-cols-2 gap-6">
                                <div className="aspect-square relative bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden">
                                  <Image
                                    src={selectedPerfume.imagen || "/placeholder.svg"}
                                    alt={selectedPerfume.nombre}
                                    fill
                                    className="object-contain p-4 hover:scale-110 transition-transform duration-500"
                                  />
                                </div>
                                <div className="space-y-4">
                                  <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline">{selectedPerfume.marca}</Badge>
                                    <Badge
                                      variant="secondary"
                                      className={`${
                                        selectedPerfume.genero === "Mujer"
                                          ? "bg-pink-100 text-pink-800"
                                          : selectedPerfume.genero === "Hombre"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-purple-100 text-purple-800"
                                      }`}
                                    >
                                      {selectedPerfume.genero}
                                    </Badge>
                                  </div>
                                  <div className="text-2xl font-bold text-[#5D2A71]">
                                    {formatPrice(selectedPerfume.precio)}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <div className="flex">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-4 w-4 ${
                                            i < Math.floor(selectedPerfume.rating)
                                              ? "fill-yellow-400 text-yellow-400"
                                              : "text-gray-300"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-gray-600">{selectedPerfume.rating} estrellas</span>
                                  </div>
                                  {selectedPerfume.fragancia_referencia && (
                                    <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded-lg">
                                      <strong>Inspirado en:</strong> {selectedPerfume.fragancia_referencia}
                                    </p>
                                  )}
                                  <p className="text-sm text-gray-700 leading-relaxed">{selectedPerfume.descripcion}</p>
                                  <div className="space-y-3 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                                    <h4 className="font-semibold flex items-center gap-2">
                                      <Sparkles className="h-4 w-4 text-[#5D2A71]" />
                                      Notas olfativas:
                                    </h4>
                                    {selectedPerfume.notas.salida.length > 0 && (
                                      <div>
                                        <span className="text-sm font-medium text-[#5D2A71]">Salida: </span>
                                        <span className="text-sm">{selectedPerfume.notas.salida.join(", ")}</span>
                                      </div>
                                    )}
                                    {selectedPerfume.notas.corazon.length > 0 && (
                                      <div>
                                        <span className="text-sm font-medium text-[#5D2A71]">Corazón: </span>
                                        <span className="text-sm">{selectedPerfume.notas.corazon.join(", ")}</span>
                                      </div>
                                    )}
                                    {selectedPerfume.notas.fondo.length > 0 && (
                                      <div>
                                        <span className="text-sm font-medium text-[#5D2A71]">Fondo: </span>
                                        <span className="text-sm">{selectedPerfume.notas.fondo.join(", ")}</span>
                                      </div>
                                    )}
                                  </div>
                                  <Button
                                    className="w-full bg-[#5D2A71] hover:bg-[#4A2259] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    onClick={() => addToCart(selectedPerfume)}
                                    disabled={addingToCart.has(selectedPerfume.id)}
                                  >
                                    {addingToCart.has(selectedPerfume.id) ? (
                                      <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Agregando...
                                      </>
                                    ) : (
                                      <>
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Agregar al carrito
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        className="bg-[#5D2A71] hover:bg-[#4A2259] hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg"
                        onClick={() => addToCart(perfume)}
                        disabled={addingToCart.has(perfume.id)}
                      >
                        {addingToCart.has(perfume.id) ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        ) : (
                          <ShoppingCart className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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
