import {
  faArrowDownShortWide,
  faArrowUpShortWide,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Header from "../../components/admin/common/header";
import SideBar from "../../components/admin/common/SideBar";
import useStore from "../../components/context/useStore";

const Admin = () => {
  const [news, setNews] = useState(null);
  const { setError } = useStore();
  const router = useRouter();
  const [postReport, setPostReport] = useState(null);
  const visitors = [
    { range: "Today's Visitors", count: 17 },
    { range: "This Month's Visitors", count: 55 },
    { range: "This year's Visitors", count: 103 },
  ];

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/api/news/dashboard", {
          signal,
        });
        const result = await res.json();
        setNews(result.someNews);
        setPostReport(result.postReport);
      } catch (error) {
        setError(true);
      }
    })();
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className='bg-gray-100'>
      <Header />
      <main className='flex gap-5'>
        <SideBar />
        <div className='dashboard-container'>
          <h3 className='mt-5'>Post Report</h3>
          <div className='post-details'>
            {postReport &&
              postReport.length &&
              postReport.map((item, i) => (
                <div className='item' key={i}>
                  <div className='flex justify-center items-center gap-1 font-bold'>
                    <p className='text-xl'>{item.count}</p>
                    <p className='text-green-800 ml-2'>{item.grouth}%</p>
                    {Math.sign(item.grouth) === 1 ? (
                      <FontAwesomeIcon icon={faArrowUpShortWide} />
                    ) : (
                      <FontAwesomeIcon icon={faArrowDownShortWide} />
                    )}
                  </div>
                  <p className='text-gray-600'>{item.name}</p>
                </div>
              ))}
          </div>
          <h3 className='mt-5'>Visitors Report</h3>
          <div className='post-details'>
            {visitors.map((item, i) => (
              <div className='item' key={i}>
                <div className='flex justify-center items-center gap-1 font-bold'>
                  <p className='text-xl'>{item.count}</p>
                  <p className='text-green-900'>+4.5%</p>
                  <FontAwesomeIcon icon={faArrowUpShortWide} />
                </div>
                <p className='text-gray-600'>{item.range}</p>
              </div>
            ))}
          </div>

          <h3 className='mt-12'>Some Latest News</h3>
          <div className='allnews-container w-full mt-2 cursor-pointer'>
            <table onClick={() => router.push("/admin/news")}>
              <thead>
                <tr>
                  <th>Headline</th>
                  <th>Category</th>
                  <th>Editor_name</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {news &&
                  news.map((news, i) => (
                    <tr key={i}>
                      <td>
                        {news.headline.slice(0, 200)}{" "}
                        {news.headline.length > 200 && "..."}
                      </td>
                      <td>{news.category}</td>
                      <td>{news.editorName}</td>
                      <td>{news.date}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Admin;
