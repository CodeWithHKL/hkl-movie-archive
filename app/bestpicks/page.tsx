"use client";
import React from 'react';
import Image from 'next/image';
import { BEST_PICKS_COLLECTIONS } from '@/lib/collections';
import SiteHeader from '@/components/SiteHeader';

export default function BestPicks() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-12 md:px-8 md:pt-16">
        <div className="mb-16 max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tighter md:text-5xl">
            Best <span className="text-ink-faint">Picks</span>
          </h1>
          <p className="mt-3 text-ink-soft">
            My favourite films and shows out of everything I&apos;ve watched, grouped by what makes them stick.
          </p>
        </div>

        {BEST_PICKS_COLLECTIONS.map((col, idx) => {
          const isFirst = idx === 0;

          return (
            <section key={idx} className="mb-20">
              <div className="mb-6 flex items-end justify-between gap-6 border-b border-rule pb-4">
                <div className="flex items-baseline gap-4">
                  <span className="num text-xs text-ink-faint">{String(idx + 1).padStart(2, '0')}</span>
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">{col.title}</h2>
                    <p className="mt-1 text-sm text-ink-soft">{col.description}</p>
                  </div>
                </div>
                <span className="num hidden shrink-0 text-xs text-ink-faint sm:block">{col.movies.length} titles</span>
              </div>

              <div className={`grid gap-x-5 gap-y-8 ${
                isFirst
                ? "grid-cols-2 lg:grid-cols-4"
                : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
              }`}>
                {col.movies.map(movie => (
                  <a
                    key={movie.id}
                    href={`https://www.google.com/search?q=${encodeURIComponent(`${movie.title} ${movie.year} movie`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <div className="relative mb-3 flex aspect-[2/3] items-center justify-center overflow-hidden rounded-lg bg-surface text-4xl font-semibold text-ink-faint/60 ring-1 ring-rule transition duration-300 group-hover:ring-ink-faint">
                      {movie.poster ? (
                        <Image
                          src={movie.poster}
                          alt={movie.title}
                          fill
                          sizes={isFirst ? "(max-width: 1024px) 50vw, 25vw" : "(max-width: 768px) 50vw, 20vw"}
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          priority={isFirst}
                        />
                      ) : (
                        <span>{movie.title[0]}</span>
                      )}
                    </div>

                    <h3 className="truncate text-sm font-medium" title={movie.title}>
                      {movie.title}
                    </h3>
                    <div className="num mt-0.5 flex items-baseline justify-between text-xs">
                      <span className="text-ink">{movie.myRating.toFixed(1)}</span>
                      <span className="text-ink-faint">{movie.year}</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
