import React from "react";
import './tuits.css';
import Tuit from "./tuit";
import * as likesService from "../../services/likes-service";
import * as dislikesService from "../../services/dislikes-service";

function Tuits({tuits = [], userLikedTuits = [], userDislikedTuits = [],
                   deleteTuit, refreshTuits}) {
    const likeTuit = (tuit) =>
        likesService
            .userTogglesTuitLikes("me", tuit._id)
            .then(refreshTuits)
            .catch(e => alert(e));

    const dislikeTuit = (tuit) =>
        dislikesService
            .userTogglesTuitDislikes("me", tuit._id)
            .then(refreshTuits)
            .catch(e => alert(e));

    return (
    <div>
      <ul className="ttr-tuits list-group">
        {
          tuits.map && tuits.map(tuit => {
              let liked = false;
              for (const t of userLikedTuits) {
                  if (t._id == tuit._id)
                      liked = true;
              };
              let disliked = false;
              for (const t of userDislikedTuits) {
                  if (t._id == tuit._id)
                      disliked = true;
              };
            return (
              <Tuit key={tuit._id} tuit={tuit} deleteTuit={deleteTuit}
                    userLiked={liked} userDisliked={disliked}
                    likeTuit={likeTuit} dislikeTuit={dislikeTuit}/>
            );
          })
        }
      </ul>
    </div>
  );
}

export default Tuits;