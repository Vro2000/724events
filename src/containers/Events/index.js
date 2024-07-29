import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);

  if (!data || !data.events) {
    return <div>Loading...</div>; // gére les erreurs si data est null ou undefined
  }

  const filteredEvents = data?.events.filter(event => !type || event.type === type).filter((event, index) => {
    if (
      (currentPage - 1) * PER_PAGE <= index &&
      index < currentPage * PER_PAGE
    ) {
      return true;
    }
    return false;
});

  const changeType = (newType) => {
    setCurrentPage(1); // Réinitialise à la première page après un changement de type
    setType(newType); // Met à jour le type sélectionné
  };
  const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1;
  const typeList = new Set(data?.events.map(event => event.type));

  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          />
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => [
                // eslint-disable-next-line react/no-array-index-key
                <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}
                style={{ 
                  color: currentPage === (n + 1) ? 'white' : 'darkgrey'  // Condition pour changer la couleur en rouge si c'est la page active
                }}
                >
                  {n + 1}
                </a>,
                n < (pageNumber - 1) && ' - ' // Ajoute un tiret 
            ])}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
