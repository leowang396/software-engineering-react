import {useEffect, useState} from "react";
import * as service from "../../services/tuits-service";
import Tuits from "../tuits/index";

// Renders tuits by currently logged-in user.
const MyTuits = () => {
    const [tuits, setTuits] = useState([]);
    const findMyTuits = () => {
        service.findAllTuitsByUser("me")
            .then(tuits => setTuits(tuits));
    }
    useEffect(findMyTuits, []);
    const deleteTuit = (tid) =>
        service.deleteTuit(tid)
            .then(findMyTuits);

    return(
        <Tuits tuits={tuits} deleteTuit={deleteTuit} refreshTuits={findMyTuits}/>
    );
};

export default MyTuits;