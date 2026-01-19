import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "../lib/supabaseClient";
import { extractIdFromSlug } from "../utils/slugUtils";

// Environmental label options
const LABEL_OPTIONS = [
    { value: '0', label: 'Cero Emisiones', image: '/etiquetas/DistAmbDGT_CeroEmisiones.svg' },
    { value: 'ECO', label: 'ECO', image: '/etiquetas/DistAmbDGT_ECO.svg' },
    { value: 'C', label: 'C', image: '/etiquetas/DistAmbDGT_C.svg' },
    { value: 'B', label: 'B', image: '/etiquetas/DistAmbDGT_B.svg' },
];

export default function VehicleDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        async function fetchCar() {
            // Extract ID from slug (only numeric ID is used for DB search)
            const carId = extractIdFromSlug(slug);

            if (!carId) {
                console.error("Invalid slug format");
                navigate('/catalogo');
                return;
            }

            const { data, error } = await supabase
                .from("coches")
                .select("*")
                .eq("id", carId)
                .single();

            if (error || !data) {
                console.error("Error fetching car:", error);
                navigate('/catalogo');
            } else {
                setCar(data);
            }
            setLoading(false);
        }

        fetchCar();
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!car) {
        return null; // Will redirect via useEffect
    }

    // Generate WhatsApp message
    const whatsappMessage = `Hola, me interesa el ${car.marca} ${car.modelo} con referencia ${car.id} que he visto en la web.`;
    const whatsappLink = `https://wa.me/34683646930?text=${encodeURIComponent(whatsappMessage)}`;

    // Format price
    const formatPrice = (price) => {
        if (!price || price === 0) return "Precio a consultar";
        return `${price.toLocaleString('es-ES')}€`;
    };

    // Generate SEO meta tags
    const pageTitle = `${car.marca} ${car.modelo}${car.year ? ` ${car.year}` : ''} en Tarragona | Automoción Navarro`;
    const pageDescription = `${car.marca} ${car.modelo}${car.year ? ` del ${car.year}` : ''} con ${car.km?.toLocaleString('es-ES') || 0} km. ${formatPrice(car.precio)}. Revisado y con garantía de 12 meses en Automoción Navarro.`;

    // Get environmental label
    const labelOption = LABEL_OPTIONS.find(opt => opt.value === car.etiqueta);

    // Image gallery (for future multi-image support, currently single image)
    const images = car.imagen ? [car.imagen] : [];

    return (
        <>
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:type" content="product" />
                {car.imagen && (
                    <meta property="og:image" content={`https://abvcgcemjxbfeibmtsxp.supabase.co/storage/v1/object/public/coches/${car.imagen}`} />
                )}
            </Helmet>

            <div className="min-h-screen bg-slate-50 pt-20">
                {/* Breadcrumb */}
                <div className="bg-white border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <nav className="flex items-center gap-2 text-sm text-slate-600">
                            <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
                            <span>/</span>
                            <Link to="/catalogo" className="hover:text-primary transition-colors">Catálogo</Link>
                            <span>/</span>
                            <span className="text-slate-900 font-medium">{car.marca} {car.modelo}</span>
                        </nav>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Image Gallery */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl overflow-hidden border border-slate-200 aspect-video relative">
                                {car.imagen ? (
                                    <picture className="w-full h-full">
                                        <source
                                            srcSet={`https://abvcgcemjxbfeibmtsxp.supabase.co/storage/v1/object/public/coches/${car.imagen.replace(/\.[^/.]+$/, "")}.webp`}
                                            type="image/webp"
                                        />
                                        <img
                                            src={`https://abvcgcemjxbfeibmtsxp.supabase.co/storage/v1/object/public/coches/${car.imagen}`}
                                            alt={`${car.marca} ${car.modelo}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/logo_nuevo_rect_png.png';
                                            }}
                                        />
                                    </picture>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-300">
                                        <span className="text-2xl font-black tracking-tighter text-slate-400">AUTOMOCIÓN</span>
                                        <span className="material-symbols-outlined text-6xl">directions_car</span>
                                    </div>
                                )}

                                {/* Environmental Badge Overlay */}
                                {labelOption?.image && (
                                    <div className="absolute bottom-4 left-4">
                                        <img
                                            src={labelOption.image}
                                            alt={`Etiqueta ${car.etiqueta}`}
                                            className="h-12 w-auto drop-shadow-lg"
                                            title={labelOption.label}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails (for future multi-image support) */}
                            {images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === index
                                                ? 'border-primary'
                                                : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            <img
                                                src={`https://abvcgcemjxbfeibmtsxp.supabase.co/storage/v1/object/public/coches/${img}`}
                                                alt={`Vista ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Column - Vehicle Info */}
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="bg-white rounded-xl p-6 border border-slate-200">
                                <div className="flex items-start justify-between mb-2">
                                    <h1 className="text-3xl font-bold text-slate-900">
                                        {car.marca} {car.modelo}
                                    </h1>
                                    {car.year && (
                                        <span className="text-lg font-semibold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg">
                                            {car.year}
                                        </span>
                                    )}
                                </div>
                                {car.version && (
                                    <p className="text-slate-600 text-lg mb-4">{car.version}</p>
                                )}
                                <div className="text-4xl font-bold text-primary">
                                    {formatPrice(car.precio)}
                                </div>
                            </div>

                            {/* Technical Grid */}
                            <div className="bg-white rounded-xl p-6 border border-slate-200">
                                <h2 className="text-lg font-bold text-slate-900 mb-4">Especificaciones Técnicas</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <span className="material-symbols-outlined text-primary text-2xl">add_road</span>
                                        <div>
                                            <div className="text-xs text-slate-500">Kilometraje</div>
                                            <div className="font-semibold text-slate-900">{car.km?.toLocaleString('es-ES') || 0} km</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <span className="material-symbols-outlined text-primary text-2xl">speed</span>
                                        <div>
                                            <div className="text-xs text-slate-500">Potencia</div>
                                            <div className="font-semibold text-slate-900">{car.cv || 'N/A'} CV</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <span className="material-symbols-outlined text-primary text-2xl">local_gas_station</span>
                                        <div>
                                            <div className="text-xs text-slate-500">Combustible</div>
                                            <div className="font-semibold text-slate-900">{car.combustible || 'N/A'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <span className="material-symbols-outlined text-primary text-2xl">engineering</span>
                                        <div>
                                            <div className="text-xs text-slate-500">Motor</div>
                                            <div className="font-semibold text-slate-900">{car.motor || 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Compromiso Navarro Section */}
                            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-6 border border-blue-100">
                                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-2xl">verified</span>
                                    Compromiso Navarro
                                </h2>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-green-600 text-xl mt-0.5">check_circle</span>
                                        <div>
                                            <div className="font-semibold text-slate-900">Revisión en Constantí</div>
                                            <div className="text-sm text-slate-600">100 puntos de control verificados</div>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-green-600 text-xl mt-0.5">check_circle</span>
                                        <div>
                                            <div className="font-semibold text-slate-900">Garantía de 12 meses</div>
                                            <div className="text-sm text-slate-600">Cobertura total incluida</div>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-green-600 text-xl mt-0.5">check_circle</span>
                                        <div>
                                            <div className="font-semibold text-slate-900">Transparencia Total</div>
                                            <div className="text-sm text-slate-600">Sin costes ocultos ni sorpresas</div>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* CTA Buttons */}
                            <div className="grid grid-cols-2 gap-4">
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.807-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.198-.198.347-.768.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.151-.174.2-.298.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                                    </svg>
                                    <span>Reservar</span>
                                </a>
                                <Link
                                    to="/catalogo"
                                    className="bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all"
                                >
                                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                                    <span>Ver Catálogo</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating WhatsApp Button */}
                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all z-50 flex items-center gap-3 group"
                    aria-label="Contactar por WhatsApp"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.807-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.198-.198.347-.768.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.151-.174.2-.298.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                    </svg>
                    <span className="hidden group-hover:inline-block font-semibold whitespace-nowrap">Consultar ahora</span>
                </a>
            </div>
        </>
    );
}
