// Map component exports
export { InteractiveGigMap } from './interactive-gig-map';
export { InteractiveGigMapV2 } from './interactive-gig-map-v2';
export { LeafletMapWrapper } from './leaflet-map-wrapper';

// Use InteractiveGigMapV2 for new implementations as it includes
// proper Leaflet SSR handling and better performance
export { InteractiveGigMapV2 as default } from './interactive-gig-map-v2';
