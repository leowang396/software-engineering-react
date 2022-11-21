import {
    findTuitById,
    createTuitByUser,
    deleteTuit
} from "../services/tuits-service";
import {
    createUser,
    deleteUsersByUsername
} from "../services/users-service";
import {findAllTuitsDislikedByUser, userTogglesTuitDislikes} from "../services/dislikes-service";
import {userTogglesTuitLikes} from "../services/likes-service";

describe('userTogglesTuitDislikes', () => {
    // Sample user and tuit to create.
    const testUser = {
        username: 'testUser',
        password: 'testing123',
        email: 'test@robot.com'
    };
    const testTuitContent = 'Message sent!';

    beforeAll(() => {
        return deleteUsersByUsername(testUser.username);
    })

    afterAll(() => {
        return deleteUsersByUsername(testUser.username);
    })

    test('can dislike neutral tuit correctly', async () => {
        const createdUser = await createUser(testUser);
        let createdTuit = await createTuitByUser(createdUser._id, testTuitContent);
        await userTogglesTuitDislikes(createdUser._id, createdTuit._id);
        createdTuit = await findTuitById(createdTuit._id);

        // Verifies that dislikes count has been updated.
        expect(createdTuit.stats.dislikes).toEqual(1);
        expect(createdTuit.stats.likes).toEqual(0);

        // Cleans up after testing
        await userTogglesTuitDislikes(createdUser._id, createdTuit._id);
        await deleteTuit(createdTuit._id);
    })

    test('can dislike disliked tuit correctly', async () => {
        const createdUser = await createUser(testUser);
        let createdTuit = await createTuitByUser(createdUser._id, testTuitContent);
        await userTogglesTuitDislikes(createdUser._id, createdTuit._id);
        await userTogglesTuitDislikes(createdUser._id, createdTuit._id);
        createdTuit = await findTuitById(createdTuit._id);

        // Verifies that dislikes count has been updated.
        expect(createdTuit.stats.dislikes).toEqual(0);
        expect(createdTuit.stats.likes).toEqual(0);

        // Cleans up after testing
        await deleteTuit(createdTuit._id);
    })

    test('can dislike liked tuit correctly', async () => {
        const createdUser = await createUser(testUser);
        let createdTuit = await createTuitByUser(createdUser._id, testTuitContent);
        await userTogglesTuitLikes(createdUser._id, createdTuit._id);
        await userTogglesTuitDislikes(createdUser._id, createdTuit._id);
        createdTuit = await findTuitById(createdTuit._id);

        // Verifies that dislikes count has been updated.
        expect(createdTuit.stats.dislikes).toEqual(1);
        expect(createdTuit.stats.likes).toEqual(0);

        // Cleans up after testing
        await userTogglesTuitDislikes(createdUser._id, createdTuit._id);
        await deleteTuit(createdTuit._id);
    })
});

describe('findAllTuitsDislikedByUser', () => {
    // Sample user and tuit to create.
    const testUser = {
        username: 'testUser',
        password: 'testing123',
        email: 'test@robot.com'
    };
    const testTuitContent = 'Message sent!';

    beforeAll(() => {
        return deleteUsersByUsername(testUser.username);
    })

    afterAll(() => {
        return deleteUsersByUsername(testUser.username);
    })

    test('correctly find disliked tuit', async () => {
        const createdUser = await createUser(testUser);
        let createdTuit = await createTuitByUser(createdUser._id, testTuitContent);
        await userTogglesTuitDislikes(createdUser._id, createdTuit._id);
        const dislikedTuit = await findAllTuitsDislikedByUser(createdUser._id);

        // Verifies the disliked tuit.
        expect(dislikedTuit.length).toEqual(1);
        expect(dislikedTuit[0]._id).toEqual(createdTuit._id);
        expect(dislikedTuit[0].tuit).toEqual(testTuitContent);

        // Cleans up after testing
        await userTogglesTuitDislikes(createdUser._id, createdTuit._id);
        await deleteTuit(createdTuit._id);
    })

    test("correctly find disliked tuit with the tuit sender", async () => {
        const createdUser = await createUser(testUser);
        let createdTuit = await createTuitByUser(createdUser._id, testTuitContent);
        await userTogglesTuitDislikes(createdUser._id, createdTuit._id);
        const dislikedTuit = await findAllTuitsDislikedByUser(createdUser._id);

        // Verifies the disliked tuit's sender.
        expect(dislikedTuit.length).toEqual(1);
        expect(dislikedTuit[0].postedBy.username).toEqual(testUser.username);
        expect(dislikedTuit[0].postedBy.password).toEqual(testUser.password);
        expect(dislikedTuit[0].postedBy.email).toEqual(testUser.email);

        // Cleans up after testing
        await userTogglesTuitDislikes(createdUser._id, createdTuit._id);
        await deleteTuit(createdTuit._id);
    })

    test('correctly find no disliked tuit', async () => {
        const createdUser = await createUser(testUser);
        let createdTuit = await createTuitByUser(createdUser._id, testTuitContent);
        const dislikedTuit = await findAllTuitsDislikedByUser(createdUser._id);

        // Verifies the disliked tuit's sender.
        expect(dislikedTuit).toBeEmpty;

        // Cleans up after testing
        await userTogglesTuitDislikes(createdUser._id, createdTuit._id);
        await deleteTuit(createdTuit._id);
    })
});