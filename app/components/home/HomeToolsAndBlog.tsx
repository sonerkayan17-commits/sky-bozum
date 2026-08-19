'use client';

import DeferredQuickCalculator from './DeferredQuickCalculator';
import HomeBlog from '../HomeBlog';

export default function HomeToolsAndBlog() {
  return (
    <section className="render-later bg-[#05090f] py-7 sm:py-8" aria-label="Hesaplama ve bilgi merkezi">
      <div className="content-wide">
        <div className="grid items-stretch gap-4 lg:grid-cols-2">
          <DeferredQuickCalculator />
          <HomeBlog compact sidebar />
        </div>
      </div>
    </section>
  );
}
