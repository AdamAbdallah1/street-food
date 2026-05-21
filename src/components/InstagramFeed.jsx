import {
  FaInstagram,
  FaPlay,
} from "react-icons/fa";

import post1 from "../assets/instagram/post1.png";
import post2 from "../assets/instagram/post2.png";
import post3 from "../assets/instagram/post3.png";
import post4 from "../assets/instagram/post4.png";
import post5 from "../assets/instagram/post5.png";

const posts = [
  post1,
  post2,
  post3,
  post4,
  post5,
];

export default function InstagramFeed() {
  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="max-w-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-soft sm:text-[11px]">
              Social Feed
            </p>

            <h2 className="mt-3 text-3xl font-black leading-none sm:text-4xl">
              Instagram
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
              Latest reels, burgers, wraps, loaded fries, and behind the scenes.
            </p>
          </div>

          <a
            href="https://www.instagram.com/thestreetfoodlb/"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary hidden h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-black transition duration-300 hover:scale-[1.02] sm:flex"
          >
            <FaInstagram />
            Follow
          </a>
        </div>

        <div className="hide-scrollbar flex snap-x gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 sm:overflow-visible">
          {posts.map((post, index) => (
            <a
              key={index}
              href="https://www.instagram.com/thestreetfoodlb/"
              target="_blank"
              rel="noreferrer"
              className="group relative block min-w-[78vw] snap-start overflow-hidden rounded-[2rem] border border-white/10 bg-black sm:min-w-0"
            >
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-95" />

              <img
                src={post}
                alt={`Instagram post ${index + 1}`}
                className="h-[430px] w-full object-cover transition duration-700 group-hover:scale-105 sm:h-[420px] lg:h-[460px]"
              />

              <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-xl">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black">
                  <FaInstagram className="text-xs" />
                </div>

                <div>
                  <p className="text-[11px] font-black text-white">
                    @thestreetfoodlb
                  </p>

                  <p className="text-[10px] text-white/60">
                    Street Food LB
                  </p>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-white">
                    Latest Drop
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-white/70">
                    Tap to open Instagram reel or post.
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-2xl transition duration-300 group-hover:scale-110">
                  <FaPlay className="ml-0.5 text-sm" />
                </div>
              </div>

              <div className="absolute inset-0 z-30 ring-1 ring-inset ring-white/0 transition duration-300 group-hover:ring-white/20" />
            </a>
          ))}
        </div>

        <a
          href="https://www.instagram.com/thestreetfoodlb/"
          target="_blank"
          rel="noreferrer"
          className="btn-primary mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-black sm:hidden"
        >
          <FaInstagram />
          Follow on Instagram
        </a>
      </div>
    </section>
  );
}