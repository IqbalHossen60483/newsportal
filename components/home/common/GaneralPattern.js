/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { useEffect, useState } from "react";

const GaneralPattern = ({ title, isCategory }) => {
  const [news, setNews] = useState(null);

  useEffect(() => {
    (async function () {
      try {
        const res = await fetch(
          `http://localhost:3000/api/news/home?types=${title}`
        );
        const result = await res.json();
        if (res.ok) {
          setNews(result);
        } else throw result;
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, [title]);

  if (!news) return null;
  return (
    <div className='md:grid grid-cols-3 xl:grid-cols-5 mt-3 gap-5'>
      {news.map((item) => (
        <Link
          href={`/details?category=${item.category}&id=${item._id}`}
          key={item._id}
        >
          <a className='flex flex-col gap-y-2 hover:text-gray-500 py-4 border-t md:border-t-0'>
            {isCategory && <p className='font-medium'>{item.category}</p>}
            <img
              className='object-cover object-top'
              src={`/assets/${item.mainImg}`}
              alt='image'
            />
            <h3>{item.headline}</h3>
            <p className='text-justify'>{item.body.slice(0, 200)}...</p>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default GaneralPattern;
