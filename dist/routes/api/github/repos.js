"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const cheerio_1 = __importDefault(require("cheerio"));
const router = express_1.default.Router();
const getRepoNames = (userId, page = '1') => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const html = yield axios_1.default.get(`https://github.com/${userId}?tab=repositories&page=${page}`);
        let ulList = [];
        const $ = cheerio_1.default.load(html.data);
        const repoList = $('#user-repositories-list li');
        repoList.map((i, element) => {
            ulList[i] = {
                title: $(element).find('h3 a').text().replace(/\s/g, ''),
            };
        });
        return ulList;
    }
    catch (error) {
        return undefined;
    }
});
router.get('/repos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, page } = req.query;
    const repoNameList = yield getRepoNames(userId, page);
    if (repoNameList === undefined)
        return res
            .status(404)
            .json({ errorMessage: '해당 유저의 정보가 존재하지 않아요' });
    res.status(200).json({ data: repoNameList });
}));
exports.default = router;
