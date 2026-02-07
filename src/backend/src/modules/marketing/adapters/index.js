const { FacebookAdapter } = require('./facebook');
const { GoogleAdapter } = require('./google');
const { TikTokAdapter } = require('./tiktok');

class AdapterFactory {
    static getAdapter(source) {
        switch (source.toUpperCase()) {
            case 'FACEBOOK':
            case 'FACEBOOK_ADS':
                return new FacebookAdapter();
            case 'GOOGLE':
            case 'GOOGLE_ADS':
                return new GoogleAdapter();
            case 'TIKTOK':
            case 'TIKTOK_ADS':
                return new TikTokAdapter();
            default:
                throw new Error(`Unsupported lead source: ${source}`);
        }
    }
}

module.exports = AdapterFactory;
