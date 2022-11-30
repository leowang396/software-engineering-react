import {useEffect, useState} from "react";
import * as service from "../../services/tuits-service";
import Tuits from "../tuits/index";
import * as likesService from "../../services/likes-service";
import * as dislikesService from "../../services/dislikes-service";

// Renders tuits by currently logged-in user.
const MyTuits = () => {
    const [tuits, setTuits] = useState([]);
    const [userLikedTuits, setUserLikedTuits] = useState([]);
    const [userDislikedTuits, setUserDislikedTuits] = useState([]);
    const findMyTuits = () => {
        service.findAllTuitsByUser("me")
            .then(tuits => setTuits(tuits));
    }
    const findUserLikedTuits = () => {
        return likesService.findAllTuitsLikedByUser("me")
            .then(tuits => setUserLikedTuits(tuits))
    }
    const findUserDislikedTuits = () => {
        return dislikesService.findAllTuitsDislikedByUser("me")
            .then(tuits => setUserDislikedTuits(tuits))
    }

    useEffect(() => {
        findMyTuits();
        findUserLikedTuits();
        findUserDislikedTuits();
    }, []);
    const deleteTuit = (tid) =>
        service.deleteTuit(tid)
            .then(findMyTuits);

    return(
        <Tuits tuits={tuits} userLikedTuits={userLikedTuits} userDislikedTuits={userDislikedTuits}
               deleteTuit={deleteTuit} refreshTuits={() => {
                   findMyTuits();
                   findUserLikedTuits();
                   findUserDislikedTuits();
               }}/>
    );
};

export default MyTuits;