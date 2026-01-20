import { useState, useMemo } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// ⚙️ CONFIGURACIÓN: Año mínimo para financiación
const MIN_FINANCE_YEAR = 2014; // NOTA: Cambiar a 2010 o 2015 según se confirme

const INTEREST_RATE = 0.089; // 8.9% TIN
const TERM_OPTIONS = [24, 36, 48, 60, 72]; // Meses disponibles

export default function FinanceCalculator({ car }) {
    const [downPayment, setDownPayment] = useState(0);
    const [selectedTerm, setSelectedTerm] = useState(48);

    // Verificar si el coche cumple requisitos de antigüedad
    const isEligible = car.year >= MIN_FINANCE_YEAR;

    // Calcular límites de entrada
    const maxDownPayment = Math.floor(car.precio * 0.5);

    // Calcular cuota mensual
    const monthlyPayment = useMemo(() => {
        if (!isEligible || !car.precio) return 0;

        const amountToFinance = car.precio - downPayment;
        const years = selectedTerm / 12;
        const totalWithInterest = amountToFinance * (1 + (INTEREST_RATE * years));
        const monthly = totalWithInterest / selectedTerm;

        return Math.round(monthly);
    }, [car.precio, downPayment, selectedTerm, isEligible]);

    // Generar mensaje WhatsApp
    const whatsappMessage = `Hola, quiero información del ${car.marca} ${car.modelo}. He calculado una cuota de ${monthlyPayment}€/mes con ${downPayment}€ de entrada a ${selectedTerm} meses.`;
    const whatsappLink = `https://wa.me/34683646930?text=${encodeURIComponent(whatsappMessage)}`;

    // Si no cumple requisitos de antigüedad
    if (!isEligible) {
        return (
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-8 border border-orange-200 shadow-xl">
                <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-orange-600 text-3xl">info</span>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            Financiación No Disponible
                        </h3>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Este vehículo no cumple los requisitos de antigüedad para financiación estándar.
                        </p>
                        <a
                            href={`https://wa.me/34683646930?text=${encodeURIComponent(`Hola, me interesa el ${car.marca} ${car.modelo} (${car.year}). ¿Tienen opciones de financiación personalizadas?`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                        >
                            <span className="material-symbols-outlined text-xl">chat</span>
                            <span>Consultar Opciones Personalizadas</span>
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">calculate</span>
                <h3 className="text-2xl font-bold text-slate-900">Calculadora de Financiación</h3>
            </div>

            {/* Entrada Inicial */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-slate-700">Entrada Inicial</label>
                    <span className="text-2xl font-bold text-primary">{downPayment.toLocaleString('es-ES')}€</span>
                </div>
                <Slider
                    min={0}
                    max={maxDownPayment}
                    value={downPayment}
                    onChange={setDownPayment}
                    step={100}
                    styles={{
                        track: { backgroundColor: '#004A99', height: 8 },
                        handle: {
                            backgroundColor: '#004A99',
                            borderColor: '#004A99',
                            width: 24,
                            height: 24,
                            marginTop: -8,
                            opacity: 1,
                            boxShadow: '0 2px 8px rgba(0, 74, 153, 0.3)'
                        },
                        rail: { backgroundColor: '#e2e8f0', height: 8 }
                    }}
                />
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                    <span>0€</span>
                    <span>{maxDownPayment.toLocaleString('es-ES')}€ (50%)</span>
                </div>
            </div>

            {/* Plazo */}
            <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Plazo de Financiación</label>
                <div className="grid grid-cols-5 gap-2">
                    {TERM_OPTIONS.map(term => (
                        <button
                            key={term}
                            onClick={() => setSelectedTerm(term)}
                            className={`py-3 px-2 rounded-lg font-bold text-sm transition-all ${selectedTerm === term
                                    ? 'bg-primary text-white shadow-lg scale-105'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            {term} m
                        </button>
                    ))}
                </div>
            </div>

            {/* Resultado */}
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-6 mb-6 border border-blue-100">
                <div className="text-center">
                    <p className="text-sm font-semibold text-slate-600 mb-2">Tu cuota mensual</p>
                    <p className="text-4xl font-bold text-primary mb-1">
                        {monthlyPayment.toLocaleString('es-ES')}€<span className="text-xl text-slate-500">/mes</span>
                    </p>
                    <p className="text-xs text-slate-500">TIN {(INTEREST_RATE * 100).toFixed(1)}% • {selectedTerm} meses</p>
                </div>
            </div>

            {/* Desglose */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-slate-600">Precio del vehículo</span>
                    <span className="font-semibold text-slate-900">{car.precio.toLocaleString('es-ES')}€</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-600">Entrada inicial</span>
                    <span className="font-semibold text-slate-900">-{downPayment.toLocaleString('es-ES')}€</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between">
                    <span className="text-slate-600">A financiar</span>
                    <span className="font-bold text-slate-900">{(car.precio - downPayment).toLocaleString('es-ES')}€</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                    <span>Total a pagar</span>
                    <span>{(monthlyPayment * selectedTerm + downPayment).toLocaleString('es-ES')}€</span>
                </div>
            </div>

            {/* CTA WhatsApp */}
            <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
            >
                <span className="material-symbols-outlined text-2xl">chat</span>
                <span>Solicitar Financiación por WhatsApp</span>
            </a>

            {/* Disclaimer */}
            <p className="text-xs text-slate-500 text-center mt-4 leading-relaxed">
                * Cálculo orientativo. Sujeto a aprobación de la entidad financiera. TIN {(INTEREST_RATE * 100).toFixed(1)}% sin comisiones ni gastos adicionales.
            </p>
        </div>
    );
}
