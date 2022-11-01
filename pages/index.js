import React, { useEffect, useState } from "react";
import LergeAdd from "../components/common/advertizer/LergeAdd";
import SmallAdd from "../components/common/advertizer/SmallAd";
import Divider from "../components/common/divider/Divider";
import Arts from "../components/home/Arts";
import AtHome from "../components/home/AtHome";
import BusinessHighlight from "../components/home/BusinessHighlight";
import CountryHighlight from "../components/home/CountryHighlight";
import DailyReportOfCountry from "../components/home/DailyReportOfCountry";
import Features from "../components/home/Features";
import Living from "../components/home/Living";
import MostPopular from "../components/home/MostPopular";
import News from "../components/home/News";
import Opinion from "../components/home/Opinion";
import OtherNews from "../components/home/OtherNews";
import PoliticsHighligh from "../components/home/PoliticsHighligh";
import ScienceTechnology from "../components/home/ScienceTechnology";
import HotNews from "../components/home/sideSection/HotNews";
import OthersNews from "../components/home/sideSection/OthersNews";
import TopTenNews from "../components/home/sideSection/TopTenNews";
import TopNews from "../components/home/TopNews";
import TopMenus from "../components/common/TopMenus";
import TopPart from "../components/common/TopPart";
import Breakingnews from "../components/common/BreakingNews";
import MiddlePart from "../components/common/MiddlePart";
import TopHighlight from "../components/home/TopHighlight";
import useStore from "../components/context/useStore";

const Home = () => {
  const [otherNews, setOtherNews] = useState(null);
  const [highlight, setHlight] = useState(false);
  const [data, setData] = useState(null);
  const [ads, setAds] = useState(null);
  const store = useStore();

  useEffect(() => {
    let unsub = false;
    if (!unsub) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 100) setHlight(true);
        else setHlight(false);
      });
    }
    return () => (unsub = true);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    //main news for home page;
    (async function () {
      try {
        const res = await fetch("http://localhost:3000/api/news/home", {
          signal,
        });
        const result = await res.json();
        if (res.ok) {
          setData(result);
        } else throw result;
      } catch (error) {
        store.setError(true);
      }
    })();
    //ad images for home page
    (async function () {
      try {
        const res = await fetch("http://localhost:3000/api/settings/ads", {
          signal,
        });
        const result = await res.json();
        if (res.ok) {
          setAds(result.home);
        } else throw result;
      } catch (error) {
        console.log(error.message);
      }
    })();
    //rest of the news for home page;
    (async function () {
      try {
        const res = await fetch(
          "http://localhost:3000/api/news/home?otherNews=true",
          { signal }
        );
        const result = await res.json();
        if (res.ok) {
          setOtherNews(result);
        } else throw result;
      } catch (error) {
        console.log(error.message);
      }
    })();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div
        className={`sticky top-0 lg:static bg-white z-50 ${
          highlight ? "shadow" : ""
        }`}
      >
        <TopPart page='home' />
      </div>
      <MiddlePart />
      <TopMenus />
      <Breakingnews />
      <TopHighlight data={data?.hotNews?.slice(0, 3) || null} />
      <section className='home-part_1'>
        <section className='col-span-3'>
          <TopNews data={data?.topNews || null} />
          <DailyReportOfCountry />
          <CountryHighlight data={data?.countryNews || null} />
          <PoliticsHighligh data={data?.politicsNews || null} />
          <BusinessHighlight data={data?.businessNews || null} />
        </section>
        <section className='hidden md:block col-span-2 lg:col-span-1'>
          <HotNews data={data?.hotNews[3] || null} />
          <SmallAdd
            picture={`/ads/${ads?.small[0].adImg || ""}`}
            link={ads?.small[0].url}
          />
          <TopTenNews data={data?.latestNews?.slice(0, 10) || null} />
          <SmallAdd
            picture={`/ads/${ads?.small[1].adImg || ""}`}
            link={ads?.small[1].url}
          />
          <OthersNews
            data={data?.latestNews?.slice(10, data?.latestNews?.length || null)}
          />
          <SmallAdd
            picture={`/ads/${ads?.small[2].adImg || ""}`}
            link={ads?.small[2].url}
          />
        </section>
      </section>

      <LergeAdd
        picture={`/ads/${ads?.long[0].adImg || ""}`}
        link={ads?.long[0].url}
      />
      <Divider />
      <OtherNews data={otherNews?.otherNews || null} />
      <LergeAdd
        picture={`/ads/${ads?.long[1].adImg || ""}`}
        link={ads?.long[1].url}
      />
      <Divider />
      <AtHome data={otherNews?.homeNews || null} />
      <Divider />
      <Features data={otherNews?.featuresNews || null} />
      <LergeAdd
        picture={`/ads/${ads?.long[2].adImg || ""}`}
        link={ads?.long[2].url}
      />
      <Divider />
      <ScienceTechnology />
      <Divider />
      <MostPopular />
      <LergeAdd
        picture={`/ads/${ads?.long[3].adImg || ""}`}
        link={ads?.long[3].url}
      />
      <Divider />
      <News />
      <LergeAdd
        picture={`/ads/${ads?.long[4].adImg || ""}`}
        link={ads?.long[4].url}
      />
      <Divider />
      <Opinion />
      <Arts />
      <LergeAdd
        picture={`/ads/${ads?.long[5].adImg || ""}`}
        link={ads?.long[5].url}
      />
      <Divider />
      <Living />
    </div>
  );
};

export default Home;
