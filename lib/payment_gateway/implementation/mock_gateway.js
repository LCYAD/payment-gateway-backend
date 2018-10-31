/* eslint-disable arrow-body-style */

class MockGateway {
    /**
    * Mocking a Payment call:
    * 1. if mockResult return false, retry up to 3 times
    * 2. if success return 200, if failed 3 times return 601
     */
    static async call() {
        let retries = 0;
        let result;
        while (retries < 3) {
            result = MockGateway.mockResult();
            if (result) return { meta: 200 };
            await MockGateway.mockTimeout(retries * 1000);
            retries += 1;
        }
        return { meta: 601 };
    }

    static mockResult() {
        const random_number = Math.random();
        if (random_number <= 0.1) return false;
        return true;
    }

    static mockTimeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = MockGateway;
