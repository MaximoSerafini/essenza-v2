"use client"

import { useState, useMemo, useEffect, useCallback, memo } from "react"
import { useRouter } from 'next/navigation'
import Image from "next/image"
import { Search, Heart, ShoppingCart, Star, Plus, Minus, X, Send, Filter, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
// para el commit

import { Perfume, perfumes as basePerfumes } from "@/lib/data"

// Costo adicional para envoltorio de regalo
const COSTO_ENVOLTORIO_REGALO = 0;

// Función para agregar cache busting a las imágenes en desarrollo
const addCacheBusting = (url: string) => {
  if (process.env.NODE_ENV === 'development') {
    return `${url}?v=${Date.now()}`
  }
  return url
}


const perfumes: Perfume[] = basePerfumes.map(p => ({
  ...p,
  imagen: p.imagen.includes('imgur.com') ? addCacheBusting(p.imagen) : p.imagen
}))

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

            {/* New Badge */}
            {perfume.esNuevo && (
              <div className="absolute top-3 right-14">
                <span className="px-3 py-1.5 rounded-xl text-[10px] font-black bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 text-purple-950 shadow-[0_4px_12px_rgba(251,191,36,0.3)] animate-pulse border border-white/40 backdrop-blur-md tracking-widest leading-none">
                  NUEVO
                </span>
              </div>
            )}

            {/* Gender Badge */}
            <div className="absolute top-3 left-3">
              <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold backdrop-blur-xl border border-white/30 shadow-sm tracking-widest ${perfume.genero === "Mujer"
                ? "bg-pink-500/20 text-pink-700"
                : perfume.genero === "Hombre"
                  ? "bg-blue-500/20 text-blue-700"
                  : "bg-purple-500/20 text-purple-700"
                }`}>
                {perfume.genero.toUpperCase()}
              </span>
            </div>

            {/* Sellado/Abierto Badge */}
            <div className="absolute bottom-3 left-3">
              {perfume.sellado === false && (
                <span className="px-3 py-1.5 rounded-xl text-[10px] font-bold bg-amber-500/10 text-amber-700 backdrop-blur-xl border border-white/30 shadow-sm tracking-widest uppercase">
                  Abierto
                </span>
              )}
              {perfume.sellado === true && (
                <span className="px-3 py-1.5 rounded-xl text-[10px] font-bold bg-emerald-500/10 text-emerald-700 backdrop-blur-xl border border-white/30 shadow-sm flex items-center gap-1.5 tracking-widest uppercase">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
            <div className="flex items-end justify-between pt-4 border-t border-gray-100/50">
              <div className="group/price relative">
                <p className="text-sm text-gray-400 font-medium mb-1">Precio</p>
                <p className="text-2xl font-extrabold bg-gradient-to-r from-purple-900 via-purple-700 to-pink-600 bg-clip-text text-transparent">
                  {formatPrice(perfume.precio)}
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-100 shadow-sm animate-float">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-amber-700 tracking-tight">{perfume.rating}</span>
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
                            <DialogTitle className="text-2xl font-bold">{selectedPerfume.nombre}</DialogTitle>
                            <DialogDescription className="sr-only">
                              Detalles del perfume {selectedPerfume.nombre} de la marca {selectedPerfume.marca}
                            </DialogDescription>
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
      // Priorizar productos nuevos
      if (a.esNuevo && !b.esNuevo) return -1;
      if (!a.esNuevo && b.esNuevo) return 1;

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
      <header className="premium-blur shadow-sm sticky top-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5" />
        <div className="container mx-auto px-4 py-3 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative w-36 h-14 hover:scale-105 transition-transform duration-500 cursor-pointer drop-shadow-sm">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura_de_pantalla_2025-06-10_210739-removebg-preview-u5U4MnjC9NBIef2Jym8Y8xXxKFGuoa.png"
                  alt="Essenza Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-900/40">Premium Parfums</p>
                <p className="text-sm font-medium text-purple-900/60 font-serif italic">Corrientes, Argentina</p>
              </div>
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
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 animate-fade-in tracking-tighter">
            <span className="text-gray-900 drop-shadow-sm">Tu esencia,</span>
            <br />
            <span className="bg-gradient-to-r from-purple-900 via-purple-600 to-pink-500 bg-clip-text text-transparent font-serif italic font-normal tracking-normal">
              nuestra pasión
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto animate-slide-up leading-relaxed font-light">
            Descubrí fragancias exclusivas que definen tu historia.
            <span className="text-purple-900 font-semibold block mt-2">Experiencias sensoriales de lujo.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button
              size="lg"
              className="bg-purple-900 hover:bg-black text-white px-10 py-8 text-xl rounded-2xl shadow-2xl shadow-purple-900/20 transform hover:scale-105 transition-all duration-500 border border-purple-800/50 group"
              onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explorar Colección
              <Sparkles className="ml-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
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



      {/* Filters Section */}
      <section className="py-12 px-4 relative">
        <div className="container mx-auto">
          <div className="glass-card p-6 rounded-[2rem] border-purple-100/30">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="relative flex-1 w-full lg:max-w-xl group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-900/30 h-5 w-5 group-focus-within:text-purple-600 transition-colors" />
                <Input
                  placeholder="Buscar por marca, nombre o referencia olfativa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 bg-white/50 border-0 rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-purple-200 placeholder:text-purple-900/20 text-purple-900 font-medium transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-3 items-center justify-center lg:justify-end w-full lg:w-auto">
                <div className="flex gap-2 p-1.5 bg-purple-50/50 rounded-2xl border border-purple-100/50">
                  <Select value={selectedGender} onValueChange={setSelectedGender}>
                    <SelectTrigger className="w-32 h-10 border-0 bg-transparent focus:ring-0 font-semibold text-purple-900/70">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-purple-50">
                      {genders.map((gender) => (
                        <SelectItem key={gender} value={gender} className="rounded-lg">{gender}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="w-px h-6 bg-purple-200/50 my-auto" />

                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger className="w-40 h-10 border-0 bg-transparent focus:ring-0 font-semibold text-purple-900/70">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-purple-50">
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand} className="rounded-lg">{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 h-12 bg-white rounded-2xl border-purple-100 shadow-sm font-semibold text-purple-900/70">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-purple-50">
                    <SelectItem value="marca" className="rounded-lg">Marca (A-Z)</SelectItem>
                    <SelectItem value="nombre" className="rounded-lg">Nombre (A-Z)</SelectItem>
                    <SelectItem value="precio-asc" className="rounded-lg">Precio: Menor a mayor</SelectItem>
                    <SelectItem value="precio-desc" className="rounded-lg">Precio: Mayor a menor</SelectItem>
                    <SelectItem value="rating" className="rounded-lg">Mejor valorados</SelectItem>
                  </SelectContent>
                </Select>

                {(searchTerm || selectedGender !== "Todos" || selectedBrand !== "Todas") && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearFilters}
                    className="h-12 w-12 rounded-2xl bg-purple-100/50 text-purple-600 hover:bg-purple-200 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>

            {filteredPerfumes.length > 0 && (
              <div className="mt-6 flex items-center gap-2 px-2">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-pulse" />
                <p className="text-xs font-bold text-purple-900/40 uppercase tracking-widest">
                  Descubiertos: {displayedPerfumes.length} de {filteredPerfumes.length} Fragancias
                </p>
              </div>
            )}
          </div>
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
            <div className="flex justify-center mt-16 group/load">
              <Button
                variant="outline"
                onClick={() => setItemsToShow((n) => n + 12)}
                className="h-14 px-10 rounded-2xl bg-white/50 border-purple-100 text-purple-900 font-bold hover:bg-purple-900 hover:text-white hover:shadow-xl hover:shadow-purple-900/20 transition-all duration-500 group"
              >
                Cargar más fragancias
                <Plus className="ml-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
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
      <footer className="glass-card py-20 px-4 mt-20 border-t-0 rounded-t-[3rem]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div>
              <div className="relative w-40 h-16 mx-auto md:mx-0 mb-6 drop-shadow-sm">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura_de_pantalla_2025-06-10_210739-removebg-preview-u5U4MnjC9NBIef2Jym8Y8xXxKFGuoa.png"
                  alt="Essenza Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-purple-900/40 text-sm font-medium leading-relaxed max-w-xs mx-auto md:mx-0 italic font-serif">
                "Tu esencia, nuestra pasión. Llevando el lujo de las fragancias internacionales a cada rincón de Corrientes."
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-purple-900 font-bold tracking-widest uppercase text-xs">Explorar</h4>
              <nav className="flex flex-col space-y-2">
                <a href="#productos" className="text-purple-900/60 hover:text-purple-600 transition-colors text-sm font-medium">Catálogo Completo</a>
                <a href="#" className="text-purple-900/60 hover:text-purple-600 transition-colors text-sm font-medium">Novedades</a>
                <a href="#" className="text-purple-900/60 hover:text-purple-600 transition-colors text-sm font-medium">Favoritos</a>
              </nav>
            </div>

            <div className="space-y-4">
              <h4 className="text-purple-900 font-bold tracking-widest uppercase text-xs">Conectar</h4>
              <div className="flex justify-center md:justify-start space-x-6">
                <a href="#" className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-900 hover:bg-purple-900 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.56.216.96.474 1.38.894.42.42.678.82.894 1.38.163.422.358 1.057.412 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.412 2.227-.216.56-.474.96-.894 1.38-.42.42-.82.678-1.38.894-.422.163-1.057.358-2.227.412-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.412-.56-.216-.96-.474-1.38-.894-.42-.42-.678-.82-.894-1.38-.163-.422-.358-1.057-.412-2.227-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.249-1.805.412-2.227.216-.56.474-.96.894-1.38.42-.42.82-.678 1.38-.894.422-.163 1.057-.358 2.227-.412 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126s1.337 1.077 2.126 1.384c.766.296 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.261 2.913-.558.788-.306 1.459-.717 2.126-1.384s1.077-1.337 1.384-2.126c.296-.765.499-1.636.558-2.913.058-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.261-2.148-.558-2.913-.306-.788-.717-1.459-1.384-2.126s-1.337-1.077-2.126-1.384c-.766-.296-1.636-.499-2.913-.558C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-900 hover:bg-purple-900 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.01 2.01C6.48 2.01 2 6.48 2 12.01c0 5.53 4.48 10 10.01 10 5.53 0 10-4.47 10-10 0-5.53-4.47-10-10-10zm5.42 14.38c-.3.15-1.76.87-2.03.97-.27.1-.47.15-.67-.15-.2-.3-.77-.97-.94-1.16-.18-.2-.35-.23-.65-.08-.3.15-1.26.47-2.39 1.48-.89.79-1.48 1.76-1.65 2.06-.18.3-.02.46.13.61.13.13.3.35.45.52.15.17.2.3.3.5.1.2.05.37-.03.52-.08.15-.67 1.62-.92 2.21-.24.58-.49.5-.67.51-.18 0-.37 0-.57 0-.2 0-.52.07-.79.37-.28.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" /></svg>
                </a>
              </div>
              <p className="text-[10px] text-purple-900/30 uppercase tracking-[0.3em] pt-4">© 2026 Essenza Perfumes</p>
            </div>
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
