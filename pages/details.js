/* eslint-disable @next/next/no-img-element */
import { faClock, faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faEdit, faLink, faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import TopPart from "../components/common/TopPart";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from "react-share";
import {
  faFacebook,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { useRouter } from "next/router";
import LergeAdd from "../components/common/advertizer/LergeAdd";
import TopMenus from "../components/common/TopMenus";
import Link from "next/link";
import CategoryDetailsSideBar from "../components/common/CategoryDetailsSideBar";
import Breakingnews from "../components/common/BreakingNews";
import useStore from "../components/context/useStore";

const Details = () => {
  const [relatedNews, setRelatedNews] = useState(null);
  const { setError, siteInfo, ipAdress } = useStore();
  const [linkCopy, setLinkCopied] = useState(false);
  const [news, setNews] = useState(null);
  const [skip, setSkip] = useState(0);
  const router = useRouter();

  function handleCopyLink() {
    setLinkCopied(true);
    navigator.clipboard.writeText("http://localhost:3000/" + router.asPath);
  }

  async function getSingeNews(signal) {
    try {
      const res = await fetch(
        `http://localhost:3000/api/news?id=${router.query?.id}`,
        {
          signal,
        }
      );
      const result = await res.json();
      if (res.ok) {
        setNews(result);
        //get related news;
        await getRelatedNews(result.category);
        //update news views;
        if (ipAdress) {
          await updateViewPost();
        }
      } else throw result;
    } catch (error) {
      setError(true);
    }
  }
  async function updateViewPost(ipAdress) {
    try {
      await fetch(
        `http://localhost:3000/api/news/dashboard?id=${router.query.id}&news=true`,
        {
          headers: {
            "content-type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify({
            views: ipAdress,
            date: `${new Date()}`,
          }),
        }
      );
    } catch (error) {
      throw { message: "There was an error" };
    }
  }
  async function getRelatedNews(category) {
    try {
      const res = await fetch(
        `http://localhost:3000/api/news/home?category=${category}&limit=9&skip=${skip}`
      );
      const result = await res.json();
      console.log(result);
      if (res.ok) {
        setRelatedNews(result);
      } else throw result;
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    //get the news;
    (async () => {
      await getSingeNews(signal);
    })();
    return () => {
      controller.abort();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id, ipAdress]);

  if (!news) {
    return <p>Loading</p>;
  }
  return (
    <div className='mb-10'>
      <TopPart page='details' />
      <TopMenus />
      <Breakingnews />

      <LergeAdd picture={"/longadd.png"} />

      <section className='details-page-content-wrapper'>
        <section className='col-span-3 md:col-span-2 print:col-span-3'>
          <section className='news-details-wrapper'>
            {/* top part */}
            <div className='top-part'>
              <p className='space-x-1'>
                <FontAwesomeIcon icon={faClock} />
                <span>18 October, 2022 12:02</span>
              </p>
              <div className='space-x-5'>
                <button onClick={handleCopyLink}>
                  <FontAwesomeIcon icon={faLink} />
                  <span>{linkCopy ? "Copied!" : "Copy Link"}</span>
                </button>
                <button onClick={() => window.print()}>
                  <FontAwesomeIcon icon={faPrint} />
                  <span>Print</span>
                </button>

                <FacebookShareButton url={"https://navieasoft.com/"}>
                  <button>
                    <FontAwesomeIcon icon={faFacebook} />
                    <span>Share</span>
                  </button>
                </FacebookShareButton>
              </div>
            </div>

            {/* news details */}
            <div className='news-details'>
              <h3>{news.headline}</h3>
              <p className='text-lg my-5 space-x-2'>
                <FontAwesomeIcon className='text-gray-600' icon={faEdit} />
                <span>Online Reporter</span>
              </p>
              <img
                className='object-contain'
                src={`/assets/${news.mainImg}`}
                alt='news image'
              />

              <p className='text-justify mt-10 text-xl'>{news.body}</p>

              <p className='mt-10 text-xl'>
                {siteInfo?.name}/{news.editor_name}
              </p>

              <div className='social-icons'>
                <TwitterShareButton url={"https://navieasoft.com/"}>
                  <a className='text-blue-400'>
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                </TwitterShareButton>
                <LinkedinShareButton url={"https://navieasoft.com/"}>
                  <a className='text-[#0e76a8]'>
                    <FontAwesomeIcon icon={faLinkedin} />
                  </a>
                </LinkedinShareButton>
                <FacebookShareButton url={"https://navieasoft.com/"}>
                  <a className='text-blue-600'>
                    <FontAwesomeIcon icon={faFacebook} />
                  </a>
                </FacebookShareButton>
                <EmailShareButton
                  subject='This the subject of the email'
                  url={"https://navieasoft.com/"}
                >
                  <a>
                    <FontAwesomeIcon icon={faEnvelope} />
                  </a>
                </EmailShareButton>
              </div>
            </div>
          </section>

          <section>
            {/* Realated topic */}
            <div className='related-topic'>
              <p>Realated Topic, You can visit.</p>
              <div className='flex'>
                {news.raletedTopic.map((tp, i) => (
                  <Link href={`/category?q=${tp}`} key={i}>
                    <a>{tp}</a>
                  </Link>
                ))}
              </div>
            </div>

            <LergeAdd picture={"/longadd.png"} />

            {/* Realated news */}
            <section className='print:hidden'>
              <b className='mb-4 block'>Related News:</b>
              <div className='related-news-wrapper'>
                {relatedNews && relatedNews.length ? (
                  relatedNews.map((news) => (
                    <Link
                      href={`/details?category=${news.category}&id=${news._id}`}
                      key={news._id}
                    >
                      <a className='news'>
                        <img
                          className='object-cover object-center rounded-t'
                          src={`/assets/${news.mainImg}`}
                          alt=''
                        />
                        <p className='font-medium px-2 pb-3'>{news.headline}</p>
                      </a>
                    </Link>
                  ))
                ) : (
                  <div>
                    <p className='font-medium text-gray-600 mt-5 text-center'>
                      No data
                    </p>
                  </div>
                )}
              </div>
              <div className='flex justify-end mt-5'>
                <button
                  onClick={() => {
                    setSkip((prev) => prev + 9);
                    getRelatedNews(news.category, skip);
                  }}
                  className='btn btn-primary'
                >
                  Load More
                </button>
              </div>
            </section>
            <LergeAdd picture={"/longadd.png"} />
          </section>
        </section>

        {/* side bar */}
        <CategoryDetailsSideBar page={"details"} />
      </section>
    </div>
  );
};

export default Details;
