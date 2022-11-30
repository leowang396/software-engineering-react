import Tuits from "../tuits/index";
import * as service from "../../services/dislikes-service";
import {useEffect, useState} from "react";
import * as likesService from "../../services/likes-service";

const MyDislikes = () => {
    const [userLikedTuits, setUserLikedTuits] = useState([]);
    const [dislikedTuits, setDislikedTuits] = useState([]);
    const findUserLikedTuits = () => {
        return likesService.findAllTuitsLikedByUser("me")
            .then(tuits => setUserLikedTuits(tuits))
    }
    const findTuitsIDislike = () =>
        service.findAllTuitsDislikedByUser("me")
            .then((tuits) => setDislikedTuits(tuits));
    useEffect(() => {
        findTuitsIDislike();
        findUserLikedTuits();
    }, []);

    return(
        <div>
            <Tuits tuits={dislikedTuits} userLikedTuits={userLikedTuits}
                   userDislikedTuits={dislikedTuits} refreshTuits={() => {
                       findTuitsIDislike();
                       findUserLikedTuits();
                   }}/>
        </div>
    );
};

export default MyDislikes;