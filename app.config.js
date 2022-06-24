import "dotenv/config";
// import appjson from "./app.json";

// console.log("APP CONFIG CONTANTS", process.env.TMDB_ID);
const tmdbId = process.env.TMDBID;
const apiKey = process.env.APIKEY;
const authDomain = process.env.AUTHDOMAIN;
const databaseURL = process.env.DATABASEURL;
const projectId = process.env.PROJECTID;
const storageBucket = process.env.STORAGEBUCKET;
const messagingSenderId = process.env.MESSAGINGSENDERID;
const appId = process.env.APPID;

export default {
  name: "Movie Tracker",
  slug: "movie-tracker",
  scheme: "movietracker",
  privacy: "unlisted",
  platforms: ["ios"],
  version: "1.1.4",
  orientation: "portrait",
  icon: "./assets/MovieTrackerIcon.png",
  splash: {
    image: "./assets/MovieTrackerSplash.png",
    resizeMode: "contain",
    backgroundColor: "#4285ec",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.mccoidco.movietracker",
    buildNumber: "1.1.4",
  },
  extra: {
    tmdbId,
    apiKey,
    authDomain,
    databaseURL,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  },
};
