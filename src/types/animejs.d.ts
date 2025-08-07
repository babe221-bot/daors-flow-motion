declare module 'animejs' {
  import { AnimeParams, AnimeInstance } from 'animejs';

  const anime: (params: AnimeParams) => AnimeInstance;
  export default anime;
}
