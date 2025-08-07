declare module 'animejs' {
  import { AnimeParams, AnimeInstance } from 'animejs';

  function anime(params: AnimeParams): AnimeInstance;
  export default anime;
}
