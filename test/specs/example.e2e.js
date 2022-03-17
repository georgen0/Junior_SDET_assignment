const expectChai = require('chai').expect;
const fetch = require('node-fetch');

describe('Verify results match the search criteria', () => {
    it('Should search properly for Dubai Marina', async () => {
        await browser.url('https://www.bayut.com/');
        const inputSearch = await $('input[class="a41c4dcc _6a3a3de9"]');
        await inputSearch.setValue('Dubai Marina');
        await browser.pause(800);
        await browser.keys(['\uE007']);
        const findField = await $('a[href="/to-rent/property/dubai/dubai-marina/"]');
        await findField.click();
        let descriptions = browser.$$('div[class="_7afabd84"]');
        await descriptions.forEach((elem) => {
            return expect(elem).toHaveTextContaining("Dubai Marina");
        }
        );
    });
}
);

describe('Verify Popular Searches links work correctly', () => {
    it('Should verify popular searches links work correctly', async () => {
        await browser.url('https://www.bayut.com/');
        const toRent = await $('div=To Rent');
        await toRent.click();
        const list = await $$('a[class="_78d325fa "]');

        let urls = list.map(links => links.getAttribute('href').then((value) => {
            return new Promise(function (resolve, reject) {
                resolve('https://www.bayut.com' + value);
            });
        }));

        urls = await Promise.all(urls);
        urls = urls.filter(url => url.includes('/to-rent/apartments/dubai'));

        const requests = urls.map(fullURL => {
            return fetch(fullURL);
        });
        const responses = await Promise.all(requests);
        const statusCodes = responses.map(response => response.status);
        statusCodes.forEach(statusCode => {
            expectChai(statusCode).to.be.below(400);
        });
    }
    );
}
);