/**
 * @jest-environment jsdom
 */
import Tuits from "../components/tuits";
import '@testing-library/jest-dom';
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {createTuitByUser, deleteTuit, findAllTuits} from "../services/tuits-service";
import {createUser, deleteUsersByUsername} from "../services/users-service";
import * as React from "react";
import {findAllTuitsDislikedByUser, userTogglesTuitDislikes} from "../services/dislikes-service";
import {userTogglesTuitLikes} from "../services/likes-service";

const MOCKED_USER = {username: 'alice', password: 'lv426', email: 'alice@weyland.com'};

const MOCKED_TUITS = [
    {tuit: "alice's tuit", postedBy: {"username": "alice"}, _id: "123",
        image: null, youtube: null, published: "Dec 25, 2021"},
    {tuit: "bob's tuit", postedBy: {"username": "bob"}, _id: "234",
        image: null, youtube: null, published: "Dec 25, 2022"},
    {tuit: "charlie's tuit", postedBy: {"username": "charlie"}, _id: "345",
        image: null, youtube: null, published: "Dec 25, 2023"}
];

test('neutral tuit is rendered correctly', async () => {
    // Creates a propert Tuit object by POSTing a sample user and tuit to the server.
    const testUser = await createUser(MOCKED_USER);
    const createdTuit = await createTuitByUser(testUser._id, MOCKED_TUITS[2].tuit);

    const tuits = await findAllTuits();
    render(
        <HashRouter>
            <Tuits tuits={tuits}/>
        </HashRouter>);
    const linkElement = screen.getByText(/charlie's tuit/i);
    expect(linkElement).toContainHTML(`<i class="fa-solid fa-thumbs-up" />`);
    expect(linkElement).toContainHTML(`<i class="fa-solid fa-thumbs-down" />`);

    // Cleans up.
    await deleteTuit(createdTuit._id);
    await deleteUsersByUsername(MOCKED_USER.username)
})

test('neural tuit is rendered correctly after dislikes', async () => {
    // Creates a propert Tuit object by POSTing a sample user and tuit to the server.
    const testUser = await createUser(MOCKED_USER);
    const createdTuit = await createTuitByUser(testUser._id, MOCKED_TUITS[2].tuit);
    await userTogglesTuitDislikes(testUser._id, createdTuit._id);

    const tuits = await findAllTuits();
    render(
        <HashRouter>
            <Tuits tuits={tuits}/>
        </HashRouter>);
    const linkElement = screen.getByText(/charlie's tuit/i);
    expect(linkElement).toContainHTML(`<i class="fa-solid fa-thumbs-up" />`);
    expect(linkElement).toContainHTML(`<i class="fa-solid fa-thumbs-down" style="color: red;" />`);

    // Cleans up.
    await userTogglesTuitDislikes(testUser._id, createdTuit._id);
    await deleteTuit(createdTuit._id);
    await deleteUsersByUsername(MOCKED_USER.username)
})

test('disliked tuit is rendered correctly after getting another dislike', async () => {
    // Creates a propert Tuit object by POSTing a sample user and tuit to the server.
    const testUser = await createUser(MOCKED_USER);
    const createdTuit = await createTuitByUser(testUser._id, MOCKED_TUITS[2].tuit);
    await userTogglesTuitDislikes(testUser._id, createdTuit._id);
    await userTogglesTuitDislikes(testUser._id, createdTuit._id);

    const tuits = await findAllTuits();
    render(
        <HashRouter>
            <Tuits tuits={tuits}/>
        </HashRouter>);
    const linkElement = screen.getByText(/charlie's tuit/i);
    expect(linkElement).toContainHTML(`<i class="fa-solid fa-thumbs-up" />`);
    expect(linkElement).toContainHTML(`<i class="fa-solid fa-thumbs-down" />`);

    // Cleans up.
    await deleteTuit(createdTuit._id);
    await deleteUsersByUsername(MOCKED_USER.username)
})

test('liked tuit is rendered correctly after getting disliked', async () => {
    // Creates a propert Tuit object by POSTing a sample user and tuit to the server.
    const testUser = await createUser(MOCKED_USER);
    const createdTuit = await createTuitByUser(testUser._id, MOCKED_TUITS[2].tuit);
    await userTogglesTuitLikes(testUser._id, createdTuit._id);
    await userTogglesTuitDislikes(testUser._id, createdTuit._id);

    const tuits = await findAllTuits();
    render(
        <HashRouter>
            <Tuits tuits={tuits}/>
        </HashRouter>);
    const linkElement = screen.getByText(/charlie's tuit/i);
    expect(linkElement).toContainHTML(`<i class="fa-solid fa-thumbs-up" />`);
    expect(linkElement).toContainHTML(`<i class="fa-solid fa-thumbs-down" style="color: red;" />`);

    // Cleans up.
    await userTogglesTuitDislikes(testUser._id, createdTuit._id);
    await deleteTuit(createdTuit._id);
    await deleteUsersByUsername(MOCKED_USER.username)
})

test('renders static content correctly', async () => {
    const tuits = MOCKED_TUITS;

    render(
        <HashRouter>
            <Tuits tuits={tuits}/>
        </HashRouter>);

    const linkElement = screen.getByText(/charlie's tuit/i);
    expect(linkElement).toBeInTheDocument();
})

test('my-dislikes renders RESTful response correctly', async () => {
    const testUser = await createUser(MOCKED_USER);
    const createdTuit = await createTuitByUser(testUser._id, MOCKED_TUITS[2].tuit);
    await userTogglesTuitDislikes(testUser._id, createdTuit._id);

    const tuits = await findAllTuitsDislikedByUser(testUser._id);
    render(
        <HashRouter>
            <Tuits tuits={tuits}/>
        </HashRouter>);
    const linkElement = screen.getByText(/charlie's tuit/i);
    expect(linkElement).toBeInTheDocument();

    // Cleans up.
    await userTogglesTuitDislikes(testUser._id, createdTuit._id);
    await deleteTuit(createdTuit._id);
    await deleteUsersByUsername(MOCKED_USER.username)
})