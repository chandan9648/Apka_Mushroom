export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── About Us ── */}
      <section className="bg-white scroll-mt-20">
        <div className="container-x py-16">
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-1">Our Story</p>
            <h2 className="text-3xl font-bold text-zinc-900">About RB Organic Mushroom</h2>
            <div className="mt-6 flex flex-col gap-4 text-sm text-zinc-600 leading-relaxed text-left">
              <p>
                Welcome to the kingdom of health! At RB Organic Mushroom, we believe that nature holds the key to optimal wellness. Founded with a passion for holistic health and sustainable agriculture, our mission is to bring the finest quality, certified organic mushrooms directly to your doorstep.
              </p>
              <p>
                Every batch is independently lab-tested and carefully hand-picked to ensure purity, potency, and absolute freshness. We do not use any artificial additives, fillers, or synthetic chemicals—just 100% natural fungi grown in pristine conditions. 
              </p>
              <p>
                Our journey started with a simple belief: everyone deserves access to the profound health benefits of functional mushrooms. Whether you are looking to boost your immunity, enhance your cognitive focus, or simply enjoy a healthier lifestyle, RB Organic Mushroom is your trusted partner in holistic wellness.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
