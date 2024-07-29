import React, { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";
import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  // Trier les données par date du plus ancien au plus récent
  const byDateDesc = data && data.focus ? data.focus.sort((evtA, evtB) => 
    new Date(evtA.date) - new Date(evtB.date)) : [];

  // supprimer le slide blanc dans le carousel
  const nextCard = () => {
    setTimeout(
      () => setIndex(index + 1 < byDateDesc.length ? index + 1 : 0),
      5000
    );
  };
  useEffect(() => {
    nextCard();
  });
  
  

  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        <React.Fragment key={`fragment-${event.title}-${event.date}`}>
          <div
            key={`slider-${event.title}-${event.date}`}
            className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc.map((item, radioIdx) => (
                <input
                  key={`radio-${item.title}-${item.date}`}
                  type="radio"
                  name="radio-button"
                  // utilisation de la variable "index" (slide actuel) au lieu de idx (index de la boucle map)
                  checked={index === radioIdx}
                  readOnly
                />
              ))}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Slider;
