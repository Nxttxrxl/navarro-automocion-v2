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
    const totalWithInterest = amountToFinance * (1 + INTEREST_RATE * years);
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
          <span className="material-symbols-outlined text-orange-600 text-3xl">
            info
          </span>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Financiación No Disponible
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Este vehículo no cumple los requisitos de antigüedad para
              financiación estándar.
            </p>
            <a
              href={`https://wa.me/34683646930?text=${encodeURIComponent(`Hola, me interesa el ${car.marca} ${car.modelo} (${car.year}). ¿Tienen opciones de financiación personalizadas?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.807-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.198-.198.347-.768.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.151-.174.2-.298.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
              </svg>
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
        <span className="material-symbols-outlined text-primary text-3xl">
          calculate
        </span>
        <h3 className="text-2xl font-bold text-slate-900">
          Calculadora de Financiación
        </h3>
      </div>

      {/* Entrada Inicial */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-700">
            Entrada Inicial
          </label>
          <span className="text-2xl font-bold text-primary">
            {downPayment.toLocaleString('es-ES')}€
          </span>
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
              boxShadow: '0 2px 8px rgba(0, 74, 153, 0.3)',
            },
            rail: { backgroundColor: '#e2e8f0', height: 8 },
          }}
        />
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>0€</span>
          <span>{maxDownPayment.toLocaleString('es-ES')}€ (50%)</span>
        </div>
      </div>

      {/* Plazo */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Plazo de Financiación
        </label>
        <div className="grid grid-cols-5 gap-2">
          {TERM_OPTIONS.map((term) => (
            <button
              key={term}
              onClick={() => setSelectedTerm(term)}
              className={`py-3 px-2 rounded-lg font-bold text-sm transition-all ${
                selectedTerm === term
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
          <p className="text-sm font-semibold text-slate-600 mb-2">
            Tu cuota mensual
          </p>
          <p className="text-4xl font-bold text-primary mb-1">
            {monthlyPayment.toLocaleString('es-ES')}€
            <span className="text-xl text-slate-500">/mes</span>
          </p>
          <p className="text-xs text-slate-500">
            TIN {(INTEREST_RATE * 100).toFixed(1)}% • {selectedTerm} meses
          </p>
        </div>
      </div>

      {/* Desglose */}
      <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Precio del vehículo</span>
          <span className="font-semibold text-slate-900">
            {car.precio.toLocaleString('es-ES')}€
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Entrada inicial</span>
          <span className="font-semibold text-slate-900">
            -{downPayment.toLocaleString('es-ES')}€
          </span>
        </div>
        <div className="border-t border-slate-200 pt-2 flex justify-between">
          <span className="text-slate-600">A financiar</span>
          <span className="font-bold text-slate-900">
            {(car.precio - downPayment).toLocaleString('es-ES')}€
          </span>
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>Total a pagar</span>
          <span>
            {(monthlyPayment * selectedTerm + downPayment).toLocaleString(
              'es-ES',
            )}
            €
          </span>
        </div>
      </div>

      {/* CTA WhatsApp */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        data-finance-trigger
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
      >
        <span className="material-symbols-outlined text-2xl">chat</span>
        <span>Solicitar Financiación por WhatsApp</span>
      </a>

      {/* Disclaimer */}
      <p className="text-xs text-slate-500 text-center mt-4 leading-relaxed">
        * Cálculo orientativo. Sujeto a aprobación de la entidad financiera. TIN{' '}
        {(INTEREST_RATE * 100).toFixed(1)}% sin comisiones ni gastos
        adicionales.
      </p>
    </div>
  );
}
