import Tuits from "../tuits/index";
import * as service from "../../services/likes-service";
import {useEffect, useState} from "react";
import * as likesService from "../../services/likes-service";
import * as dislikesService from "../../services/dislikes-service";

const MyLikes = () => {
    const [likedTuits, setLikedTuits] = useState([]);
    const [userDislikedTuits, setUserDislikedTuits] = useState([]);
    const findTuitsILike = () =>
        service.findAllTuitsLikedByUser("me")
            .then((tuits) => setLikedTuits(tuits));
    const findUserDislikedTuits = () => {
        return dislikesService.findAllTuitsDislikedByUser("me")
            .then(tuits => setUserDislikedTuits(tuits))
    }
    useEffect(() => {
        findTuitsILike();
        findUserDislikedTuits();
    }, []);

    return(
        <div>
            <Tuits tuits={likedTuits} userLikedTuits={likedTuits}
                   userDislikedTuits={userDislikedTuits} refreshTuits={() => {
                       findTuitsILike();
                       findUserDislikedTuits();
                   }}/>
        </div>
    );
};

export default MyLikes;