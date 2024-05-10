import type { Post } from '@/shared/constants/blog.ts';
import type { Page } from '@/shared/types/common.ts';

import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import BlogPostView from '@/widgets/BlogPost/view/blogPostView.ts';

import BlogPageView from '../view/BlogPageView.ts';

class BlogPageModel implements Page {
  private view: BlogPageView;

  constructor(parent: HTMLDivElement) {
    const newPost: Post[] = [
      {
        date: 'September 13',
        image: 'src/shared/img/png/bl-post-01.png',
        shortDescription: 'Best in hanging baskets. Prefers medium to high light.',
        time: 2,
        tittle: 'Top 10 Plants for Your Home',
      },
      {
        date: 'September 15',
        image: 'src/shared/img/png/bl-post-02.png',
        shortDescription: 'Cacti and succulents thrive in containers and because most are..',
        time: 3,
        tittle: 'Cacti & Succulent Care Tips',
      },
      {
        date: 'September 20',
        image: 'src/shared/img/png/bl-post-03.png',
        shortDescription: 'The benefits of houseplants are endless. In addition to..',
        time: 4,
        tittle: 'Best Houseplants Room by Room',
      },
      {
        date: 'September 29',
        image: 'src/shared/img/png/bl-post-04.png',
        shortDescription: 'Cacti are succulents are easy care plants for any home or patio. ',
        time: 6,
        tittle: 'Cactus & Succulent Care Tips',
      },
    ];
    const newPostView = newPost.map((post) => new BlogPostView(post, ''));
    this.view = new BlogPageView(parent, newPostView);
    this.init();
  }

  private init(): boolean {
    getStore().dispatch(setCurrentPage(PAGE_ID.BLOG));
    this.observeStoreLanguage();
    return true;
  }

  private observeStoreLanguage(): boolean {
    observeStore(selectCurrentLanguage, () => this.view.setPageTittle());
    return true;
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default BlogPageModel;
