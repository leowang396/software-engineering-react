/**
 * @jest-environment jsdom
 */
import Tuits from "../components/tuits";
import '@testing-library/jest-dom';
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {createTuitByUser, deleteTuit, findAllTuits} from "../services/tuits-service";
import {createUser, deleteUsersByUsername} from "../services/users-service";
import axios from "axios";
import * as React from "react";

jest.mock('axios');
axios.get.mockImplementation(() =>
                                 Promise.resolve({ data: {tuits: MOCKED_TUITS} }));

const MOCKED_USER = {username: 'alice', password: 'lv426', email: 'alice@weyland.com'};

const MOCKED_TUITS = [
    {tuit: "alice's tuit", postedBy: {"username": "alice"}, _id: "123",
        image: null, youtube: null, published: "Dec 25, 2021"},
    {tuit: "bob's tuit", postedBy: {"username": "bob"}, _id: "234",
        image: null, youtube: null, published: "Dec 25, 2022"},
    {tuit: "charlie's tuit", postedBy: {"username": "charlie"}, _id: "345",
        image: null, youtube: null, published: "Dec 25, 2023"}
];

test('tuit list renders static tuit array', () => {
  render(
      <HashRouter>
        <Tuits tuits={MOCKED_TUITS}/>
      </HashRouter>);
  const linkElement = screen.getByText(/charlie's tuit/i);
  expect(linkElement).toBeInTheDocument();
});

// This test requires UNmocked axios module and can be fragile.
test.skip('tuit list renders from RESTful API', async () => {
    // Creates a propert Tuit object by POSTing a sample user and tuit to the server.
    const testUser = await createUser(MOCKED_USER);
    const createdTuit = await createTuitByUser(testUser._id, MOCKED_TUITS[2].tuit);

    const tuits = await findAllTuits();
    render(
        <HashRouter>
            <Tuits tuits={tuits}/>
        </HashRouter>);
    const linkElement = screen.getByText(/charlie's tuit/i);
    expect(linkElement).toHaveClass();

    // Cleans up.
    await deleteTuit(createdTuit._id);
    await deleteUsersByUsername(MOCKED_USER.username)
})

test.skip('tuit list renders mocked', async () => {
    const response = await findAllTuits();
    const tuits = response.tuits;

    render(
        <HashRouter>
            <Tuits tuits={tuits}/>
        </HashRouter>);

    const linkElement = screen.getByText(/charlie's tuit/i);
    expect(linkElement).toBeInTheDocument();
});
