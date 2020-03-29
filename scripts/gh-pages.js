var ghpages = require('gh-pages');

ghpages.publish(
    '__sapper__/export/lambda-proton',// <-- replace yourproject with your repo name
    {
        branch: 'gh-pages',
        repo: 'https://github.com/thinkjazz/lambda-proton.git',
        user: {
            name: 'thinkjazz',
            email: 'takeacutter@gmail.com'
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)
