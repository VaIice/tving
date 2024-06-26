import { MouseEventHandler, useEffect, useState } from "react";
import { GetMovieResults, getMovieUpcoming } from "../../API/axios";
import { useQuery } from "@tanstack/react-query";
import "../../css/mainCarousel.css"
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from "react-router-dom";

function MovieUpcoming() {
  const { data, isLoading } = useQuery<GetMovieResults>({
    queryKey: ['MovieUpcoming'],
    queryFn: () => getMovieUpcoming(1),
    staleTime: 5 * 60 * 1000,
  });

  const [movieUpcomingCurrentIndex, setMovieUpcomingCurrentIndex] = useState<number>(0);
  const MAX_UPCOMING_INDEX = 5;
  const navigator = useNavigate();
  
  function renderArrow(clickHandler: MouseEventHandler<HTMLDivElement>, hasArrow: boolean, direction: string) {
    if (direction === "prev" && movieUpcomingCurrentIndex <= 0) 
      return <div className="noneArrowPrevBox"/>
    else if (direction === "next" && movieUpcomingCurrentIndex >= 5)
      return <div className="noneArrowNextBox"/>

    return (
      hasArrow && (
        <div onClick={(e) => {
          clickHandler(e);
          direction === "prev" && movieUpcomingCurrentIndex === 0 ?
            setMovieUpcomingCurrentIndex(0) :
            setMovieUpcomingCurrentIndex(prev => prev + (direction === "prev" ? -1 : 1));
        }} className={`${direction === "prev" ? "arrowPrevBox" : "arrowNextBox"}`}>
          <i className={`fa-solid fa-chevron-${direction === "prev" ? "left" : "right"} arrow`}></i>
        </div>
    )
   )
 }

  function onClickDetail(id: number) {
    navigator(`/detail/M${id}`);
  }

 return (
   <>
     {!isLoading && data?.results ? (
        <Carousel
          centerSlidePercentage={90}
          centerMode={true}
         showStatus={false}
          // showIndicators={false}
          showThumbs={false}
          infiniteLoop={true}
           renderArrowPrev={(clickHandler, hasPrev) => renderArrow(clickHandler, hasPrev, 'prev')}
          renderArrowNext={(clickHandler, hasNext) => renderArrow(clickHandler, hasNext, 'next')}    
        >
         {data?.results?.slice(0, MAX_UPCOMING_INDEX + 1).map((e, index) => (
           <div key={index} className={`${movieUpcomingCurrentIndex === index ? "activePosterBox" : "inactivePosterBox"}`} onClick={() => onClickDetail(e.id)}>
             <img className={(movieUpcomingCurrentIndex <= MAX_UPCOMING_INDEX/2 && index === MAX_UPCOMING_INDEX)
               || (movieUpcomingCurrentIndex >= MAX_UPCOMING_INDEX / 2 && index === 0) ? "nonePoster":"poster"} src={`https://image.tmdb.org/t/p/original/${e.backdrop_path}`} alt="poster" />
             <span className="posterTitle">{e.title}</span>
            </div>
          ))}
         </Carousel>
      ) : (
        <></>
      )}
    </>  
 )
}

export default MovieUpcoming;