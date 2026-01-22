import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

function StarRating() {
  return (
    <div className="flex gap-1 mb-4 text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className="material-symbols-outlined filled-star text-[20px]"
        >
          star
        </span>
      ))}
    </div>
  );
}

const MeshGradient = ({ color, position, delay }) => (
  <div
    className={`absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-40 -z-10 ${color} ${position}`}
  />
);

export default function Testimonials({ testis = [] }) {
  return (
    <section
      className="py-24 bg-slate-100 relative overflow-hidden"
      id="testimonios"
    >
      {/* Atmospheric Background */}
      <MeshGradient color="bg-blue-300" position="-left-40 top-0" />
      <MeshGradient color="bg-indigo-300" position="-right-40 bottom-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black font-satoshi text-[#1F2937] mb-4 tracking-tight">
            Lo que dicen quienes ya nos conocen
          </h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={32}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          loop={true}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 3,
            },
          }}
          className="testimonials-swiper !pb-24"
        >
          {testis.map((testimonial, index) => (
            <SwiperSlide key={index} className="flex h-auto">
              <div className="bg-white/60 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl w-full flex flex-col justify-between min-h-[280px] sm:min-h-[300px]">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <StarRating />
                    {testimonial.isVerified && (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                        <span className="material-symbols-outlined text-[14px]">
                          verified
                        </span>
                        Verificado
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 mb-6 italic font-satoshi font-medium leading-relaxed">
                    "{testimonial.text}"
                  </p>
                </div>
                <div className="flex items-center justify-between font-satoshi mt-auto border-t border-slate-200/50 pt-4">
                  <span className="font-bold text-slate-900 tracking-tight">
                    — {testimonial.author}
                  </span>
                  {testimonial.vehicle && (
                    <span className="text-[11px] font-medium text-slate-400">
                      {testimonial.vehicle}
                    </span>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
