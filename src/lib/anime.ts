// Compatibility shim for animejs across different module formats
// Ensures we get a callable anime function in both dev and prod builds
// without relying on deep imports that may be blocked by package exports
import * as Anime from 'animejs';

// animejs may export as default, named export, or namespace depending on bundler
const anime: any = (Anime as any).default || (Anime as any).anime || (Anime as any);

export default anime;