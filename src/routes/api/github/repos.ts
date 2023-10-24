import axios from 'axios';
import express from 'express';
import cheerio from 'cheerio';

const router = express.Router();

interface RepoInfo {
  title: string;
}

const getRepoNames = async (userId: string, page: string = '1') => {
  try {
    const html = await axios.get(
      `https://github.com/${userId}?tab=repositories&page=${page}`
    );

    let ulList: RepoInfo[] = [];

    const $ = cheerio.load(html.data);

    const repoList = $('#user-repositories-list li');

    repoList.map((i, element) => {
      ulList[i] = {
        title: $(element).find('h3 a').text().replace(/\s/g, ''),
      };
    });

    return ulList;
  } catch (error) {
    return undefined;
  }
};

router.get('/repos', async (req, res) => {
  const { userId, page } = req.query;

  const repoNameList = await getRepoNames(userId as string, page as string);

  if (repoNameList === undefined)
    return res
      .status(404)
      .json({ errorMessage: '해당 유저의 정보가 존재하지 않아요' });

  res.status(200).json({ data: repoNameList });
});

export default router;
