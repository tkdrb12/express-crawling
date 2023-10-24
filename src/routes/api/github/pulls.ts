import axios from 'axios';
import express from 'express';
import cheerio from 'cheerio';

const router = express.Router();

interface PrInfo {
  title: string;
  link: string;
}

const getPrNames = async (
  userId: string,
  repoName: string,
  page: string = '1'
) => {
  try {
    const html = await axios.get(
      `https://github.com/${userId}/${repoName}/pulls?page=${page}}`
    );

    let prInfos: PrInfo[] = [];

    const $ = cheerio.load(html.data);

    const prList = $('div[aria-label="Issues"] > div > div');

    prList.map((i, element) => {
      prInfos[i] = {
        title: $(element).find('a[data-hovercard-type="pull_request"]').text(),
        link:
          $(element)
            .find('a[data-hovercard-type="pull_request"]')
            .attr('href') ?? 'https://github.com/error-page',
      };
    });

    return prInfos;
  } catch (error) {
    return undefined;
  }
};

router.get('/pulls', async (req, res) => {
  const { userId, repoName, page } = req.query;

  const prNameList = await getPrNames(
    userId as string,
    repoName as string,
    page as string
  );

  if (prNameList === undefined)
    return res
      .status(404)
      .json({ errorMessage: '해당 PR 정보가 존재하지 않아요' });

  res.status(200).json({ data: prNameList });
});

export default router;
