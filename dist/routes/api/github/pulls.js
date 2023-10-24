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
const getPrNames = (userId, repoName, page = '1') => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const html = yield axios_1.default.get(`https://github.com/${userId}/${repoName}/pulls?page=${page}}`);
        let prInfos = [];
        const $ = cheerio_1.default.load(html.data);
        const prList = $('div[aria-label="Issues"] > div > div');
        prList.map((i, element) => {
            var _a;
            prInfos[i] = {
                title: $(element).find('a[data-hovercard-type="pull_request"]').text(),
                link: (_a = $(element)
                    .find('a[data-hovercard-type="pull_request"]')
                    .attr('href')) !== null && _a !== void 0 ? _a : 'https://github.com/error-page',
            };
        });
        return prInfos;
    }
    catch (error) {
        return undefined;
    }
});
router.get('/pulls', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, repoName, page } = req.query;
    const prNameList = yield getPrNames(userId, repoName, page);
    if (prNameList === undefined)
        return res
            .status(404)
            .json({ errorMessage: '해당 PR 정보가 존재하지 않아요' });
    res.status(200).json({ data: prNameList });
}));
exports.default = router;
