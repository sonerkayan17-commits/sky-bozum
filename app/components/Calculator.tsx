"use client";

import { useMemo, useState } from "react";

const products = [
  { name: "Razer Gold", rate: 60 },
  { name: "iTunes / App Store", rate: 45 },
  { name: "SMS Bozumu", rate: 45 },
  { name: "Paycell", rate: 60 },
  { name: "Pokus", rate: 60 },
  { name: "Tüm Sanal Kartlar", rate: 65 },
];

export default function Calculator() {
  const [productName, setProductName] = useState(products[0].name);
  const [amount, setAmount] = useState("1000");

  const selectedProduct =
    products.find((product) => product.name === productName) ?? products[0];

  const numericAmount = Number(amount.replace(",", ".")) || 0;

  const payout = useMemo(() => {
    return (numericAmount * selectedProduct.rate) / 100;
  }, [numericAmount, selectedProduct.rate]);

  return (
    <section id="hesapla" className="bg-slate-100 px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
            Canlı Hesaplama
          </span>

          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
            Bozum tutarınızı anında görün
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Ürünü seçin ve tutarı girin. Yaklaşık ödeme anında hesaplansın.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-4xl rounded-[32px] border border-white bg-white p-6 shadow-2xl shadow-slate-300/50 md:p-10">
          <div className="grid gap-6 md:grid-cols-2">
            <label className="block">
              <span className="mb-3 block text-sm font-black text-slate-700">
                Ürün seçin
              </span>

              <select
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base font-bold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                {products.map((product) => (
                  <option key={product.name} value={product.name}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-3 block text-sm font-black text-slate-700">
                Tutar girin
              </span>

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 pr-14 text-base font-bold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="1000"
                />

                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-400">
                  TL
                </span>
              </div>
            </label>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-950 p-6 text-white">
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Seçili ürün
              </p>

              <h3 className="mt-2 text-2xl font-black">
                {selectedProduct.name}
              </h3>

              <div className="mt-6 flex items-end justify-between">
                <span className="text-slate-400">Güncel oran</span>
                <span className="text-4xl font-black text-green-300">
                  %{selectedProduct.rate}
                </span>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-xl shadow-blue-600/20">
              <p className="text-sm font-bold uppercase tracking-wider text-blue-100">
                Yaklaşık ödeme
              </p>

              <p className="mt-3 text-4xl font-black md:text-5xl">
                {payout.toLocaleString("tr-TR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                TL
              </p>

              <p className="mt-5 text-sm leading-6 text-blue-100">
                Bu hesaplama bilgi amaçlıdır. Kesin oran işlem sırasında
                değişebilir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}