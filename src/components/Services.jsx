const services = [
    {
        icon: (
            <svg
                fill="none"
                height="32"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="32"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
        ),
        title: "Garantía Total Navarro (12 Meses)",
        description:
            "12 meses de cobertura mecánica real. Sometemos a cada coche a una revisión de 100 puntos clave para que tu única preocupación sea disfrutar del trayecto.",
        extra: "Cobertura Nacional",
    },
    {
        icon: (
            <svg
                fill="none"
                height="32"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="32"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" x2="8" y1="13" y2="13"></line>
                <line x1="16" x2="8" y1="17" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
        ),
        title: "Gestión Administrativa Completa",
        description:
            "Olvídate del papeleo. Nos encargamos de toda la tramitación del cambio de nombre y gestoría para que te lleves tu coche al instante y sin complicaciones.",
    },
    {
        icon: (
            <svg
                fill="none"
                height="32"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="32"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
            </svg>
        ),
        title: "Localización de Vehículos Premium",
        description:
            "¿Tienes un modelo específico en mente? Localizamos, revisamos y certificamos el coche de tus sueños con total transparencia y rigor técnico.",
    },
];

export default function Services() {
    return (
        <section
            className="py-24 bg-gray-50 border-y border-gray-100"
            id="servicios"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#1F2937] mb-4 tracking-tight">
                        Nuestra Garantía de Confianza
                    </h2>
                    <p className="text-slate-600 text-lg">
                        Calidad certificada y transparencia mecánica en cada vehículo.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                        >
                            <div className="w-16 h-16 bg-[#004A99]/10 text-[#004A99] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#004A99] group-hover:text-white transition-all duration-300">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-[#1F2937] mb-4">
                                {service.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                {service.description}
                            </p>
                            {service.extra && (
                                <div className="mt-auto">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-50 text-[#004A99] border border-blue-100">
                                        {service.extra}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
