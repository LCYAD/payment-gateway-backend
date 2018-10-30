const config = require('../../config')();

test('development setting', () => {
    const expected_config = {
        express: {
            port: '8080'
        },
        redis: {
            host: '127.0.0.1',
            port: '6379'
        }
    };
    expect(config).toEqual(expected_config);
});
